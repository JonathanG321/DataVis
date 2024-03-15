import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  type FormEvent,
  type MouseEvent,
  useEffect,
} from "react";
import type { AgChartProps } from "ag-charts-react";
import { getMonth, getWeek, updateStateObject } from "~/utils/helperFunctions";
import { baseData } from "~/utils/testData";
import type { FilterOptions, DataItem } from "~/utils/types";
import { reviewTypes } from "~/utils/constants";
import Accordion from "./Accordion";

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
  function onSubmit(e: FormEvent<HTMLFormElement>, filters: FilterOptions) {
    e.preventDefault();
    handleFilter(filters);
  }

  function handleFilter(filters: FilterOptions) {
    let newFilters = { ...filters };
    let subtitle = newFilters.timeFrameYear.toString();
    if (newFilters.timeFrameType === "monthly") {
      subtitle = `${getMonth(new Date(`${newFilters.timeFrameMonth + 1}/01/2024`)) + " " + newFilters.timeFrameYear}`;
    } else if (newFilters.timeFrameType === "weekly") {
      newFilters = {
        ...filters,
        ...updateStateObject(
          "timeFrameWeek",
          filterOptions.timeFrameWeek,
          setFilterOptions,
        ),
      };
      subtitle = getWeek(newFilters.timeFrameWeek);
    }
    updateStateObject(
      "subtitle",
      { text: `Data from ${subtitle}` },
      setChartOptions,
    );
    const newFilteredData = dateFilter(filterData(newFilters), newFilters);
    const newTotalData = dateFilter(baseData, newFilters);
    setFilteredData(newFilteredData);
    setTotalData(newTotalData);
  }

  function resetFilters(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) {
    e.preventDefault();
    setFilterOptions({ ...filterOptions, reviewType: [] });
    handleFilter({ ...filterOptions, reviewType: [] });
  }

  function handleReviewTypeChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.currentTarget.name as FilterOptions["reviewType"][0];
    const newReviewType = filterOptions.reviewType.includes(name)
      ? filterOptions.reviewType.filter((type) => type !== name)
      : [...filterOptions.reviewType, name];

    updateStateObject("reviewType", newReviewType, setFilterOptions);
  }

  useEffect(() => {
    handleFilter(filterOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterOptions.timeFrameType,
    filterOptions.timeFrameMonth,
    filterOptions.timeFrameWeek,
    filterOptions.timeFrameYear,
  ]);

  return (
    <form
      className="h-full rounded-lg border-2 border-gray-700 bg-gray-800"
      onSubmit={(e) => onSubmit(e, filterOptions)}
    >
      <div className="flex justify-between p-4">
        <h3 className="text-2xl font-bold">Filters</h3>
        <div className="flex">
          <button
            className="mr-2 rounded border border-gray-600 bg-gray-700 px-2 text-sm font-bold text-gray-500"
            type="button"
            onClick={resetFilters}
          >
            Reset
          </button>
          <button
            className="rounded border border-yellow-600 bg-yellow-700 px-2 text-sm font-bold text-yellow-600"
            type="submit"
          >
            Apply
          </button>
        </div>
      </div>
      <Accordion title="Review Type">
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
      </Accordion>
    </form>
  );
}

function dateFilter(data: DataItem[], settings: FilterOptions) {
  const { timeFrameWeek, timeFrameMonth, timeFrameYear, timeFrameType } =
    settings;
  const weekDate = new Date(timeFrameWeek.toDateString());
  const day = weekDate.getDay();
  weekDate.setDate(weekDate.getDate() - day);
  const displayData = data.filter((item) => {
    const itemIsYear = item.date.getFullYear() === timeFrameYear;
    const itemIsMonth = item.date.getMonth() === timeFrameMonth;

    if (timeFrameType === "yearly") {
      return itemIsYear;
    } else if (timeFrameType === "monthly") {
      return itemIsYear && itemIsMonth;
    } else if (timeFrameType === "weekly") {
      const startDate = new Date(weekDate);
      startDate.setDate(startDate.getDate() - startDate.getDay());

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      return item.date >= startDate && item.date < endDate;
    }
  });
  return displayData;
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
