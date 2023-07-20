import { SORT_PREFIX } from "./SORT_PREFIX";
import {
  AscendingComparatorsDict,
  Comparator,
  SortedColumn,
  SortedPropertiesFromParams,
} from "./types";

function opposite<T>(comparator: Comparator<T>) {
  return (a: T, b: T) => -comparator(a, b);
}

function combineComparators<T>(...comparators: Comparator<T>[]) {
  return (a: T, b: T) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}

export function indifferentComparator<T>(a: T, b: T) {
  return 0;
}

export function getSorted<V extends object, K extends keyof V>(
  ascendingComparators: AscendingComparatorsDict<V, K>,
  orderBy: SortedColumn<K>[],
  items: V[]
): V[] {
  const comparators = orderBy.map((orderBy) => {
    const { key, order } = orderBy;
    const ascendingComparator = ascendingComparators[key];

    if (!ascendingComparator) return indifferentComparator;

    const propertyComparator =
      order === "asc" ? ascendingComparator : opposite(ascendingComparator);
    return (a: V, b: V) => propertyComparator(a[key], b[key]);
  });

  const combinedComparator = combineComparators(...comparators);

  const res = [...items];

  res.sort(combinedComparator);

  return res;
}

export function numberAscending(a: number, b: number) {
  return a - b;
}
export function stringAscending<T extends string | undefined>(a: T, b: T) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a.localeCompare(b);
}

export function timestampNewerFirst(a: number, b: number) {
  return b - a;
}

export function isValidOrder(value: unknown): value is "asc" | "desc" {
  return value === "asc" || value === "desc";
}

export function isSortQueryParam(
  value: unknown
): value is `${typeof SORT_PREFIX}${string}` {
  if (typeof value !== "string") return false;
  return value.startsWith(SORT_PREFIX);
}

export function getSortedProperty<P extends string>(
  value: `${typeof SORT_PREFIX}${P}`
): P {
  return value.slice(SORT_PREFIX.length) as P;
}

export function parseSortingParams<Obj extends object>(
  params: Obj
): SortedColumn<SortedPropertiesFromParams<Obj>>[] {
  const res: SortedColumn<SortedPropertiesFromParams<Obj>>[] = [];

  const keys = Object.keys(params) as (keyof Obj)[];

  for (const param of keys) {
    if (!isSortQueryParam(param)) continue;

    const order = params[param];
    if (!isValidOrder(order)) continue;

    const sortedProperty = getSortedProperty(param);

    res.push({
      key: sortedProperty as SortedPropertiesFromParams<Obj>,
      order,
    });
  }
  return res;
}
