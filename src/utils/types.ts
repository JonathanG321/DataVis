export type BaseDataItem = {
  score: number;
  client: string;
  reviewType: "payment" | "general" | "history" | "scheduled";
};

export type RawDataItem = BaseDataItem & {
  date: Date;
};

export type GraphDataItem = BaseDataItem & {
  date: string;
};

export type FilterOptions = {
  reviewType: ("payment" | "general" | "history" | "scheduled")[];
};
