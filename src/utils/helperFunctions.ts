import type { Dispatch, SetStateAction } from "react";

export function updateStateObject<K, T extends keyof K>(
  key: T,
  value: K[T],
  setStateObject: Dispatch<SetStateAction<K>>,
): K {
  let newData = {} as K;
  setStateObject((prev) => {
    const newObject = { ...prev, [key]: value };
    newData = { ...newObject };
    return newObject;
  });
  return newData;
}

export function getMonth(date: Date) {
  return date.toDateString().split(" ")[1];
}

export function getWeek(date: Date) {
  const newDate = new Date(date.toDateString());
  const startDate = `${getMonth(newDate)} ${newDate.toDateString().split(" ")[2]}`;
  newDate.setDate(newDate.getDate() + 6);
  const endDate = `${getMonth(newDate)} ${newDate.toDateString().split(" ")[2]}`;
  const weekDisplay = `${startDate}${date.getFullYear() !== newDate.getFullYear() ? ", " + date.getFullYear() : ""} - ${endDate}, ${newDate.getFullYear()}`;
  return weekDisplay;
}

export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}
