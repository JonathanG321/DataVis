import { AgChartProps, AgChartsReact } from "ag-charts-react";
import { ToolTip } from "./ToolTip";
import {
  AgChartOptions,
  AgLineSeriesTooltipRendererParams,
} from "ag-charts-community";
import { DataItem, FilterOptions, GraphData } from "~/utils/types";
import { renderToString } from "react-dom/server";
import { getMonth, getWeek } from "~/utils/helperFunctions";

type Props = {
  filterOptions: FilterOptions;
  chartOptions: AgChartOptions;
  totalData: GraphData[];
  totalDataState: DataItem[];
  filteredDataState: DataItem[];
};

export default function ChartDisplay({
  filterOptions,
  chartOptions,
  totalData,
  totalDataState,
  filteredDataState,
}: Props) {
  const { timeFrameYear, timeFrameType, timeFrameMonth, timeFrameWeek } =
    filterOptions;
  let footnote = timeFrameYear.toString();
  let data: GraphData[] = [];
  if (timeFrameType === "monthly") {
    footnote =
      getMonth(new Date(timeFrameYear, timeFrameMonth + 1, 1)) + " " + footnote;
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
  return (
    <div className="h-120 flex justify-center overflow-hidden">
      <div className="mb-2 w-full">
        <AgChartsReact options={options} />
      </div>
    </div>
  );
}
