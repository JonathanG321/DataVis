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

export function getWeek(date: Date) {
  const newDate = new Date(date.toDateString());
  const startDate = `${getMonth(newDate)} ${newDate.toDateString().split(" ")[2]}`;
  newDate.setDate(newDate.getDate() + 7);
  const endDate = `${getMonth(newDate)} ${newDate.toDateString().split(" ")[2]}`;
  const weekDisplay = `${startDate}${date.getFullYear() !== newDate.getFullYear() ? " " + date.getFullYear() : ""} - ${endDate} ${newDate.getFullYear()}`;
  return weekDisplay;
}
