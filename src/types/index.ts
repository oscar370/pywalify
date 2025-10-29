export type Backend =
  | "wal"
  | "colorthief"
  | "colorz"
  | "fast_colorthief"
  | "modern_colorthief"
  | "haishoku"
  | "okthief"
  | "schemer2";

export type View = "image" | "preset" | "export";

export type Palette = {
  name: string;
  mode: "dark" | "light";
  colors: string[];
};

export type CustomTemplate = {
  name: string;
  extension: string;
  content: string;
};
