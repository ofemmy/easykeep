import {Document,Model, Types} from "mongoose"
import { Category } from "../../types/Category";
import TransactionType  from "../../types/TransactionType";

export interface ITransaction {
    title:string;
    amount:number;
    type:TransactionType;
    isRecurring:boolean;
    date:Date;
    category:Category;
    month:number;
    year:number;
    owner:Types.ObjectId|string;
}

export interface ITransactionDocument extends ITransaction, Document {}
export interface ITransactionModel extends Model<ITransactionDocument>{}