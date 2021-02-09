import { model } from "mongoose";
import TransactionSchema from "../schema/TransactionSchema";
import { ITransactionDocument } from "../types/ITransaction";
import TransactionType from "../../types/TransactionType"
import {Category} from "../../types/Category"
// export const TransactionModel = model<ITransactionDocument>(
//   "Transaction",
//   TransactionSchema
// );
export class Transaction {
  title: string;
  amount: number;
  isRecurring: boolean;
  date: Date;
  month: number;
  year: number;
  type: TransactionType;
  category: Category;
  _id?: string;
  owner?:string|number
  constructor(
    title: string,
    amount: number,
    isRecurring: boolean,
    date: Date,
    type: TransactionType,
    category: Category,
    ownerId:string|number
  ) {
    this.title = title;
    this.amount = amount;
    this.isRecurring = isRecurring;
    this.type = type;
    this.category =
      type == TransactionType.INCOME ? Category.Income : category;
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.date=date;
    this.owner=ownerId;
  }
}