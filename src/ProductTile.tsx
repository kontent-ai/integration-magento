import { Product } from "./types/product";
import { FC, MouseEvent } from "react";

type Props = Readonly<{
  product: Product;
  onClick?: () => void;
  onRemove?: () => void;
  isDisabled: boolean;
}>;

export const ProductTile: FC<Props> = props => {
  const remove = (e: MouseEvent) => {
    e.stopPropagation();
    props.onRemove?.();
  };

  return (
    <button
      type="button"
      name={props.product.title}
      tabIndex={props.onClick && !props.isDisabled ? 0 : -1}
      disabled={props.isDisabled || !props.onClick}
      className={`tile ${!props.onClick ? 'tile--is-selected' : ''}`}
      title={props.product.title}
      onClick={props.isDisabled ? undefined : props.onClick}
    >
      <div className="title-pane">
        <div className="title">{props.product.title}</div>
        {!props.isDisabled && props.onRemove && (
          <div
            className="product-action product-action--remove"
            title="Remove"
            onClick={remove}
          >
            <i className="icon-times" />
          </div>
        )}
      </div>
      <div className="id">SKU: {props.product.sku || 'N/A'}</div>
      {props.product.previewUrl
        ? <img
          className="preview"
          src={props.product.previewUrl}
          alt={props.product.title}
        />
        : <div className="no-image">No image available</div>}
    </button>
  );
};

ProductTile.displayName = 'ProductTile';
