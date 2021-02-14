import { useRouter } from "next/router";
import { useContext, useEffect,useState } from "react";
import mongoose from "mongoose";
import ScaleSVG from "../../components/svgs/ScaleSVG";
import usePagination from "../../lib/usePagination";
import { MyAppContext } from "../../store/index";
import { fetchTransactions } from "../../db/queries/fetchTransactions";
import withSession from "../../lib/withSession";
import Header from "../../components/Header";
import TrxType from "../../types/TransactionType";
import { QueryClient, useQuery } from "react-query";
import formatNumberToCurrency from "../../lib/formatCurrency";
import {columns} from "../index";
import Currency from "../../types/Currency";
import SectionHeading from "../../components/SectionHeading";
import DataTableBig from "../../components/DataTableBig";
import axios from "axios";
import getTransactionType from "../../lib/getTransactionType";
import capitalize from "../../lib/capitalize";
import CardSVG from "../../components/svgs/CardSVG";


const fetchByTransactionType = async (config) => {
  const { month, skip, limit, type } = config;
  const res = await axios.get(
    `/api/transactions/${type}?month=${month}&skip=${skip}&limit=${limit}`
  );
  return res.data;
};

export default function TransactionType({ user, pageData }) {
  const router = useRouter();
  const { type } = router.query;
  const { setUser, month, currency } = useContext(MyAppContext);
  const [limit, setLimit] = useState(10)
  const [skip, setSkip] = useState(0)
  
  useEffect(() => {
    setUser(user);
  }, [user]);

  const { data, isLoading, isError } = useQuery(
    ["transactions", month, skip, limit, type],
    () => fetchByTransactionType({ skip, limit, month: month.code, type }),
    { initialData: pageData, keepPreviousData: true }
  );
  const { summary, transactions, totalResults } = data.data;
  const pageCount = Math.ceil(totalResults/limit)
  const totalValue =
    type === "income" ? summary.totalIncome : summary.totalExpense;
  const color = type == "income" ? "green" : "red";
  return (
    <>
      <Header pageTitle={capitalize(type as string)} />
      <div className="max-6xl mx-auto border-t border-gray-200">
        <div className="flex items-center justify-center bg-white">
          <div
            className={`bg-${color}-600 text-white overflow-hidden shadow-lg w-60`}
          >
            <div className="px-5 py-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {type === "income" ? <ScaleSVG /> : <CardSVG />}
                </div>
                <div className="flex-1 ml-1">
                  <dl>
                    <dt className="text-sm truncate uppercase">{`Total - ${month.name}`}</dt>
                    <dd>
                      <div className="font-medium text-lg">
                        {formatNumberToCurrency(totalValue, currency)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SectionHeading text={`List of ${type}`} />
        <DataTableBig
          transactions={transactions}
          totalResults={totalResults}
          setSkip={setSkip}
          columnData={columns}
          pageCount={pageCount}
          limit={limit}
          skip={skip}
        />
      </div>
    </>
  );
}
export const getServerSideProps = withSession(async function ({
  req,
  res,
  query,
}) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const transactionType = getTransactionType(query.type);
  const options = {
    limit: 5,
    skip: 0,
    sort: { $natural: -1 },
  };
  const ObjectId = mongoose.Types.ObjectId;
  const filter = {
    owner: ObjectId(user._id),
    type: transactionType,
    $or: [{ month: new Date().getMonth() }, { isRecurring: true }],
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
