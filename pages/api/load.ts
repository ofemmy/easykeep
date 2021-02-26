import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../db/prisma";
import { TransactionType } from "@prisma/client";
import faker from "faker";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transactions = Array.from({ length: 20 }, (v, i) => ({
    title: faker.lorem.sentence(8),
    amount: faker.finance.amount(100, 5000),
    isRecurring: faker.random.boolean(),
    date: faker.date.recent(),
    month: faker.random.number(11),
    year: 2021,
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
  }));
  const newTrx = await prisma.transaction.createMany({ data: transactions });
  res.status(201).json({ data: newTrx.count });
}
