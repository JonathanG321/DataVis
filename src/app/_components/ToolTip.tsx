import type { AgLineSeriesTooltipRendererParams } from "ag-charts-community";
import classNames from "classnames";
import type { FilterOptions, GraphData } from "~/utils/types";

type Props = {
  params: AgLineSeriesTooltipRendererParams<GraphData>;
  timeFrameType: FilterOptions["timeFrameType"];
};

export function ToolTip({ params, timeFrameType }: Props) {
  const { datum } = params;
  const dateString = datum.date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
  let title = dateString;
  const titleArr = dateString.split(" ");
  if (timeFrameType === "yearly") title = titleArr[0] || "";
  const totalScore = datum.totalScore?.toFixed(1);
  const filteredScore = datum.filteredScore?.toFixed(1);
  const totalResponses = datum.totalResponses;
  const filteredResponses = datum.filteredResponses;
  const isFiltered =
    totalScore !== filteredScore ||
    datum.totalResponses !== datum.filteredResponses;
  return (
    <div className="rounded border-2 border-gray-700 bg-gray-800 p-3">
      <h3 className="mb-2 font-bold text-white">{title}</h3>
      <div className="flex flex-col">
        <div
          className={classNames("flex items-center", { "mb-2": isFiltered })}
        >
          <span className="min-w-12 rounded bg-green-900 px-2 text-center text-lg font-bold text-green-500">
            {totalScore}
          </span>
          <span className="px-2 text-sm text-gray-500">
            {totalResponses} {isFiltered ? "Total" : ""} Responses
          </span>
        </div>
        {isFiltered && (
          <div className="flex items-center">
            <span className="min-w-12 rounded bg-yellow-800 px-2 text-center text-lg font-bold text-yellow-600">
              {filteredScore ?? "N/A"}
            </span>
            <span className="px-2 text-sm text-gray-500">
              {filteredResponses} Filtered Responses
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
