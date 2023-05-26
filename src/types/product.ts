export type Product = Readonly<{
  id: number;
  title: string;
  previewUrl?: string;
  sku?: string;
  urlKey: string;
}>;

export const isProduct = (value: unknown): value is Product =>
  typeof value === "object"
  && value !== null
  && value.hasOwnProperty("id")
  && value.hasOwnProperty("title")
  && value.hasOwnProperty("urlKey");
