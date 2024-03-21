"use client";
import DateRange from "./DateRange";
import type { FilterOptions, GraphData, Setters } from "~/utils/types";

type Props = {
  totalData: GraphData[];
  filterOptions: FilterOptions;
  setFilterOptions: Setters["setFilterOptions"];
};

export default function ChartHeader({
  totalData,
  filterOptions,
  setFilterOptions,
}: Props) {
  function getScore(
    type: keyof Omit<
      GraphData,
      "date" | "dateLabel" | "totalResponses" | "filteredResponses"
    >,
  ) {
    const firstData = totalData[0] ? totalData[0][type] : undefined;
    return firstData
      ? totalData.reduce(
          (average, item) => (item[type] ?? average + average) / 2,
          firstData,
        )
      : undefined;
  }

  const totalScore = getScore("totalScore");
  const filteredScore = getScore("filteredScore");

  return (
    <div className="flex justify-between border-b-2 border-gray-700">
      <div className="flex">
        <div className="my-2 flex w-32 flex-col items-center border-r-2 border-gray-700 p-2 px-4">
          <h5 className="text-center text-sm text-gray-500">Overall Score</h5>
          <h2 className="mt-2 rounded bg-green-900 px-2 text-3xl font-extrabold text-green-500">
            {totalScore ? totalScore.toFixed(1) : "N/A"}
          </h2>
        </div>
        <div className="my-2 flex w-32 flex-col items-center border-r-2 border-gray-700 p-2 px-4">
          <h5 className="text-center text-sm text-gray-500">Filtered Score</h5>
          <h2 className="mt-2 rounded bg-yellow-800 px-2 text-3xl font-extrabold text-yellow-600">
            {filteredScore ? filteredScore.toFixed(1) : totalScore ?? "N/A"}
          </h2>
        </div>
      </div>
      <DateRange
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </div>
  );
}
