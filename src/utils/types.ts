import type { AgChartProps } from "ag-charts-react";
import type { Dispatch, SetStateAction } from "react";

export type DataItem = {
  score: number;
  client: string;
  reviewType: "payment" | "general" | "history" | "scheduled";
  date: Date;
};

export type DateOptions = {
  timeFrameYear: number;
  timeFrameMonth: number;
  timeFrameWeek: Date;
  timeFrameType: "weekly" | "monthly" | "yearly";
};

export type FilterOptions = {
  reviewType: ("payment" | "general" | "history" | "scheduled")[];
};

export type GraphData = {
  totalScore?: number;
  filteredScore?: number;
  date: Date;
  dateLabel: string;
  totalResponses?: number;
  filteredResponses?: number;
};

export type Setters = {
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
  setDateOptions: Dispatch<SetStateAction<DateOptions>>;
  setChartOptions: Dispatch<SetStateAction<AgChartProps["options"]>>;
  setTotalData: Dispatch<SetStateAction<DataItem[]>>;
  setFilteredData: Dispatch<SetStateAction<DataItem[]>>;
};
