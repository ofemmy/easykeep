const handler = async (req, res) => {
  // const result = await fetchTransactions({});
  // console.log(result);
  // res.status(200).json({ msg: "success", data: result });
  res.status(200).send({ result: ["hi", "two"] });
};

export default handler;
