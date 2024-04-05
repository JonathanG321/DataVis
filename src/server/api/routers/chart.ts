import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getBaseData } from "~/utils/testData";
import type { DataItem, FilterOptions } from "~/utils/types";

const baseData = getBaseData();

export const chartRouter = createTRPCRouter({
  getData: publicProcedure
    .input(
      z.object({
        timeFrameMonth: z.number(),
        timeFrameType: z.union([
          z.literal("weekly"),
          z.literal("monthly"),
          z.literal("yearly"),
        ]),
        timeFrameYear: z.number(),
        timeFrameWeek: z.date(),
        reviewType: z.array(
          z.union([
            z.literal("payment"),
            z.literal("general"),
            z.literal("history"),
            z.literal("scheduled"),
          ]),
        ),
      }),
    )
    .query(({ input }): DataItem[] => {
      return dateFilter(baseData, input);
    }),
});

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
