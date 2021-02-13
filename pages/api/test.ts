import { connectToDatabase } from "../../db";
const handler = async (req, res) => {
  const limit = req.query.limit;
  const skip = req.query.skip;
  console.log(skip,limit)
  const { TransactionModel } = await connectToDatabase();
  const data = await TransactionModel.find({})
    .skip(+skip)
    .limit(+limit);
  res.status(200).json({ msg: "success", data });
};

export default handler;
