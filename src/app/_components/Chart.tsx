"use client";
import { useState } from "react";
import { type AgChartProps, AgChartsReact } from "ag-charts-react";
import type { GraphData, DataItem } from "~/utils/types";
import { baseData } from "~/utils/testData";
import FilterSettings from "./FilterSettings";
import { defaultFilters } from "~/utils/constants";
import { getMonth, getWeek } from "~/utils/helperFunctions";
import ChartHeader from "./ChartHeader";

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
    },
  },
  legend: {
    enabled: true,
  },
  axes: [
    {
      type: "category",
      position: "bottom",
      keys: ["dateLabel"],
    },
    {
      type: "number",
      position: "right",
      keys: ["totalScore", "filteredScore"],
      max: 5,
      min: 0,
    },
  ],
  subtitle: {
    text: `Data from ${new Date().toDateString().split(" ")[1]} ${new Date().getFullYear()}`,
  },
};

export default function Chart() {
  const [filterOptions, setFilterOptions] = useState(defaultFilters);
  const [chartOptions, setChartOptions] =
    useState<AgChartProps["options"]>(baseChartOptions);
  const dateFilteredData = baseData.filter(
    (item) =>
      item.date.getFullYear() === filterOptions.timeFrameYear &&
      item.date.getMonth() === filterOptions.timeFrameMonth,
  );
  const [totalDataState, setTotalDataState] =
    useState<DataItem[]>(dateFilteredData);
  const [filteredDataState, setFilteredDataState] =
    useState<DataItem[]>(dateFilteredData);

  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const totalDataObject = getDataObject(totalDataState);
  const filteredDataObject = getDataObject(filteredDataState);
  const totalData: GraphData = Object.entries(totalDataObject).map(
    ([key, value]) => ({
      totalScore: value,
      filteredScore: filteredDataObject[key],
      dateLabel:
        filterOptions.timeFrameType === "monthly"
          ? parseInt(key.split(" ")[1] ?? key).toString()
          : key,
    }),
  );
  let footnote = filterOptions.timeFrameYear.toString();
  if (filterOptions.timeFrameType === "monthly") {
    footnote =
      getMonth(new Date(filterOptions.timeFrameMonth + 1 + "/01/2024")) +
      " " +
      footnote;
  } else if (filterOptions.timeFrameType === "weekly") {
    footnote = getWeek(filterOptions.timeFrameWeek);
  }

  const options = {
    ...chartOptions,
    data: totalData,
    footnote: { enabled: true, text: footnote, textAlign: "left" },
    series: [
      ...(totalDataState.length !== filteredDataState.length
        ? [
            {
              type: "line",
              xKey: "dateLabel",
              yKey: "filteredScore",
              yName: "Filtered Score",
            },
          ]
        : []),
      {
        type: "line",
        xKey: "dateLabel",
        yKey: "totalScore",
        yName:
          totalDataState.length === filteredDataState.length
            ? "Score"
            : "Total Score",
      },
    ],
  } as AgChartProps["options"];

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
            <div className="h-120 flex justify-center overflow-hidden">
              <div className="mb-2 w-full">
                <AgChartsReact options={options} />
              </div>
            </div>
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

function getDataObject(data: DataItem[]) {
  return data.reduce(
    (object, { score, dateLabel }) => ({
      ...object,
      [dateLabel]: !!object[dateLabel]
        ? (score + (object[dateLabel] ?? 0)) / 2
        : score,
    }),
    {} as Record<string, number>,
  );
}
