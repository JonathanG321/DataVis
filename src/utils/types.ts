export type DataItem = {
  score: number;
  client: string;
  reviewType: "payment" | "general" | "history" | "scheduled";
  date: Date;
  dateLabel: string;
};

export type FilterOptions = {
  reviewType: ("payment" | "general" | "history" | "scheduled")[];
};

export type GraphData = {
  totalScore: number;
  filteredScore?: number;
  dateLabel: string;
}[];
