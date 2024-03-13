import type { FilterOptions } from "./types";

export const timeRange = ["weekly", "monthly", "yearly"];

export const reviewTypes: FilterOptions["reviewType"] = [
  "payment",
  "general",
  "history",
  "scheduled",
];
