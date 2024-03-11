export type GraphDataItem = {
  date: string;
  score: number;
  client: string;
  reviewType: "payment" | "general" | "history" | "scheduled";
};
