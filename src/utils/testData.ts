import type { DataItem, FilterOptions } from "./types";

export function getBaseData() {
  return [
    ...generateData(),
    ...generateData(),
    ...generateData(),
    ...generateData(),
    ...generateData(),
    ...generateData(),
    ...generateData(),
  ];
}

export function generateData(): DataItem[] {
  return Array.from({ length: 365 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
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
      date,
      score: Math.round(Math.random() * 50) / 10,
      reviewType,
      client: "me",
    };
  });
}
