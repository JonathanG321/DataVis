import type { DataItem, FilterOptions } from "./types";

export const baseData: DataItem[] = [
  ...generateData(),
  ...generateData(),
  ...generateData(),
  ...generateData(),
  ...generateData(),
  ...generateData(),
  ...generateData(),
];

export function generateData(): DataItem[] {
  return Array.from({ length: 365 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateArr = date.toDateString().split(" ");
    let reviewType: FilterOptions["reviewType"][0] = "scheduled";
    switch (Math.ceil(Math.random() * 4)) {
      case 1:
        reviewType = "general";
        break;
      case 2:
        reviewType = "payment";
        break;
      case 3:
        reviewType = "history";
        break;
      default:
        reviewType = "scheduled";
        break;
    }
    return {
      dateLabel:
        dateArr[0] +
        ", " +
        dateArr[1] +
        " " +
        parseInt(dateArr[2] ?? "").toString(),
      date,
      score: Math.round(Math.random() * 50) / 10,
      reviewType,
      client: "me",
    };
  });
}
