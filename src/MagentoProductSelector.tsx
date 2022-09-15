import { FC, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Product } from "./types/product";
import { SearchInput } from "./SearchInput";
import { ProductTile } from "./ProductTile";
import { SelectedProduct } from "./SelectedProduct";
import { PoweredByLogo } from "./PoweredByLogo";

const defaultUrlKeyAttribute = 'url_key';

export const MagentoProductSelector: FC = () => {
  const [currentValue, setCurrentValue] = useState<null | Product | 'loading'>('loading');
  const [searchResults, setSearchResults] = useState<ReadonlyArray<Product>>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [config, setConfig] = useState<null | Config>(null);

  const updateSize = useCallback(() => {
    const newSize = Math.max(document.documentElement.offsetHeight, 100);

    CustomElement.setHeight(Math.ceil(newSize));
  }, []);

  const updateValue = useCallback((newValue: Product | null) => {
    // send null instead of string 'null' so that the element fails validation when it should not be empty
    CustomElement.setValue(newValue ? JSON.stringify(newValue) : null);
    setCurrentValue(newValue);
  }, []);

  useLayoutEffect(() => {
    updateSize();
  }, [updateSize, currentValue, searchResults]);

  useEffect(() => {
    CustomElement.init((el) => {
      if (typeof el.config?.storeUrl !== 'string') {
        throw new Error('Missing Magento Endpoint URL. Please provide the URL of the endpoint for querying products within the custom element JSON config.');
      }
      setConfig({
        storeUrl: el.config.storeUrl,
        urlKeyAttribute: typeof el.config.urlKeyAttribute === 'string' ? el.config.urlKeyAttribute
          : defaultUrlKeyAttribute
      });
      setCurrentValue(JSON.parse(el.value || 'null'));
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
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [updateSize, windowWidth]);

  if (currentValue === 'loading' || config === null) {
    return null;
  }

  const search = (searchString: string) =>
    fetch(
      '/.netlify/functions/magento-client',
      {
        method: 'POST',
        body: JSON.stringify({ query: searchString }),
        headers: {
          'x-root-url': config.storeUrl,
          'x-url-key': config.urlKeyAttribute,
        },
      })
      .then(r => r.json())
      .then(setSearchResults);

  return (
    <>
      <SelectedProduct
        product={currentValue}
        onRemove={() => updateValue(null)}
        isDisabled={isDisabled}
        onImageLoad={updateSize}
      />
      <div className="search">
        <SearchInput isDisabled={isDisabled} onSubmit={search} onClear={() => setSearchResults([])} />
        {!!searchResults.length && (
          <div className="results">
            <h4>Search results ({searchResults.length})</h4>
            {searchResults.map(r =>
              <ProductTile key={r.id} product={r} onClick={() => updateValue(r)} onImageLoad={updateSize} />
            )}
          </div>
        )}
      </div>
      <PoweredByLogo />
    </>
  );
};

MagentoProductSelector.displayName = 'MagentoProductSelector';

type Config = Readonly<{
  storeUrl: string;
  urlKeyAttribute: string;
}>;
