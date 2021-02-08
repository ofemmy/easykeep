import {Document,Model} from "mongoose"

export interface ITransaction {
    title:string;
    amount:number;
    type:{type:string};
    isRecurring:boolean;
    date:Date;
    category:string;
    month:number;
    year:number;
    owner:string;
}

export interface ITransactionDocument extends ITransaction, Document {}
export interface ITransactionModel extends Model<ITransactionDocument>{}