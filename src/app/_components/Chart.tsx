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

  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const totalDataObject = getDataObject(totalDataState);
  const filteredDataObject = getDataObject(filteredDataState);
  const totalData: GraphData[] = Object.entries(totalDataObject).map(
    ([key, value]) => {
      return {
        totalScore: parseFloat(value.toFixed(1)),
        filteredScore: parseFloat((filteredDataObject[key] ?? 0).toFixed(1)),
        date: new Date(key),
        dateLabel: key,
        filteredResponses: filteredDataState.reduce(
          (total, current) =>
            current.date.toDateString() === new Date(key).toDateString()
              ? total + 1
              : total,
          0,
        ),
        totalResponses: totalDataState.reduce(
          (total, current) =>
            current.date.toDateString() === new Date(key).toDateString()
              ? total + 1
              : total,
          0,
        ),
      };
    },
  );

  let footnote = timeFrameYear.toString();
  let data: GraphData[] = [];
  if (timeFrameType === "monthly") {
    footnote =
      getMonth(new Date(timeFrameMonth + 1 + "/01/2024")) + " " + footnote;
    data = Array.from({
      length: new Date(timeFrameYear, timeFrameMonth + 1, 0).getDate(),
    }).map((_, i): GraphData => {
      const date = new Date(timeFrameYear, timeFrameMonth, i + 1);
      const item = totalData.find(
        (data) => data.date.toDateString() === date.toDateString(),
      );
      if (item) return item;
      return {
        date,
        dateLabel: date.toDateString(),
      };
    });
  } else if (timeFrameType === "weekly") {
    footnote = getWeek(timeFrameWeek);
    data = Array.from({
      length: 7,
    }).map((_, i) => {
      const weekDate = new Date(
        timeFrameWeek.getFullYear(),
        timeFrameWeek.getMonth(),
        timeFrameWeek.getDate() + i,
      );
      const item = totalData.find(
        (data) => data.date.toDateString() === weekDate.toDateString(),
      );
      if (item) return item;
      return {
        date: weekDate,
        dateLabel: weekDate.toDateString(),
      };
    });
  } else if (timeFrameType === "yearly") {
    data = Array.from({
      length: 12,
    }).map((_, i) => {
      const date = new Date(timeFrameYear, i, 1);
      const items = totalData.filter(
        (item) => item.date.getMonth() === date.getMonth(),
      );
      return items.reduce(
        (finalItem, currentItem) => {
          return {
            ...finalItem,
            totalScore: finalItem.totalScore
              ? (finalItem.totalScore +
                  (currentItem.totalScore ?? finalItem.totalScore)) /
                2
              : currentItem.totalScore,
            filteredResponses:
              (finalItem.filteredResponses || 0) +
              (currentItem.filteredResponses || 0),
            filteredScore: finalItem.filteredScore
              ? (finalItem.filteredScore +
                  (currentItem.filteredScore ?? finalItem.filteredScore)) /
                2
              : currentItem.filteredScore,
            totalResponses:
              (finalItem.totalResponses || 0) +
              (currentItem.totalResponses || 0),
          };
        },
        {
          date,
          dateLabel: date.toLocaleDateString("en-US", { month: "long" }),
          totalScore: undefined,
          filteredResponses: 0,
          filteredScore: undefined,
          totalResponses: 0,
        },
      );
    });
  }

  const tooltip = {
    enabled: true,
    renderer: (params: AgLineSeriesTooltipRendererParams<GraphData>) =>
      renderToString(<ToolTip params={params} timeFrameType={timeFrameType} />),
  };

  const options = {
    ...chartOptions,
    data,
    axes: [
      {
        type: "category",
        position: "bottom",
        title: { enabled: true, text: footnote, color: "gray" },
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
        tick: { enabled: true },
        keys: ["dateLabel"],
      },
      {
        type: "number",
        position: "right",
        keys: ["totalScore", "filteredScore"],
        max: 5,
        min: 0,
      },
      {
        type: "number",
        position: "left",
        keys: ["totalResponses", "filteredResponses"],
      },
    ],
    series: [
      ...(totalDataState.length !== filteredDataState.length
        ? [
            {
              type: "bar",
              xKey: "dateLabel",
              yKey: "filteredResponses",
              yName: "Filtered Responses",
              tooltip,
              grouped: true,
              fill: "gray",
              cornerRadius: 2,
            },
          ]
        : []),
      {
        type: "bar",
        xKey: "dateLabel",
        yKey: "totalResponses",
        yName:
          totalDataState.length === filteredDataState.length
            ? "Responses"
            : "Total Responses",
        tooltip,
        grouped: true,
        fill: "darkGray",
        cornerRadius: 2,
      },
      ...(totalDataState.length !== filteredDataState.length
        ? [
            {
              type: "line",
              xKey: "dateLabel",
              yKey: "filteredScore",
              yName: "Filtered Score",
              tooltip,
              connectMissingData: true,
              marker: {
                enabled: true,
                fill: "rgb(202 138 4)",
                stroke: "rgb(202 138 4)",
                strokeOpacity: 0.5,
                strokeWidth: 6,
              },
              stroke: "rgb(202 138 4)",
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
        tooltip,
        connectMissingData: true,
        marker: {
          enabled: true,
          fill: "rgb(34 197 94)",
          stroke: "rgb(34 197 94)",
          strokeOpacity: 0.5,
          strokeWidth: 6,
        },
        stroke: "rgb(34 197 94)",
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
