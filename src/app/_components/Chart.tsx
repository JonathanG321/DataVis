"use client";
import { useState } from "react";
import { type AgChartProps, AgChartsReact } from "ag-charts-react";
import type { FilterOptions, GraphData, DataItem } from "~/utils/types";
import { baseData } from "~/utils/testData";
import FilterSettings from "./FilterSettings";

const baseChartOptions: Exclude<AgChartProps["options"], "data"> = {
  title: { text: "Test" },
  width: 1000,
  height: 600,
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
      position: "left",
      keys: ["totalScore", "filteredScore"],
      max: 5,
      min: 0,
    },
  ],
  subtitle: {
    text: `Data from ${new Date().toDateString().split(" ")[1]} ${new Date().getFullYear()}`,
  },
};

const simpleSeries: AgChartProps["options"]["series"] = [
  {
    type: "line",
    xKey: "dateLabel",
    yKey: "totalScore",
    yName: "Score",
  },
];
const filteredSeries: AgChartProps["options"]["series"] = [
  {
    type: "line",
    xKey: "dateLabel",
    yKey: "filteredScore",
    yName: "Filtered Score",
  },
  {
    type: "line",
    xKey: "dateLabel",
    yKey: "totalScore",
    yName: "Total Score",
  },
];
export default function Chart() {
  const date = new Date();
  const weekDate = new Date();
  weekDate.setDate(weekDate.getDate() - weekDate.getDay());
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    reviewType: [],
    timeFrameYear: date.getFullYear(),
    timeFrameMonth: date.getMonth(),
    timeFrameWeek: weekDate,
    timeFrameType: "monthly",
  });
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
      dateLabel: key,
    }),
  );
  const options = {
    ...chartOptions,
    data: totalData,
    series:
      totalDataState.length === filteredDataState.length
        ? simpleSeries
        : filteredSeries,
  } as AgChartProps["options"];

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex">
        <div
          className="bg-gray-800"
          style={{ width: options.width, height: options.height }}
        >
          <AgChartsReact options={options} />
        </div>
        <FilterSettings
          setChartOptions={setChartOptions}
          setTotalData={setTotalDataState}
          setFilteredData={setFilteredDataState}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
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
