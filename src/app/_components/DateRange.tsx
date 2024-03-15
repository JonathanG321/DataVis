import type { Dispatch, SetStateAction } from "react";
import { timeRange } from "~/utils/constants";
import { getWeek, updateStateObject } from "~/utils/helperFunctions";
import { type FilterOptions } from "~/utils/types";

type Props = {
  filterOptions: FilterOptions;
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
};

export default function DateRange({ setFilterOptions, filterOptions }: Props) {
  function setWeekly(dateChange: number) {
    const newWeek = new Date(filterOptions.timeFrameWeek);
    newWeek.setDate(newWeek.getDate() + dateChange);
    setFilterOptions({ ...filterOptions, timeFrameWeek: newWeek });
  }
  const selectClasses = "rounded bg-gray-700 py-1 pl-2 mr-2";
  return (
    <div className="my-2 w-96 border-l-2 border-gray-700 p-2 px-4">
      <h5 className="text-sm text-gray-500">Timeframe</h5>
      <div className="flex justify-between">
        <div className="flex justify-between py-2">
          <select
            className={selectClasses}
            value={filterOptions.timeFrameType}
            onChange={(e) =>
              updateStateObject(
                "timeFrameType",
                e.target.value as FilterOptions["timeFrameType"],
                setFilterOptions,
              )
            }
          >
            {timeRange.map((time) => (
              <option className="capitalize" key={time} value={time}>
                {time.replace(time[0] ?? "", (time[0] ?? "").toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div className="flex">
          {filterOptions.timeFrameType === "monthly" && (
            <div className="flex justify-between py-2">
              <select
                className={selectClasses}
                value={filterOptions.timeFrameMonth}
                onChange={(e) =>
                  updateStateObject(
                    "timeFrameMonth",
                    parseInt(e.target.value),
                    setFilterOptions,
                  )
                }
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const date = new Date(`${1 + i}/01/2024`)
                    .toDateString()
                    .split(" ")[1];
                  return (
                    <option key={date} value={i}>
                      {date}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {(filterOptions.timeFrameType === "yearly" ||
            filterOptions.timeFrameType === "monthly") && (
            <div className="flex justify-between py-2">
              <select
                className={selectClasses}
                value={filterOptions.timeFrameYear}
                onChange={(e) =>
                  updateStateObject(
                    "timeFrameYear",
                    parseInt(e.target.value),
                    setFilterOptions,
                  )
                }
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <option key={2020 + i} value={2020 + i}>
                    {2020 + i}
                  </option>
                ))}
              </select>
            </div>
          )}
          {filterOptions.timeFrameType === "weekly" && (
            <div className="flex items-center justify-between py-2">
              <button
                className="mr-2 rounded border border-yellow-600 bg-yellow-700 px-2 py-1 text-yellow-600"
                type="button"
                onClick={() => setWeekly(-7)}
              >
                {"<"}
              </button>
              <span className="text-xs">
                {getWeek(filterOptions.timeFrameWeek)}
              </span>
              <button
                className="ml-2 rounded border border-yellow-600 bg-yellow-700 px-2 py-1 text-yellow-600"
                type="button"
                onClick={() => setWeekly(7)}
              >
                {">"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
