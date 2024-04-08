import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  FormEvent,
  MouseEvent,
} from "react";
import type { AgChartProps } from "ag-charts-react";
import { updateStateObject } from "~/utils/helperFunctions";
import type { FilterOptions, DataItem, DateOptions } from "~/utils/types";
import { defaultFilters, reviewTypes } from "~/utils/constants";
import Accordion from "./Accordion";
import classNames from "classnames";

type Setters = {
  setDateOptions: Dispatch<SetStateAction<DateOptions>>;
  setFilterOptions: Dispatch<SetStateAction<FilterOptions>>;
  setChartOptions: Dispatch<SetStateAction<AgChartProps["options"]>>;
  setTotalData: Dispatch<SetStateAction<DataItem[]>>;
  setFilteredData: Dispatch<SetStateAction<DataItem[]>>;
};

type Props = {
  filterOptions: FilterOptions;
  setters: Setters;
  baseData: DataItem[];
};

export default function FilterSettings({
  filterOptions,
  setters,
  baseData,
}: Props) {
  return (
    <form
      className="h-full rounded-lg border-2 border-gray-700 bg-gray-800"
      onSubmit={(e) => onSubmit(e, setters, filterOptions, baseData)}
    >
      <div className="flex justify-between p-4">
        <h3 className="text-2xl font-bold">Filters</h3>
        <div className="flex">
          <button
            className="mr-2 cursor-pointer rounded border border-gray-600 bg-gray-700 px-2 text-sm font-bold text-gray-500"
            type="button"
            onClick={(e) => resetFilters(e, setters, baseData)}
          >
            Reset
          </button>
          <button
            className="cursor-pointer rounded border border-yellow-600 bg-yellow-800 px-2 text-sm font-bold text-yellow-600"
            type="submit"
          >
            Apply
          </button>
        </div>
      </div>
      <Accordion title="Review Type">
        {reviewTypes.map((type) => (
          <label className="cursor-pointer py-1" key={type}>
            <input
              type="checkbox"
              className={classNames(
                "border-gray-500 bg-gray-800 accent-yellow-700 after:text-yellow-500 checked:border-yellow-700",
              )}
              checked={filterOptions.reviewType.includes(type)}
              name={type}
              onChange={(e) =>
                handleReviewTypeChange(
                  e,
                  filterOptions,
                  setters.setFilterOptions,
                )
              }
            />
            <span
              className={classNames("ml-2", {
                "text-gray-500": !filterOptions.reviewType.includes(type),
                "text-yellow-600": filterOptions.reviewType.includes(type),
              })}
            >
              {type.replace(type[0] ?? "", (type[0] ?? "").toUpperCase())}
            </span>
          </label>
        ))}
      </Accordion>
    </form>
  );
}

// function dateFilter(data: DataItem[], settings: FilterOptions) {
//   const { timeFrameWeek, timeFrameMonth, timeFrameYear, timeFrameType } =
//     settings;
//   const weekDate = new Date(timeFrameWeek.toDateString());
//   const day = weekDate.getDay();
//   weekDate.setDate(weekDate.getDate() - day);
//   const displayData = data.filter((item) => {
//     const itemIsYear = item.date.getFullYear() === timeFrameYear;
//     const itemIsMonth = item.date.getMonth() === timeFrameMonth;

//     if (timeFrameType === "yearly") {
//       return itemIsYear;
//     } else if (timeFrameType === "monthly") {
//       return itemIsYear && itemIsMonth;
//     } else if (timeFrameType === "weekly") {
//       const startDate = new Date(weekDate);
//       startDate.setDate(startDate.getDate() - startDate.getDay());

//       const endDate = new Date(startDate);
//       endDate.setDate(endDate.getDate() + 7);

//       return item.date >= startDate && item.date < endDate;
//     }
//   });
//   return displayData;
// }

function filterData(settings: FilterOptions, baseData: DataItem[]): DataItem[] {
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

function onSubmit(
  e: FormEvent<HTMLFormElement>,
  setters: Setters,
  filters: FilterOptions,
  baseData: DataItem[],
) {
  e.preventDefault();
  handleFilter(filters, setters, baseData);
}

function handleFilter(
  typeFilters: FilterOptions,
  setters: Setters,
  baseData: DataItem[],
) {
  const newFilteredData = filterData(typeFilters, baseData);
  setters.setFilteredData(newFilteredData);
  setters.setTotalData(baseData);
}

function handleReviewTypeChange(
  event: ChangeEvent<HTMLInputElement>,
  filterOptions: FilterOptions,
  setFilterOptions: Setters["setFilterOptions"],
) {
  const name = event.currentTarget.name as FilterOptions["reviewType"][0];
  const newReviewType = filterOptions.reviewType.includes(name)
    ? filterOptions.reviewType.filter((type) => type !== name)
    : [...filterOptions.reviewType, name];

  updateStateObject("reviewType", newReviewType, setFilterOptions);
}

function resetFilters(
  e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  setters: Setters,
  baseData: DataItem[],
) {
  e.preventDefault();
  setters.setFilterOptions(defaultFilters);
  handleFilter(defaultFilters, setters, baseData);
}
