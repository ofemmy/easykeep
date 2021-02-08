import { model } from "mongoose";
import TransactionSchema from "../schema/TransactionSchema";
import { ITransactionDocument } from "../types/ITransaction";
export const TransactionModel = model<ITransactionDocument>(
  "Transaction",
  TransactionSchema
);
