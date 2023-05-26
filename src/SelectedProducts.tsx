import { FC } from "react";

import { ProductTile } from "./ProductTile";
import { Product } from "./types/product";

type Props = Readonly<{
  products: ReadonlyArray<Product>;
  onRemove?: (product: Product) => void;
  onClear: () => void;
  isDisabled: boolean;
}>;

export const SelectedProducts: FC<Props> = props => {
  const isEmpty = !props.products.length;
  const onRemove = (p: Product) => props.onRemove && (() => props.onRemove?.(p));

  return (
    <div className="content">
      <h4 className="title">
        <span className={`text ${!isEmpty ? "text--is-selected" : ""}`}>
          {createTitle(props.products, !!props.onRemove)}
        </span>
        {!isEmpty && (
          <span className="btn-wrapper">
            <button
              className="btn btn--secondary btn--xs"
              onClick={props.onClear}
              disabled={props.isDisabled}
            >
              Clear
            </button>
          </span>
        )}
      </h4>
      {props.products.map(p => (
        <ProductTile
          key={p.id}
          product={p}
          isDisabled={props.isDisabled}
          onRemove={onRemove(p)}
        />
      ))}
    </div>
  );
};

SelectedProducts.displayName = "SelectedProducts";

const createTitle = (products: ReadonlyArray<Product>, isMultiSelect: boolean): string => {
  if (products.length === 0) {
    return `No product${isMultiSelect ? "s" : ""}`;
  }
  if (isMultiSelect) {
    return `Selected products (${products.length})`;
  }
  return "Selected product";
};
