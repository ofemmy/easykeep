import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import withSession from "../lib/withSession";
import { MyAppContext } from "../store";
import mongoose from "mongoose";
import {format} from "date-fns"
import { Skeleton, Stack } from "@chakra-ui/react";
import { fetchTransactions } from "../db/queries/fetchTransactions";
import { QueryClient, useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import axios from "axios";
import Dashboard from "../components/Dashboard";
import useWindowWidth from "../lib/useWindowWidth";
import usePagination from "../lib/usePagination";
import TitleComponent from "../components/TitleComponent";
import AmountComponent from "../components/AmountComponent";
import CategoryComponent from "../components/CategoryComponent";

const DataTableBig = dynamic(() => import("../components/DataTableBig"));
const DataTableSmall = dynamic(() => import("../components/DataTableSmall"));
const columns =[
  {
      Header:"Title",
      accessor:"title",
      Cell:({value,row})=><TitleComponent value={value}/>
  },
  {
      Header:"Amount",
      accessor:"amount",
      Cell:({value,row})=><AmountComponent value={value} obj={row.original}/>
  },
  {
    Header:"Date",
    accessor:row=>format(new Date(row.date),"MM/dd/yyyy")
},
  {
      Header:"Category",
      accessor:"category",
      Cell:({value})=><CategoryComponent value={value}/>
  },
  
]
const getTransactions = async (config) => {
  const { month, skip, limit } = config;
  const res = await axios.get(
    `/api/transactions?month=${month}&skip=${skip}&limit=${limit}`
  );

  return res.data;
};

export default function Home({ user, pageData }) {
  const screenWidthMatched = useWindowWidth("sm");
  const { setUser, month } = useContext(MyAppContext);
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0)
  useEffect(() => {
    setUser(user);
  }, [user]);
  const { data, isLoading, isError } = useQuery(
    ["transactions", month, skip, limit],
    () => getTransactions({ skip, limit, month: 1 }),
    { initialData: pageData, keepPreviousData: true }
  );
  const { summary, transactions, totalResults } = data.data;
  const pageCount = Math.ceil(totalResults/limit)
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
        <Dashboard summary={summary} />
      )}
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900 sm:px-6 lg:px-8">
        Recent transactions
      </h2>

      {screenWidthMatched ? (
        <DataTableBig
          transactions={transactions}
          totalResults={totalResults}
          setSkip={setSkip}
          columnData={columns}
          pageCount={pageCount}
          limit={limit}
        />
      ) : (
        <DataTableSmall
          transactions={transactions}
          totalResults={totalResults}
        />
      )}
      <div className="mt-4"></div>
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
  const result = { msg: "success", data: JSON.parse(JSON.stringify(data)) };
  return {
    props: { user, pageData: result }, //went JSON crazy because Next JS is having problems with _id and date fields
  };
});
