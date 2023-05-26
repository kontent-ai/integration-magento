import { FC, useCallback, useEffect, useLayoutEffect, useState } from "react";

import { PoweredByLogo } from "./PoweredByLogo";
import { ProductTile } from "./ProductTile";
import { SearchInput } from "./SearchInput";
import { SelectedProducts } from "./SelectedProducts";
import { Product } from "./types/product";

const defaultUrlKeyAttribute = "url_key";

export const MagentoProductSelector: FC = () => {
  const [currentValue, setCurrentValue] = useState<null | ReadonlyArray<Product>>(null);
  const [searchResults, setSearchResults] = useState<ReadonlyArray<Product>>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [config, setConfig] = useState<null | Config>(null);

  const updateSize = useCallback(() => {
    const newSize = Math.max(document.documentElement.offsetHeight, 100);

    CustomElement.setHeight(Math.ceil(newSize));
  }, []);

  const updateValue = useCallback((newValue: ReadonlyArray<Product>) => {
    // send null instead of [] so that the element fails validation when it should not be empty
    CustomElement.setValue(newValue.length ? JSON.stringify(newValue) : null);
    setCurrentValue(newValue);
  }, []);

  useLayoutEffect(() => {
    updateSize();
  }, [updateSize, currentValue, searchResults]);

  useEffect(() => {
    CustomElement.init((el) => {
      if (typeof el.config?.storeUrl !== "string") {
        throw new Error(
          "Missing Magento Endpoint URL. Please provide the URL of the endpoint for querying products within the custom element JSON config.",
        );
      }
      setConfig({
        storeUrl: el.config.storeUrl,
        urlKeyAttribute: typeof el.config.urlKeyAttribute === "string"
          ? el.config.urlKeyAttribute
          : defaultUrlKeyAttribute,
        isMultiSelect: !!el.config.isMultiSelect,
      });
      const value = JSON.parse(el.value || "[]");
      setCurrentValue(Array.isArray(value) ? value : [value]); // treat old values (not saved as an array) as a single product
      setIsDisabled(el.disabled);
      updateSize();
    });
  }, [updateSize]);

  useEffect(() => {
    CustomElement.onDisabledChanged(setIsDisabled);
  }, []);

  useEffect(() => {
    const listener = () => {
      setWindowWidth(window.innerWidth);
      if (windowWidth !== window.innerWidth) {
        updateSize();
      }
    };
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [updateSize, windowWidth]);

  if (currentValue === null || config === null) {
    return null;
  }

  const search = (searchString: string) =>
    fetch(
      "/.netlify/functions/magento-client",
      {
        method: "POST",
        body: JSON.stringify({ query: searchString }),
        headers: {
          "x-root-url": config.storeUrl,
          "x-url-key": config.urlKeyAttribute,
        },
      },
    )
      .then(r => r.json())
      .then(setSearchResults);

  const onRemove = config.isMultiSelect ? (p: Product) => updateValue(currentValue.filter(v => v !== p)) : undefined;

  return (
    <>
      <SelectedProducts
        products={currentValue}
        onRemove={onRemove}
        isDisabled={isDisabled}
        onClear={() => updateValue([])}
      />
      <div className="search">
        <SearchInput
          isDisabled={isDisabled}
          onSubmit={search}
          onClear={() => setSearchResults([])}
        />
        {!!searchResults.length && (
          <div className="results">
            <h4>Search results ({searchResults.length})</h4>
            {searchResults.map(r => (
              <ProductTile
                key={r.id}
                product={r}
                onClick={() => updateValue(config.isMultiSelect ? [...currentValue, r] : [r])}
                isDisabled={isDisabled}
              />
            ))}
          </div>
        )}
      </div>
      <PoweredByLogo />
    </>
  );
};

MagentoProductSelector.displayName = "MagentoProductSelector";

type Config = Readonly<{
  storeUrl: string;
  urlKeyAttribute: string;
  isMultiSelect: boolean;
}>;
