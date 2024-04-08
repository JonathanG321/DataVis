import type { DateOptions, FilterOptions } from "./types";

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
export const dateFilters: DateOptions = {
  timeFrameYear: date.getFullYear(),
  timeFrameMonth: date.getMonth(),
  timeFrameWeek: weekDate,
  timeFrameType: "monthly",
};
export const defaultFilters: FilterOptions = {
  reviewType: [],
};
