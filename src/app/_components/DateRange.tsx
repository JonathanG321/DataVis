import type { Dispatch, SetStateAction } from "react";
import { timeRange } from "~/utils/constants";
import { getWeek, updateStateObject } from "~/utils/helperFunctions";
import type { DateOptions } from "~/utils/types";

type Props = {
  dateOptions: DateOptions;
  setDateOptions: Dispatch<SetStateAction<DateOptions>>;
};

export default function DateRange({ setDateOptions, dateOptions }: Props) {
  function setWeekly(dateChange: number) {
    const newWeek = new Date(dateOptions.timeFrameWeek);
    newWeek.setDate(newWeek.getDate() + dateChange);
    const newDateOptions = { ...dateOptions, timeFrameWeek: newWeek };
    setDateOptions(newDateOptions);
  }
  const selectClasses = "rounded bg-gray-700 py-1 pl-2 ml-2 cursor-pointer";
  return (
    <div className="my-2 w-72 border-l-2 border-gray-700 p-2 px-4">
      <div className="flex justify-between">
        <h5 className="text-sm text-gray-500">Timeframe</h5>
        <div className="flex justify-between">
          <select
            className={selectClasses}
            value={dateOptions.timeFrameType}
            onChange={(e) =>
              updateStateObject(
                "timeFrameType",
                e.target.value as DateOptions["timeFrameType"],
                setDateOptions,
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
      </div>
      <div className="flex justify-end">
        {dateOptions.timeFrameType === "monthly" && (
          <div className="flex justify-between py-2">
            <select
              className={selectClasses}
              value={dateOptions.timeFrameMonth}
              onChange={(e) =>
                updateStateObject(
                  "timeFrameMonth",
                  parseInt(e.target.value),
                  setDateOptions,
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
        {(dateOptions.timeFrameType === "yearly" ||
          dateOptions.timeFrameType === "monthly") && (
          <div className="flex justify-between py-2">
            <select
              className={selectClasses}
              value={dateOptions.timeFrameYear}
              onChange={(e) =>
                updateStateObject(
                  "timeFrameYear",
                  parseInt(e.target.value),
                  setDateOptions,
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
        {dateOptions.timeFrameType === "weekly" && (
          <div className="flex w-full items-center justify-between py-2">
            <button
              className="rounded border border-yellow-600 bg-yellow-800 px-2 py-1 text-yellow-600"
              type="button"
              onClick={() => setWeekly(-7)}
            >
              {"<"}
            </button>
            <span className="text-xs">
              {getWeek(dateOptions.timeFrameWeek)}
            </span>
            <button
              className="rounded border border-yellow-600 bg-yellow-800 px-2 py-1 text-yellow-600"
              type="button"
              onClick={() => setWeekly(7)}
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
