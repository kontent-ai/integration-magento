import { Product } from "./types/product";
import { FC } from "react";
import { ProductTile } from "./ProductTile";

type Props = Readonly<{
  product: Product | null;
  onRemove: () => void;
  isDisabled: boolean;
  onImageLoad: () => void;
}>

export const SelectedProduct: FC<Props> = props => (
  <div className="content">
    <h4 className="title">
      <span className={`text ${props.product ? 'text--is-selected' : ''}`}>
        {props.product ? 'Selected product' : 'No product selected'}
      </span>
      {!!props.product && (
        <span className="btn-wrapper">
          <button
            className="btn btn--secondary btn--xs"
            onClick={props.onRemove}
            disabled={props.isDisabled}
          >
            Clear
          </button>
        </span>
      )}
    </h4>
    {!!props.product && <ProductTile product={props.product} onImageLoad={props.onImageLoad} />}
  </div>
);

SelectedProduct.displayName = 'SelectedProduct';
