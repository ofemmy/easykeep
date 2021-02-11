import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import mongoose from "mongoose";
import usePagination from "../../lib/usePagination";
import { MyAppContext } from "../../store/index";
import { fetchTransactions } from "../../db/queries/fetchTransactions";
import withSession from "../../lib/withSession";
import Header from "../../components/Header";
import TrxType from "../../types/TransactionType";
import { QueryClient, useQuery } from "react-query";
import formatNumberToCurrency from "../../lib/formatCurrency";
import Currency from "../../types/Currency";
import SectionHeading from "../../components/SectionHeading";
import DataTableBig from "../../components/DataTableBig";
import axios from "axios";
import getTransactionType from "../../lib/getTransactionType";
import capitalize from "../../lib/capitalize";
const fetchByTransactionType = async (config) => {
    const { month, skip, limit,type } = config;
    const res = await axios.get(
      `/api/transactions/${type}?month=${month}&skip=${skip}&limit=${limit}`
    );
    return res.data;
  };

export default function TransactionType({user, pageData}) {
  const router = useRouter();
  const { type } = router.query;
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
    ["transactions", month, skip, limit,type],
    () => fetchByTransactionType({ skip, limit, month: 1,type }),
    { initialData: pageData, keepPreviousData: true }
  );
  const { summary, transactions, totalResults } = data.data;
  const totalValue = type==="income"?summary.totalIncome:summary.totalExpense
  const color = type=="income"?"green":"red";
return (
    <>
      <Header pageTitle={capitalize(type as string)} />
      <div className="max-6xl mx-auto border-t border-gray-200">
        <div className={`bg-${color}-500 overflow-hidden shadow`}>
          <div className="px-4 py-5 sm:p-6 flex items-center flex-col">
            <p className="text-sm text-white  uppercase">
              Total {type} - {month.name}
            </p>

            {isLoading ? (
              <p>Data Loading....</p>
            ) : (
              <h2 className={`text-3xl mt-3 sm:mt-4 font-extrabold text-white sm:text-4xl`}>
                {formatNumberToCurrency(totalValue, Currency.EUR)}
              </h2>
            )}
          </div>
        </div>
        <SectionHeading text={`List of ${type}`} />
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
export const getServerSideProps = withSession(async function ({ req, res,query }) {
    const user = req.session.get("user");
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    const transactionType = getTransactionType(query.type)
    const options = {
      limit: 5,
      skip: 0,
      sort: { $natural: -1 },
    };
    const ObjectId = mongoose.Types.ObjectId;
    const filter = {
      owner: ObjectId(user._id),
      type: transactionType,
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
