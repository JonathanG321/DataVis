import type { FilterOptions } from "./types";

export const timeRange = ["weekly", "monthly", "yearly"];

export const reviewTypes: FilterOptions["reviewType"] = [
  "payment",
  "general",
  "history",
  "scheduled",
];

const date = new Date();
const weekDate = new Date();
weekDate.setDate(weekDate.getDate() - weekDate.getDay());
export const defaultFilters: FilterOptions = {
  reviewType: [],
  timeFrameYear: date.getFullYear(),
  timeFrameMonth: date.getMonth(),
  timeFrameWeek: weekDate,
  timeFrameType: "monthly",
};
