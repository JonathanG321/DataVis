"use client";
import { useState } from "react";
import { type AgChartProps, AgChartsReact } from "ag-charts-react";
import type { GraphData, DataItem } from "~/utils/types";
import { baseData } from "~/utils/testData";
import FilterSettings from "./FilterSettings";
import { defaultFilters } from "~/utils/constants";
import { getMonth, getWeek } from "~/utils/helperFunctions";
import ChartHeader from "./ChartHeader";
import { renderToString } from "react-dom/server";
import { ToolTip } from "./ToolTip";
import type { AgLineSeriesTooltipRendererParams } from "ag-charts-community";

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

  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const totalDataObject = getDataObject(totalDataState);
  const filteredDataObject = getDataObject(filteredDataState);
  const totalData: GraphData[] = Object.entries(totalDataObject).map(
    ([key, value]) => {
      let dateLabel = key;
      if (timeFrameType === "monthly") {
        dateLabel = key.split(" ")[2] ?? key;
      } else if (timeFrameType === "yearly") {
        dateLabel = key.split(" ")[1] + " " + key.split(" ")[2] ?? key;
      }
      return {
        totalScore: value,
        filteredScore: filteredDataObject[key],
        dateLabel,
        dateValue: new Date(key),
      };
    },
  );

  let footnote = timeFrameYear.toString();
  let minVal = new Date();
  let maxVal = new Date();
  if (timeFrameType === "monthly") {
    footnote =
      getMonth(new Date(timeFrameMonth + 1 + "/01/2024")) + " " + footnote;
    minVal = new Date(timeFrameYear, timeFrameMonth, 1);
    maxVal = new Date(timeFrameYear, timeFrameMonth + 1, 0);
  } else if (timeFrameType === "weekly") {
    footnote = getWeek(timeFrameWeek);
    const startWeek = new Date(timeFrameWeek);
    startWeek.setHours(0, 0, 0, 1);
    minVal = new Date(startWeek);
    const endWeek = new Date(timeFrameWeek);
    endWeek.setDate(endWeek.getDate() + 5);
    endWeek.setHours(23, 59, 59, 999);
    maxVal = endWeek;
  } else if (timeFrameType === "yearly") {
    minVal = new Date(timeFrameYear, 0, 1);
    maxVal = new Date(timeFrameYear + 1, 0, 0);
  }

  const options = {
    ...chartOptions,
    data: totalData,
    axes: [
      {
        type: "time",
        position: "bottom",
        nice: timeFrameType === "yearly" ? false : true,
        title: { enabled: true, text: footnote, color: "gray" },
        min: minVal,
        max: maxVal,
        label: {
          enabled: true,
          formatter: ({ value }) => {
            const valArr = (value as string).split(" ");
            if (timeFrameType === "monthly") {
              return parseInt(valArr[2] ?? "").toString();
            } else if (timeFrameType === "weekly") {
              return (
                valArr[0] + ", " + valArr[1] + " " + parseInt(valArr[2] ?? "")
              );
            } else if (timeFrameType === "yearly") {
              return valArr[1];
            }
          },
        },
        tick: {
          enabled: true,
          interval:
            timeFrameType === "yearly" ? undefined : 1000 * 60 * 60 * 24,
        },
        keys: ["dateValue"],
      },
      {
        type: "number",
        position: "right",
        keys: ["totalScore", "filteredScore"],
        max: 5,
        min: 0,
      },
    ],
    series: [
      ...(totalDataState.length !== filteredDataState.length
        ? [
            {
              type: "line",
              xKey: "dateValue",
              yKey: "filteredScore",
              yName: "Filtered Score",
              connectMissingData: true,
              data: totalData,
              tooltip: {
                enabled: true,
                renderer: (
                  params: AgLineSeriesTooltipRendererParams<GraphData>,
                ) => renderToString(<ToolTip {...params} />),
              },
            },
          ]
        : []),
      {
        type: "line",
        xKey: "dateValue",
        yKey: "totalScore",
        data: totalData,
        yName:
          totalDataState.length === filteredDataState.length
            ? "Score"
            : "Total Score",
        connectMissingData: true,
        tooltip: {
          enabled: true,
          renderer: (params) => renderToString(<ToolTip {...params} />),
        },
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
    (object, { score, date }) => {
      return {
        ...object,
        [date.toDateString()]: !!object[date.toDateString()]
          ? (score + (object[date.toDateString()] ?? 0)) / 2
          : score,
      };
    },
    {} as Record<string, number>,
  );
}
