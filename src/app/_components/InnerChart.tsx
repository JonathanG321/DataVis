import type {
  DataItem,
  FilterOptions,
  GraphData,
  Setters,
} from "~/utils/types";
import ChartDisplay from "./ChartDisplay";
import ChartHeader from "./ChartHeader";
import type { AgChartOptions } from "ag-charts-community";
import type { Dispatch, SetStateAction } from "react";
import useChartData from "../hooks/useChartData";

type Props = {
  filterOptions: FilterOptions;
  totalData: GraphData[];
  filteredDataState: DataItem[];
  totalDataState: DataItem[];
  chartOptions: AgChartOptions;
  setters: Setters;
  setBaseData: Dispatch<SetStateAction<DataItem[]>>;
};

export default function InnerChart({
  filterOptions,
  chartOptions,
  filteredDataState,
  setters,
  totalData,
  totalDataState,
  setBaseData,
}: Props) {
  const newData = useChartData(filterOptions, setBaseData);
  if (!newData) return;
  console.log(newData);

  return (
    <div className="flex flex-col rounded-lg border-2 border-gray-700 bg-gray-800">
      <ChartHeader
        filterOptions={filterOptions}
        setFilterOptions={setters.setFilterOptions}
        totalData={totalData}
      />
      <ChartDisplay
        filteredDataState={filteredDataState}
        totalDataState={totalDataState}
        totalData={totalData}
        chartOptions={chartOptions}
        filterOptions={filterOptions}
      />
    </div>
  );
}
