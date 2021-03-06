import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import withSession from "../lib/withSession";
import { MyAppContext } from "../store";
import { format } from "date-fns";
import { Skeleton, Stack } from "@chakra-ui/react";
import {
  fetchTransactions,
  fetchTransactionsWithPrisma,
} from "../db/queries/fetchTransactionsOld";
import { QueryClient, useQuery } from "react-query";
import useDeleteTransaction from "../lib/useDeleteTransaction";
import axios from "axios";
import Dashboard from "../components/Dashboard";
import useWindowWidth from "../lib/useWindowWidth";
import TitleComponent from "../components/TitleComponent";
import AmountComponent from "../components/AmountComponent";
import CategoryComponent from "../components/CategoryComponent";
import { fetchRecentTransactions, fetchSum } from "../db/queries";
import { getDateFromQuery } from "../lib/useDate";

const DataTableBig = dynamic(() => import("../components/DataTableBig"));
const DataTableSmall = dynamic(() => import("../components/DataTableSmall"));
export const columns = [
  {
    Header: "Title",
    accessor: "title",
    Cell: ({ value, row }) => <TitleComponent value={value} />,
  },
  {
    Header: "Amount",
    accessor: "amount",
    Cell: ({ value, row }) => (
      <AmountComponent value={value} obj={row.original} />
    ),
  },
  {
    Header: "Date",
    accessor: (row) => format(new Date(row.entryDate), "MM/dd/yyyy"), // TODO:date
  },
  {
    Header: "Category",
    accessor: "category",
    Cell: ({ value }) => <CategoryComponent value={value} />,
  },
];
const getTransactions = async (config) => {
  const { month, skip, limit } = config;
  const res = await axios.get(
    `/api/transactions?month=${month}&skip=${skip}&limit=${limit}`
  );

  return res.data;
};

export default function Home({ user, pageData }) {
  const screenWidthMatched = useWindowWidth("sm");
  const { setUser, month, setSidebarOpen } = useContext(MyAppContext);
  const mutation = useDeleteTransaction();
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  useEffect(() => {
    setUser(user);
  }, [user]);
  useEffect(() => {
    setSidebarOpen(false);
  }, []);
  const { data, isLoading, isError } = useQuery(
    ["transactions", month, skip, limit],
    () => getTransactions({ skip, limit, month: month.code }),
    { initialData: pageData, keepPreviousData: true }
  );
  const { summary, transactions, totalResults } = data.data;
  const pageCount = Math.ceil(totalResults / limit);
  return (
    <>
      <Header pageTitle="Home" />
      {isLoading ? (
        <div className="max-6xl mx-auto px-4 mt-5">
          <Skeleton height="250px" />
        </div>
      ) : isError ? (
        <p>Error fetching data please reload</p>
      ) : (
        <Dashboard summary={summary} />
      )}
      <h2 className="max-w-6xl mx-auto mt-8 px-4 text-lg leading-6 font-medium text-gray-900">
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
          skip={skip}
          showNav={false}
        />
      ) : (
        <DataTableSmall
          transactions={transactions}
          totalResults={totalResults}
          isDetailPage={false}
        />
      )}
      <div className="mt-16"></div>
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
  const today = new Date();
  const current_month = getDateFromQuery(today.getFullYear(), today.getMonth());
  const requestOptions = {
    howMany: 5,
    ownerId: user.id,
    date: current_month,
  };
  const trxList = await fetchRecentTransactions(requestOptions);
  const summary = await fetchSum({ ownerId: user.id, date: current_month });

  const result = {
    msg: "success",
    data: { transactions: trxList, summary },
  };
  return {
    props: { user, pageData: result },
  };
});
