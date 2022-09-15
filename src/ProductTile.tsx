import { Product } from "./types/product";
import { FC } from "react";

type Props = Readonly<{
  product: Product;
  onClick?: () => void;
  onImageLoad: () => void;
}>;

export const ProductTile: FC<Props> = props => (
  <button
    type="button"
    name={props.product.title}
    tabIndex={props.onClick && 0}
    disabled={!props.onClick}
    className={`tile ${!props.onClick ? 'tile--is-selected' : ''}`}
    title={props.product.title}
    onClick={props.onClick}
  >
    <div className="title">{props.product.title}</div>
    <div className="id">SKU: {props.product.sku || 'N/A'}</div>
    {props.product.previewUrl
      ? <img className="preview" src={props.product.previewUrl} alt={props.product.title} onLoad={props.onImageLoad} />
      : <div className="no-image">No image available</div>}
  </button>
);

ProductTile.displayName = 'ProductTile';
