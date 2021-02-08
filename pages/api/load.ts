import { Transaction } from "./../../db/models/TransactionModel";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../db";
import { Mongoose, model } from "mongoose";
import faker from "faker";
import { TransactionType } from "../../types/TransactionType";
import { Category } from "../../types/Category";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let status = 500,
    msg = "oops something happened",
    data = null;
  const { db, UserModel, TransactionModel } = await connectToDatabase();
  //clear the dataBase
//   const userCollectionDropped = db.connection.collection("users").drop();
  const trxCollectionDropped = db.connection.collection("transactions").drop();

  //load data into DB
  if (trxCollectionDropped) {
    // const result = await UserModel.insertMany(generateUserData(5), {
    //   rawResult: true,
    // });
    const result2 = await TransactionModel.insertMany(generateTrxData(10), {
      rawResult: true,
    });
    if (result2.insertedCount) {
      status = 201;
      msg = "success";
      data = {transactions: result2.insertedCount };
    }
    res.status(status).json({ msg, data });
  }

  //util functions

  function generateUserData(numberOfUsers: number) {
    let res = [];
    for (let i = 0; i < numberOfUsers; i++) {
      res.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    }
    return res;
  }
}

function generateTrxData(numOfTrx: number) {
  const randBool = [true, false];
  let res = [];
  for (let i = 0; i < numOfTrx; i++) {
    res.push(
      new Transaction(
        faker.lorem.sentence(),
        getRandomInt(4000),
        randBool[getRandomInt(1)],
        faker.date.recent(5),
        TransactionType.INCOME,
        Category.Income,
        "6020c64db6b25d4b3531cc9d"
      )
    );
  }
  return res;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
