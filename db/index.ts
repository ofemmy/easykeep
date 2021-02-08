import * as Mongoose from "mongoose";
import { IUserDocument } from "./types/IUser";
import { ITransactionDocument } from "./types/ITransaction";
import UserSchema from "./schema/UserSchema";
import TransactionSchema from "./schema/TransactionSchema";

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null, models: null };
}
let UserModel: Mongoose.Model<IUserDocument>;
let TransactionModel: Mongoose.Model<ITransactionDocument>;
interface DBConnection {
  db:Mongoose.Mongoose;
  UserModel:Mongoose.Model<IUserDocument>;
  TransactionModel:Mongoose.Model<ITransactionDocument>;
}
export async function connectToDatabase():Promise<DBConnection> {
  if (cached.conn) {
    "Using cached instance of mongo connection"
  return  {
    db:cached.conn.mongoose,
    ...cached.models
  }
    //return cached.conn;
  }

  if (!cached.promise) {
    "No pending promise of cached connection"
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = Mongoose.connect(MONGODB_URI, opts).then((db) => {
      "New connection to db established"
      return {
        mongoose: db,
      };
    });
  }
  cached.conn = await cached.promise; //this is mongoose connection NOT mongoDB Native connection
 
  const { mongoose } = cached.conn;
  console.log("After promise resolved", mongoose.connection.readyState)
  UserModel = mongoose.model<IUserDocument>("User", UserSchema);
  TransactionModel = mongoose.model<ITransactionDocument>(
    "Transaction",
    TransactionSchema
  );
  cached.models = {UserModel,TransactionModel}
  return {
    db:mongoose,
    ...cached.models
  }
  //return cached.conn;
}
