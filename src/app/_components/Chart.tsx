"use client";
import { useState } from "react";
import { type AgChartProps } from "ag-charts-react";
import type { GraphData, DataItem, FilterOptions } from "~/utils/types";
import { defaultFilters } from "~/utils/constants";
import InnerChart from "./InnerChart";
import FilterSettings from "./FilterSettings";

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

type Props = { serverData: DataItem[] };

export default function Chart({ serverData }: Props) {
  const [baseData, setBaseData] = useState<DataItem[]>(serverData);
  const [filterOptions, setFilterOptions] = useState(defaultFilters);
  const { timeFrameMonth, timeFrameType, timeFrameYear } = filterOptions;
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

  // useEffect(() => {
  //   const { data: newData, error } = api.chart.getData.useQuery(filterOptions);
  //   if (error ?? !newData) {
  //     console.log(error);
  //     return;
  //   }
  //   setBaseData(newData);
  // }, [filterOptions]);

  return (
    <div className="flex w-full flex-col items-center bg-gray-800">
      <div className="mt-16 flex w-full rounded bg-black">
        <div className="w-9/12 p-4 pr-2">
          <InnerChart
            chartOptions={chartOptions}
            filterOptions={filterOptions}
            filteredDataState={filteredDataState}
            setBaseData={setBaseData}
            setters={setters}
            totalData={totalData}
            totalDataState={totalDataState}
          />
        </div>
        <div className="w-3/12 p-4 pl-2">
          <FilterSettings
            setters={setters}
            filterOptions={filterOptions}
            baseData={baseData}
          />
        </div>
      </div>
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
