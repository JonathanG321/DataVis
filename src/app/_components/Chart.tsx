"use client";
import { useState } from "react";
import { type AgChartProps, AgChartsReact } from "ag-charts-react";
import type { GraphData, DataItem } from "~/utils/types";
import { baseData } from "~/utils/testData";
import FilterSettings from "./FilterSettings";
import { defaultFilters } from "~/utils/constants";
import { daysInMonth, getMonth, getWeek } from "~/utils/helperFunctions";
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
  subtitle: {
    text: `Data from ${new Date().toDateString().split(" ")[1]} ${new Date().getFullYear()}`,
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
  const totalData: GraphData = Object.entries(totalDataObject).map(
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
      };
    },
  );

  let data: GraphData = [];
  if (timeFrameType === "weekly") {
    data = Array.from({ length: 7 }).map((_, i) => {
      const newDate = new Date(timeFrameWeek.toDateString());
      newDate.setDate(newDate.getDate() + i);
      const dateArr = newDate.toDateString().split(" ");
      const label =
        dateArr[0] +
        ", " +
        dateArr[1] +
        " " +
        parseInt(dateArr[2] ?? "").toString();
      const item = totalData.find((val) => val.dateLabel === label);
      console.log(item);

      if (item) return item;
      return {
        totalScore: undefined,
        filteredScore: undefined,
        dateLabel: label,
        date: newDate,
      };
    });
  } else if (timeFrameType === "monthly") {
    data = Array.from({
      length: daysInMonth(timeFrameMonth, timeFrameYear),
    })
      .map((_, i) => {
        const newDate = new Date(timeFrameYear, timeFrameMonth, 1);
        newDate.setDate(newDate.getDate() + i);
        const dateArr = newDate.toDateString().split(" ");
        const label = parseInt(dateArr[2] ?? "").toString();
        const item = totalData.find((val) => val.dateLabel === label);
        if (item) return item;
        return {
          totalScore: undefined,
          filteredScore: undefined,
          dateLabel: label,
        };
      })
      .sort((a, b) => parseInt(a.dateLabel) - parseInt(b.dateLabel));
  } else if (timeFrameType === "yearly") {
    data = Array.from({ length: 365 }).map((_, i) => {
      const newDate = new Date(timeFrameYear, 0, 1);
      newDate.setDate(newDate.getDate() + i);
      const dateArr = newDate.toDateString().split(" ");
      const label = dateArr[1] + " " + parseInt(dateArr[2] ?? "").toString();
      const item = totalData.find((val) => val.dateLabel === label);
      if (item) return item;
      return {
        totalScore: undefined,
        filteredScore: undefined,
        dateLabel: label,
      };
    });
  }

  let footnote = timeFrameYear.toString();
  if (timeFrameType === "monthly") {
    footnote =
      getMonth(new Date(timeFrameMonth + 1 + "/01/2024")) + " " + footnote;
  } else if (timeFrameType === "weekly") {
    footnote = getWeek(timeFrameWeek);
  }

  const options = {
    ...chartOptions,
    data,
    footnote: { enabled: true, text: footnote, textAlign: "left" },
    axes: [
      {
        type: "category",
        position: "bottom",
        nice: true,
        title: { enabled: true, text: footnote, color: "gray", formatter: "" },
        // label: {
        //   enabled: true,
        //   formatter: ({ value }) => (value as string).split(" ")[0],
        // },
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
    ],
    series: [
      ...(totalDataState.length !== filteredDataState.length
        ? [
            {
              type: "line",
              xKey: "dateLabel",
              yKey: "filteredScore",
              yName: "Filtered Score",
              connectMissingData: true,
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
        connectMissingData: true,
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
