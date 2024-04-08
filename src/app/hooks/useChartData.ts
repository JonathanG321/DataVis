import type { Dispatch, SetStateAction } from "react";
import { api } from "~/trpc/react";
import type { DataItem, DateOptions } from "~/utils/types";

export default function useChartData(
  filters: DateOptions,
  setBaseData: Dispatch<SetStateAction<DataItem[]>>,
) {
  const { data: newData, error } = api.chart.getData.useQuery(filters);
  if (error ?? !newData) {
    console.log(error);
    return;
  }
  setBaseData(newData);
  return newData;
}
