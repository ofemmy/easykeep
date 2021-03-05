import { Prisma } from "@prisma/client";
export type NewTransaction = Prisma.TransactionGetPayload<{
  select: {
    title: true;
    amount: true;
    frequency: true;
    entryDate: true;
    recurringFrom: true;
    recurringTo: true;
    ownerId: true;
    category: true;
    type: true;
  };
}>;
