import { SORT_PREFIX } from "./SORT_PREFIX";

export type TKey = string | number | symbol;

export type Values<T> = T[keyof T];

export type SortedColumn<T> = {
  key: T;
  order: "asc" | "desc";
};

export type Comparator<T> = (a: T, b: T) => number;
export type AscendingComparatorsDict<V extends object, K extends keyof V> = {
  [key in K]: Comparator<V[key]>;
};

export type SortedPropertiesFromParams<Obj> = Values<{
  [key in keyof Obj]-?: key extends `${typeof SORT_PREFIX}${infer K}`
    ? K
    : never;
}>;

export type OrderByParams<T extends string> = {
  [key in `${typeof SORT_PREFIX}${T}`]: "asc" | "desc";
};
