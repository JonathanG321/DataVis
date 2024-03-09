export type GraphDataItem = {
  date: Date;
  score: number;
  client: string;
  reviewType: "payment" | "general" | "history" | "scheduled";
};
