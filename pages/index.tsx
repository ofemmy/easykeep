import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import withSession from "../lib/withSession";
import { MyAppContext } from "../store";
import mongoose from "mongoose";
import { Skeleton, Stack } from "@chakra-ui/react";
import { fetchTransactions } from "../db/queries/fetchTransactions";
import { QueryClient, useQuery } from "react-query";
import { dehydrate } from "react-query/hydration";
import axios from "axios";
import Dashboard from "../components/Dashboard";
import useWindowWidth from "../lib/useWindowWidth";
import usePagination from "../lib/usePagination";

const DataTableBig = dynamic(() => import("../components/DataTableBig"));
const DataTableSmall = dynamic(() => import("../components/DataTableSmall"));

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
  const {
    skip,
    limit,
    goNext,
    goPrev,
    currentCount,
    isLastPage,
    isFirstPage,
  } = usePagination({
    totalNumofResults: pageData.data.totalResults,
    numPerPage: 5,
  });
  useEffect(() => {
    setUser(user);
  }, [user]);
  const { data, isLoading, isError } = useQuery(
    ["transactions", month, skip, limit],
    () => getTransactions({ skip, limit, month: 1 }),
    { initialData: pageData, keepPreviousData: true }
  );
  const { summary, transactions, totalResults } = data.data;

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
          goToNext={goNext}
          goToPrev={goPrev}
          currentCount={currentCount}
          isLastPage={isLastPage}
          isFirstPage={isFirstPage}
        />
      ) : (
        <DataTableSmall
          transactions={transactions}
          totalResults={totalResults}
          goToNext={goNext}
          goToPrev={goPrev}
          currentCount={currentCount}
          isLastPage={isLastPage}
          isFirstPage={isFirstPage}
        />
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
  const result = { msg: "success", data: JSON.parse(JSON.stringify(data)) };
  return {
    props: { user, pageData: result }, //went JSON crazy because Next JS is having problems with _id and date fields
  };
});
