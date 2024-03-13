import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { FilterOptions, DataItem } from "~/utils/types";

type Props = {
  baseData: DataItem[];
  setBaseData: Dispatch<SetStateAction<DataItem[]>>;
  setFilteredData: Dispatch<SetStateAction<DataItem[]>>;
  reviewType: FilterOptions["reviewType"];
  setReviewType: Dispatch<SetStateAction<FilterOptions["reviewType"]>>;
};

export default function FilterSettings({
  baseData,
  setBaseData,
  setFilteredData,
  reviewType,
  setReviewType,
}: Props) {
  const [timeFrameYear, setTimeFrameYear] = useState(new Date().getFullYear());
  const [timeFrameMonth, setTimeFrameMonth] = useState(
    new Date().toDateString().split(" ")[1],
  );
  function onSubmit(settings: FilterOptions) {
    setFilteredData(filterData(settings));
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

  function handleReviewTypeChange(event: ChangeEvent<HTMLInputElement>) {
    const name = event.currentTarget.name as FilterOptions["reviewType"][0];
    if (reviewType.includes(name)) {
      setReviewType(reviewType.filter((type) => type !== name));
    } else {
      setReviewType([...reviewType, name]);
    }
  }

  return (
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
      <label>
        <select
          className="text-black"
          value={timeFrameYear}
          onChange={(e) => setTimeFrameYear(parseInt(e.target.value))}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <option key={2020 + i} value={2020 + i}>
              {2020 + i}
            </option>
          ))}
        </select>
        Year
      </label>
      <label>
        <select
          className="text-black"
          value={timeFrameMonth}
          onChange={(e) => setTimeFrameMonth(e.target.value)}
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
        Month
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
