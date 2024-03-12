import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { baseData } from "~/utils/testData";
import type { FilterOptions, GraphDataItem } from "~/utils/types";

type Props = {
  setData: Dispatch<SetStateAction<GraphDataItem[]>>;
  reviewType: FilterOptions["reviewType"];
  setReviewType: Dispatch<SetStateAction<FilterOptions["reviewType"]>>;
};

export default function FilterSettings({
  setData,
  reviewType,
  setReviewType,
}: Props) {
  function onSubmit(settings: FilterOptions) {
    setData(filterData(settings));
  }

  function filterData(settings: FilterOptions): GraphDataItem[] {
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
      <button type="submit">Submit</button>
    </form>
  );
}
