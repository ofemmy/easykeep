import { TrxFrequency } from ".prisma/client";
import prisma from "../prisma";

export async function fetchRecurringEntries(queryOptions) {
  const { ownerId, type } = queryOptions;
  try {
    const result = await prisma.transaction.findMany({
      where: { ownerId, frequency: TrxFrequency.Recurring, type },
      include: { category: true },
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
