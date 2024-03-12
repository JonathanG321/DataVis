"use client";
import { useState } from "react";
import type { ChangeEvent } from "react";
// import { useForm } from "react-hook-form";
import { AgChartsReact } from "ag-charts-react";
import type { AgChartProps } from "ag-charts-react";
import type { FilterOptions, GraphDataItem } from "~/utils/types";
import { testData } from "~/utils/testData";

const baseData = testData.map((item) => {
  const dateArr = item.date.toDateString().split(" ");
  return {
    ...item,
    date: dateArr[1] + " " + dateArr[2],
  };
});

export default function Chart() {
  const [data, setData] = useState<GraphDataItem[]>(baseData);
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
  function handleReviewTypeChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.currentTarget.name as FilterOptions["reviewType"][0];
    if (reviewType.includes(name)) {
      setReviewType(reviewType.filter((type) => type !== name));
    } else {
      setReviewType([...reviewType, name]);
    }
  }

  function onSubmit(settings: FilterOptions) {
    setData(filterData(settings));
  }

  function filterData(settings: FilterOptions): GraphDataItem[] {
    const newArr = baseData.filter((item) => {
      let shouldKeep = true;
      if (
        !!settings.reviewType.length &&
        !settings.reviewType.includes(item.reviewType)
      ) {
        shouldKeep = false;
      }
      return shouldKeep;
    });
    return newArr;
  }
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const options: AgChartProps["options"] = {
    title: { text: "Test" },
    subtitle: { text: "Data from 2023" },
    data,
    width: 1000,
    height: 600,
    series: [{ type: "line", xKey: "date", yKey: "score", yName: "Score" }],
    axes: [
      {
        type: "category",
        position: "bottom",
      },
      {
        type: "number",
        position: "left",
        keys: ["score"],
      },
    ],
    theme: "ag-polychroma-dark",
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <AgChartsReact options={options} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ reviewType });
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={reviewType.includes("general")}
            name="general"
            onChange={handleReviewTypeChange}
          />
          General
        </label>
        <label>
          <input
            type="checkbox"
            checked={reviewType.includes("history")}
            name="history"
            onChange={handleReviewTypeChange}
          />
          History
        </label>
        <label>
          <input
            type="checkbox"
            checked={reviewType.includes("payment")}
            name="payment"
            onChange={handleReviewTypeChange}
          />
          Payment
        </label>
        <label>
          <input
            type="checkbox"
            checked={reviewType.includes("scheduled")}
            name="scheduled"
            onChange={handleReviewTypeChange}
          />
          Scheduled
        </label>
        <button type="submit">Submit</button>
      </form>
      {/* <CrudShowcase /> */}
    </div>
  );
}
