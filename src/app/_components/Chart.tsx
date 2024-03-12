"use client";
import { useState } from "react";
// import { useForm } from "react-hook-form";
import { AgChartsReact } from "ag-charts-react";
import type { AgChartProps } from "ag-charts-react";
import type { FilterOptions, GraphData, GraphDataItem } from "~/utils/types";
import { baseData } from "~/utils/testData";
import FilterSettings from "./FilterSettings";

const baseCharOptions: Exclude<AgChartProps["options"], "data"> = {
  title: { text: "Test" },
  subtitle: { text: "Data from 2023" },
  width: 1000,
  height: 600,
  series: [
    {
      type: "line",
      xKey: "date",
      yKey: "filteredScore",
      yName: "Filtered Score",
    },
    { type: "line", xKey: "date", yKey: "totalScore", yName: "Total Score" },
  ],
  theme: "ag-polychroma-dark",
};

export default function Chart() {
  const [filteredDataState, setFilteredDataState] =
    useState<GraphDataItem[]>(baseData);
  const [reviewType, setReviewType] = useState<FilterOptions["reviewType"]>([]);
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   setValue,
  //   getValues,
  //   // formState: { errors },
  // } = useForm<FilterOptions>({
  //   defaultValues: {
  //     reviewType: {
  //       general: false,
  //       history: false,
  //       payment: false,
  //       scheduled: false,
  //     },
  //   },
  // });

  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const totalDataObject = getDataObject(baseData);
  const filteredDataObject = getDataObject(filteredDataState);
  const totalData: GraphData = Object.entries(totalDataObject).map(
    ([key, value]) => ({
      totalScore: value,
      filteredScore: filteredDataObject[key],
      date: key,
    }),
  );
  const options: AgChartProps["options"] = {
    ...baseCharOptions,
    data: totalData,
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <AgChartsReact options={options} />
      <FilterSettings
        setData={setFilteredDataState}
        reviewType={reviewType}
        setReviewType={setReviewType}
      />
      {/* <CrudShowcase /> */}
    </div>
  );
}

function getDataObject(data: GraphDataItem[]) {
  return data.reduce(
    (object, { score, date }) => ({
      ...object,
      [date]: !!object[date] ? (score + (object[date] ?? 0)) / 2 : score,
    }),
    {} as Record<string, number>,
  );
}
