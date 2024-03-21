"use client";
import { useState } from "react";
import { type AgChartProps, AgChartsReact } from "ag-charts-react";
import type { GraphData, DataItem, FilterOptions } from "~/utils/types";
import { baseData } from "~/utils/testData";
import FilterSettings from "./FilterSettings";
import { defaultFilters } from "~/utils/constants";
import ChartHeader from "./ChartHeader";
import ChartDisplay from "./ChartDisplay";

const baseChartOptions: Exclude<AgChartProps["options"], "data"> = {
  background: { fill: "rgb(31 41 55)" },
  padding: { bottom: 40, left: 40, right: 40, top: 40 },
  theme: {
    baseTheme: "ag-polychroma-dark",
    overrides: {
      line: {
        series: {
          highlightStyle: {
            series: {
              dimOpacity: 0.2,
            },
          },
        },
      },
      bar: {
        series: {
          highlightStyle: {
            series: {
              dimOpacity: 0.5,
            },
          },
        },
      },
    },
  },
  legend: {
    enabled: true,
    reverseOrder: true,
  },
};

export default function Chart() {
  const [filterOptions, setFilterOptions] = useState(defaultFilters);
  const { timeFrameMonth, timeFrameType, timeFrameWeek, timeFrameYear } =
    filterOptions;
  const [chartOptions, setChartOptions] =
    useState<AgChartProps["options"]>(baseChartOptions);
  const dateFilteredData = baseData.filter(
    (item) =>
      item.date.getFullYear() === timeFrameYear &&
      item.date.getMonth() === timeFrameMonth,
  );
  const [totalDataState, setTotalDataState] =
    useState<DataItem[]>(dateFilteredData);
  const [filteredDataState, setFilteredDataState] =
    useState<DataItem[]>(dateFilteredData);

  const totalDataObject = getDataObject(totalDataState, timeFrameType);
  const filteredDataObject = getDataObject(filteredDataState, timeFrameType);
  const totalData: GraphData[] = Object.entries(totalDataObject).map(
    ([key, value]) => {
      const dateKey =
        timeFrameType === "yearly"
          ? new Date(timeFrameYear, parseInt(key))
          : new Date(key);
      return {
        totalScore: parseFloat(value.toFixed(1)),
        filteredScore: parseFloat((filteredDataObject[key] ?? 0).toFixed(1)),
        date: dateKey,
        dateLabel: key,
        filteredResponses: filteredDataState.reduce(
          (total, current) =>
            current.date.toDateString() === dateKey.toDateString()
              ? total + 1
              : total,
          0,
        ),
        totalResponses: totalDataState.reduce(
          (total, current) =>
            current.date.toDateString() === dateKey.toDateString()
              ? total + 1
              : total,
          0,
        ),
      };
    },
  );

  // const hello = await api.post.hello.query({ text: "from tRPC" });

  const setters = {
    setChartOptions,
    setTotalData: setTotalDataState,
    setFilteredData: setFilteredDataState,
    setFilterOptions: setFilterOptions,
  };

  return (
    <div className="flex w-full flex-col items-center bg-gray-800">
      <div className="mt-16 flex w-full rounded bg-black">
        <div className="w-9/12 p-4 pr-2">
          <div className="flex flex-col rounded-lg border-2 border-gray-700 bg-gray-800">
            <ChartHeader
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
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
        </div>
        <div className="w-3/12 p-4 pl-2">
          <FilterSettings setters={setters} filterOptions={filterOptions} />
        </div>
      </div>
      {/* <CrudShowcase /> */}
    </div>
  );
}

function getDataObject(
  data: DataItem[],
  timeFrameType: FilterOptions["timeFrameType"],
) {
  return data.reduce(
    (object, { score, date }) => {
      const key =
        timeFrameType === "yearly" ? date.getMonth() : date.toDateString();
      return {
        ...object,
        [key]: !!object[key] ? (score + (object[key] ?? 0)) / 2 : score,
      };
    },
    {} as Record<string, number>,
  );
}
