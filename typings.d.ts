import { Mongoose } from "mongoose";
import { ITransactionDocument } from "./db/types/ITransaction";
import { IUserDocument } from "./db/types/IUser";
import { PrismaClient } from "@prisma/client";

declare global {
  type Cached = {
    conn: Mongoose.Connection;
    promise: Promise<Mongoose.Connection>;
    models: {
      UserModel: Mongoose.Model<IUserDocument>;
      TransactionModel: Mongoose.Model<ITransactionDocument>;
    };
  };
  namespace NodeJS {
    interface Global {
      mongo: Cached;
      prisma: PrismaClient;
    }
  }
}
