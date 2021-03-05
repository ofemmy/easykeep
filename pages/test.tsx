import { useContext, useEffect } from "react";
import mongoose from "mongoose";
import usePagination from "../lib/usePagination";
import { MyAppContext } from "../store/index";
import axios from "axios";
import { fetchTransactions } from "../db/queries/fetchTransactionsOld";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import withSession from "../lib/withSession";
import TransactionType from "../types/TransactionType";
import { QueryClient, useQuery } from "react-query";
import formatNumberToCurrency from "../lib/formatCurrency";
import Currency from "../types/Currency";
import SectionHeading from "../components/SectionHeading";
import DataTableBig from "../components/DataTableBig";

const getIncomes = async (config) => {
  const { month, skip, limit } = config;
  const res = await axios.get(
    `/api/transactions/income?month=${month}&skip=${skip}&limit=${limit}`
  );
  return res.data;
};
export default function Income({ user, pageData }) {
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
    numPerPage: 10,
  });
  useEffect(() => {
    setUser(user);
  }, [user]);
  const { data, isLoading, isError } = useQuery(
    ["transactions", month, skip, limit],
    () => getIncomes({ skip, limit, month: 1 }),
    { initialData: pageData, keepPreviousData: true }
  );
  const { summary, transactions, totalResults } = data.data;
  const recurringIncomes = transactions.filter((trx) => trx.isRecurring);
  const nonRecurringIncomes = transactions.filter(
    (trx) => trx.month == 1 && trx.isRecurring === false
  );
  return (
    <>
      <Header pageTitle="Income" />
      <div className="max-6xl mx-auto border-t border-gray-200">
        <div className="bg-green-50 overflow-hidden shadow">
          <div className="px-4 py-5 sm:p-6 flex items-center flex-col">
            <p className="text-sm text-gray-500  uppercase">
              Total income - {month.name}
            </p>

            {isLoading ? (
              <p>Data Loading....</p>
            ) : (
              <h2 className="text-3xl mt-3 sm:mt-4 font-extrabold text-green-800 sm:text-4xl">
                {formatNumberToCurrency(summary.totalIncome, Currency.EUR)}
              </h2>
            )}
          </div>
        </div>
        <SectionHeading text="Recurring Income" />
        <DataTableBig
          transactions={transactions}
          totalResults={totalResults}
          goToNext={goNext}
          goToPrev={goPrev}
          currentCount={currentCount}
          isLastPage={isLastPage}
          isFirstPage={isFirstPage}
          showNav={true}
        />
      </div>
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
  const filter = {
    owner: ObjectId(user._id),
    type: TransactionType.INCOME,
    $or: [{ month: 1 }, { isRecurring: true }],
  };
  const data = await fetchTransactions({
    filter,
    queryOptions: options,
  });
  const result = { msg: "success", data: JSON.parse(JSON.stringify(data)) };
  return {
    props: { user, pageData: result }, //went JSON crazy because Next JS is having problems with _id and date fields
  };
});
