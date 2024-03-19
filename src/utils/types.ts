import type { AgChartProps } from "ag-charts-react";
import type { Dispatch, SetStateAction } from "react";

export type DataItem = {
  score: number;
  client: string;
  reviewType: "payment" | "general" | "history" | "scheduled";
  date: Date;
};

export type FilterOptions = {
  reviewType: ("payment" | "general" | "history" | "scheduled")[];
  timeFrameYear: number;
  timeFrameMonth: number;
  timeFrameWeek: Date;
  timeFrameType: "weekly" | "monthly" | "yearly";
};

export type GraphData = {
  totalScore?: number;
  filteredScore?: number;
  date: Date;
  totalResponses?: number;
  filteredResponses?: number;
};

export type Setters = {
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
  setChartOptions: Dispatch<SetStateAction<AgChartProps["options"]>>;
  setTotalData: Dispatch<SetStateAction<DataItem[]>>;
  setFilteredData: Dispatch<SetStateAction<DataItem[]>>;
};
