import { addMonths } from "date-fns";
import prisma from "../prisma";

export default async function fetchTotalCount(
  ownerId: number,
  currentMonth: Date
) {
  const totalCount = await prisma.transaction.count({
    where: {
      AND: [
        { ownerId },
        { entryDate: { gte: currentMonth } },
        { entryDate: { lt: addMonths(currentMonth, 1) } },
      ],
    },
  });
  return totalCount;
}
