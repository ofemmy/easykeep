import dynamic from "next/dynamic";
import { useContext, useEffect } from "react";
import Header from "../components/Header";
import withSession from "../lib/withSession";
import { MyAppContext } from "../store";
import { format } from "date-fns";
import { Skeleton } from "@chakra-ui/react";
import { useQuery } from "react-query";
import axios from "axios";
import Dashboard from "../components/Dashboard";
import useWindowWidth from "../lib/useWindowWidth";
import TitleComponent from "../components/TitleComponent";
import AmountComponent from "../components/AmountComponent";
import CategoryComponent from "../components/CategoryComponent";
import {
  fetchRecentTransactions,
  fetchSum,
  fetchTransactions,
} from "../db/queries";
import { DateTime } from "luxon";

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
    accessor: (row) => DateTime.fromISO(row.entryDate).toISODate(), // TODO:date
  },
  {
    Header: "Category",
    accessor: "category",
    Cell: ({ value }) => <CategoryComponent value={value} />,
  },
];
const getTransactions = async (config) => {
  const { month, skip, limit } = config;
  const res = await axios.get(`/api/transactions?month=${month}`);

  return res.data;
};

export default function Home({ user, pageData }) {
  const screenWidthMatched = useWindowWidth("sm");
  const { setUser, month, setSidebarOpen } = useContext(MyAppContext);
  useEffect(() => {
    setUser(user);
  }, [user]);
  useEffect(() => {
    setSidebarOpen(false);
  }, []);
  const { data, isLoading, isError } = useQuery(
    ["transactions", month],
    () => getTransactions({ month: month.code }),
    { initialData: pageData, keepPreviousData: true }
  );
  const { summary, transactions } = data.data;
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
          columnData={columns}
          showNav={false}
        />
      ) : (
        <DataTableSmall transactions={transactions} isDetailPage={false} />
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
  const today = DateTime.utc();
  const requestOptions = {
    limit: 5,
    ownerId: user.id,
    date: today,
  };
  const trxList = await fetchTransactions(requestOptions);
  const summary = await fetchSum({ ownerId: user.id, date: today });

  const result = {
    msg: "success",
    data: { transactions: trxList, summary },
  };
  const pageData = JSON.parse(JSON.stringify(result));
  return {
    props: { user, pageData },
  };
});
