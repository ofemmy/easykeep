import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import withSession from "../lib/withSession";
import { MyAppContext } from "../store";
import mongoose from "mongoose";
import { Skeleton, Stack } from "@chakra-ui/react";
import { fetchTransactions } from "../db/queries/fetchTransactions";
import { useQuery } from "react-query";
import axios from "axios";
import Dashboard from "../components/Dashboard";
import useWindowWidth from "../lib/useWindowWidth";

const DataTableBig = dynamic(() => import("../components/DataTableBig"));
const DataTableSmall = dynamic(() => import("../components/DataTableSmall"));

const getTransactions = async ({ queryKey }) => {
  const [_key, { month, skip, limit }] = queryKey;
  const res = await axios.get(
    `/api/transactions?month=${month}&skip=${skip}&limit=${limit}`
  );
  return res.data;
};

export default function Home({ user, pageData }) {
  const screenWidthMatched = useWindowWidth("sm");
  const { setUser, month } = useContext(MyAppContext);
  const [skip, setSkip] = useState(2);
  const [limit, setLimit] = useState(4);
  useEffect(() => {
    setUser(user);
  }, [user]);
  const { data, isLoading, isError } = useQuery(
    ["transactions", { month: month.code, limit, skip }],
    getTransactions,
    { initialData: pageData }
  );
  //const { transactions } = data.data;
  console.log(data.data);
  return (
    <>
      <Header pageTitle="Home" />
      {isLoading ? (
        <div className="max-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
          <Skeleton height="250px" />
        </div>
      ) : isError ? (
        <p>Error fetching data please reload</p>
      ) : (
        <Dashboard summary={pageData.summary} />
      )}
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        Recent transactions
      </h2>

      {screenWidthMatched ? (
        <DataTableBig transactions={pageData.transactions} />
      ) : (
        <DataTableSmall transactions={pageData.transactions} />
      )}
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
