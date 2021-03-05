import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../db/prisma";
import { TransactionType, TrxFrequency } from "@prisma/client";
import faker from "faker";
import { addMonths, startOfMonth } from "date-fns";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transactions = Array.from({ length: 20 }, (v, i) => ({
    title: faker.lorem.sentence(8),
    amount: faker.finance.amount(100, 5000),
    entryDate: faker.date.recent(),
    category: faker.random.arrayElement([
      "Rent",
      "Groceries",
      "Entertainment",
      "Transportation",
      "Food",
      "Utilities",
      "Insurance",
      "Medical",
      "Debt",
      "Miscellaneous",
      "Clothing",
      "Personal",
      "Gifts",
      "Income",
      "Education",
      "Childcare",
    ]),
    type: faker.random.arrayElement(
      Object.keys(TransactionType)
    ) as TransactionType,
    ownerId: 1,
    frequency: faker.random.arrayElement(
      Object.keys(TrxFrequency)
    ) as TrxFrequency,
    recurrenceDuration: faker.random.number(12),
  }));
  const newTrx = await prisma.transaction.createMany({ data: transactions });
  res.status(201).json({ data: newTrx.count });
}
