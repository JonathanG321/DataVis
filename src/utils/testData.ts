import type { FilterOptions, RawDataItem } from "./types";

export const testData: RawDataItem[] = [
  ...generateData(),
  ...generateData(),
  ...generateData(),
  ...generateData(),
  ...generateData(),
  ...generateData(),
  ...generateData(),
];

export const baseData = testData.map((item) => {
  const dateArr = item.date.toDateString().split(" ");
  return {
    ...item,
    date: dateArr[1] + " " + dateArr[2],
  };
});

export function generateData(): RawDataItem[] {
  return Array.from({ length: 20 }).map((_, i) => {
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
