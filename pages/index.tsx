import { useContext, useEffect } from "react";
import Header from "../components/Header";
import withSession from "../lib/withSession";
import { MyAppContext } from "../store";
import mongoose from "mongoose";
import { fetchTransactions } from "../db/queries/fetchTransactions";
import { useQuery } from "react-query";
import axios from "axios";
import Dashboard from "../components/Dashboard";

const getTransactions = async () => {
  await axios.get("/api/transactions")
}

export default function Home({ user, pageData }) {
  const { setUser } = useContext(MyAppContext);
  useEffect(() => {
    setUser(user);
  }, [user]);
  return (
    <>
      <Header pageTitle="Home" />
      <Dashboard summary={pageData.summary}/>
    </>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const options = {
    limit: 5,
    skip: 0,
    sort: { $natural: -1 },
  };
  const ObjectId = mongoose.Types.ObjectId;
  const filter = { owner: ObjectId(user._id), month: 1 };
  const data = await fetchTransactions({
    filter,
    queryOptions: options,
  });
  return {
    props: { user, pageData: JSON.parse(JSON.stringify(data)) }, //went JSON crazy because Next JS is having problems with _id and date fields
  };
});
