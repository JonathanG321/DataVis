"use client";
import { useState } from "react";
import { AgChartsReact } from "ag-charts-react";
import type { AgChartProps } from "ag-charts-react";
import type { GraphDataItem } from "~/utils/types";

export default function Chart() {
  const [data, setData] = useState<GraphDataItem[]>(
    Array.from({ length: 10 }).map((_, i) => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);
      const dateArr = currentDate.toDateString().split(" ");
      return {
        date: dateArr[1] + " " + dateArr[2],
        score: Math.random() * 5,
        reviewType: "payment",
        client: "me",
      };
    }),
  );
  const settings = useState({});
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const options: AgChartProps["options"] = {
    title: { text: "Test" },
    subtitle: { text: "Data from 2023" },
    data,
    series: [{ type: "line", xKey: "date", yKey: "score", yName: "Score" }],
    axes: [
      { type: "category", position: "bottom" },
      {
        type: "number",
        position: "left",
        keys: ["score"],
      },
    ],
    theme: "ag-polychroma-dark",
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container z-50 flex flex-col items-center justify-center gap-12 px-4 py-16">
        <AgChartsReact options={options} />
        {/* <CrudShowcase /> */}
      </div>
    </main>
  );
}
