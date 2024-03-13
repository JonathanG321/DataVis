import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { AgChartProps } from "ag-charts-react";
import { updateStateObject } from "~/utils/helperFunctions";
import { baseData } from "~/utils/testData";
import type { FilterOptions, DataItem } from "~/utils/types";

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
  function onSubmit(settings: FilterOptions) {
    setFilteredData(dateFilter(filterData(settings)));
    setTotalData(dateFilter(baseData));
    updateStateObject(
      "subtitle",
      {
        text: `Data from ${settings.timeFrameType === "monthly" ? settings.timeFrameMonth + " " : ""}${settings.timeFrameYear}`,
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
    return data.filter((item) => {
      const itemIsYear =
        item.date.getFullYear() === filterOptions.timeFrameYear;
      const itemIsMonth =
        item.date.toDateString().split(" ")[1] === filterOptions.timeFrameMonth;
      return filterOptions.timeFrameType === "monthly"
        ? itemIsYear && itemIsMonth
        : itemIsYear;
    });
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
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(filterOptions);
      }}
    >
      <div>
        <label>
          <input
            type="checkbox"
            checked={filterOptions.reviewType.includes("general")}
            name="general"
            onChange={handleReviewTypeChange}
          />
          General
        </label>
        <label>
          <input
            type="checkbox"
            checked={filterOptions.reviewType.includes("history")}
            name="history"
            onChange={handleReviewTypeChange}
          />
          History
        </label>
        <label>
          <input
            type="checkbox"
            checked={filterOptions.reviewType.includes("payment")}
            name="payment"
            onChange={handleReviewTypeChange}
          />
          Payment
        </label>
        <label>
          <input
            type="checkbox"
            checked={filterOptions.reviewType.includes("scheduled")}
            name="scheduled"
            onChange={handleReviewTypeChange}
          />
          Scheduled
        </label>
      </div>
      <div>
        <label>
          Range
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
            <option key={"monthly"} value={"monthly"}>
              Monthly
            </option>
            <option key={"yearly"} value={"yearly"}>
              Yearly
            </option>
          </select>
        </label>
        <label>
          Year
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
        {filterOptions.timeFrameType === "monthly" && (
          <label>
            Month
            <select
              className="text-black"
              value={filterOptions.timeFrameMonth}
              onChange={(e) =>
                updateStateObject(
                  "timeFrameMonth",
                  e.target.value,
                  setFilterOptions,
                )
              }
            >
              {Array.from({ length: 12 }).map((_, i) => {
                const value = new Date(`${1 + i}/01/2024`)
                  .toDateString()
                  .split(" ")[1];
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </label>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
