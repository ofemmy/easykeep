import { addMonths } from "date-fns";
import prisma from "../prisma";

export default async function fetchSum(ownerId: number, currentMonth: Date) {
  const result = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      OR: [
        {
          AND: [
            { entryDate: { gte: currentMonth } },
            { entryDate: { lt: addMonths(currentMonth, 1) } },
          ],
        },
        {
          AND: [
            { isRecurringFrom: { lte: currentMonth } },
            { isRecurringTo: { gte: currentMonth } },
          ],
        },
      ],
      AND: { ownerId },
    },
    sum: { amount: true },
  });
  return result;
}
//trx is (current Month or IsRecurring) and belongs to user
// // where: {
//   AND: [
//     { ownerId },
//     { entryDate: { gte: currentMonth } },
//     { entryDate: { lt: addMonths(currentMonth, 1) } },
//   ],
// },
