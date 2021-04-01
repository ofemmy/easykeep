import { DateTime } from "luxon";
import { TransactionType, TrxFrequency } from "@prisma/client";
import { Prisma } from "@prisma/client";
export type QueryOptions = {
  ownerId: string;
  date?: DateTime;
  limit?: number;
  skip?: number;
  whereClause?: Prisma.Sql;
  trxType?: TransactionType;
  trxFrequency?: TrxFrequency;
  frequencyType?: "all" | "nonRecurringOnly" | "recurringOnly";
};
