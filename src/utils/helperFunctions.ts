import type { Dispatch, SetStateAction } from "react";

export function updateStateObject<K, T extends keyof K>(
  key: T,
  value: K[T],
  setStateObject: Dispatch<SetStateAction<K>>,
) {
  setStateObject((prev) => ({ ...prev, [key]: value }));
}

export function getMonth(date: Date) {
  return date.toDateString().split(" ")[1];
}