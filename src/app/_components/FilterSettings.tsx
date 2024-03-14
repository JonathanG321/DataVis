import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { AgChartProps } from "ag-charts-react";
import { getMonth, getWeek, updateStateObject } from "~/utils/helperFunctions";
import { baseData } from "~/utils/testData";
import type { FilterOptions, DataItem } from "~/utils/types";
import { reviewTypes, timeRange } from "~/utils/constants";

type Props = {
  setTotalData: Dispatch<SetStateAction<DataItem[]>>;
  setFilteredData: Dispatch<SetStateAction<DataItem[]>>;
  filterOptions: FilterOptions;
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
  setChartOptions: Dispatch<SetStateAction<AgChartProps["options"]>>;
};

export default function FilterSettings({
  setTotalData,
  setFilteredData,
  filterOptions,
  setFilterOptions,
  setChartOptions,
}: Props) {
  const [weeklyRange, setWeeklyRange] = useState<Date>(
    filterOptions.timeFrameWeek,
  );
  function onSubmit(settings: FilterOptions) {
    setFilteredData(dateFilter(filterData(settings)));
    setTotalData(dateFilter(baseData));
    let subtitle = settings.timeFrameYear.toString();
    if (settings.timeFrameType === "monthly") {
      subtitle = `${getMonth(new Date(`${settings.timeFrameMonth + 1}/01/2024`)) + " " + settings.timeFrameYear}`;
    } else if (settings.timeFrameType === "weekly") {
      subtitle = getWeek(settings.timeFrameWeek);
      updateStateObject("timeFrameWeek", weeklyRange, setFilterOptions);
    }
    updateStateObject(
      "subtitle",
      {
        text: `Data from ${subtitle}`,
      },
      setChartOptions,
    );
  }

  function filterData(settings: FilterOptions): DataItem[] {
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

  function dateFilter(data: DataItem[]) {
    const weekDate = new Date(filterOptions.timeFrameWeek.toDateString());
    const day = weekDate.getDay();
    weekDate.setDate(weekDate.getDate() - day);
    const displayData = data.filter((item) => {
      const itemIsYear =
        item.date.getFullYear() === filterOptions.timeFrameYear;
      const itemIsMonth = item.date.getMonth() === filterOptions.timeFrameMonth;

      if (filterOptions.timeFrameType === "yearly") {
        return itemIsYear;
      } else if (filterOptions.timeFrameType === "monthly") {
        return itemIsYear && itemIsMonth;
      } else if (filterOptions.timeFrameType === "weekly") {
        const startDate = new Date(weekDate);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);

        return item.date >= startDate && item.date < endDate;
      }
    });
    return displayData;
  }

  function handleReviewTypeChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.currentTarget.name as FilterOptions["reviewType"][0];
    const newReviewType = filterOptions.reviewType.includes(name)
      ? filterOptions.reviewType.filter((type) => type !== name)
      : [...filterOptions.reviewType, name];

    updateStateObject("reviewType", newReviewType, setFilterOptions);
  }

  return (
    <form
      className="h-full rounded-lg bg-gray-800 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(filterOptions);
      }}
    >
      <h3 className="text-2xl font-bold">Filters</h3>
      <div className="mb-2 flex flex-col">
        {reviewTypes.map((type) => (
          <label className="py-1" key={type}>
            <input
              type="checkbox"
              checked={filterOptions.reviewType.includes(type)}
              name={type}
              onChange={handleReviewTypeChange}
            />
            <span className="ml-2">
              {type.replace(type[0] ?? "", (type[0] ?? "").toUpperCase())}
            </span>
          </label>
        ))}
      </div>
      <div className="flex flex-col">
        <h3 className="text-2xl font-bold">Time Range</h3>
        <label className="flex justify-between py-2">
          <span className="mr-2">Range</span>
          <select
            className="text-black"
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
        </label>
        {(filterOptions.timeFrameType === "yearly" ||
          filterOptions.timeFrameType === "monthly") && (
          <label className="flex justify-between py-2">
            <span className="mr-2">Year</span>
            <select
              className="text-black"
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
          </label>
        )}
        {filterOptions.timeFrameType === "monthly" && (
          <label className="flex justify-between py-2">
            <span className="mr-2">Month</span>
            <select
              className="text-black"
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
          </label>
        )}
        {filterOptions.timeFrameType === "weekly" && (
          <label className="flex justify-between py-2">
            <button
              className="mr-2 rounded border border-yellow-600 bg-yellow-700 px-2 text-yellow-600"
              type="button"
              onClick={() => {
                const newWeek = new Date(weeklyRange);
                newWeek.setDate(newWeek.getDate() - 7);
                setWeeklyRange(newWeek);
              }}
            >
              {"<"}
            </button>
            <span>{getWeek(weeklyRange)}</span>
            <button
              className="ml-2 rounded border border-yellow-600 bg-yellow-700 px-2 text-yellow-600"
              type="button"
              onClick={() => {
                const newWeek = new Date(weeklyRange);
                newWeek.setDate(newWeek.getDate() + 7);
                setWeeklyRange(newWeek);
              }}
            >
              {">"}
            </button>
          </label>
        )}
        <button
          className="rounded border border-yellow-600 bg-yellow-700 text-yellow-600"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
