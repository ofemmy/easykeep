import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useWindowWidth from "../../lib/useWindowWidth";
import { MyAppContext } from "../../store/index";
import withSession from "../../lib/withSession";
import Header from "../../components/Header";
import TrxType from "../../types/TransactionType";
import { QueryClient, useQuery } from "react-query";
import { columns } from "../index";
import Currency from "../../types/Currency";
import SectionHeading from "../../components/SectionHeading";
import axios from "axios";
import getTransactionType from "../../lib/getTransactionType";
import capitalize from "../../lib/capitalize";
import CardSVG from "../../components/svgs/CardSVG";
import DetailsDashboard from "../../components/DetailsDashboard";
import {
  fetchTransactionsByType,
  fetchTransactionCount,
  fetchSumByType,
} from "../../db/queries";
import { DateTime } from "luxon";

const DataTableBig = dynamic(() => import("../../components/DataTableBig"));
const DataTableSmall = dynamic(() => import("../../components/DataTableSmall"));

const fetchByTransactionType = async (config) => {
  const { month, skip, limit, type } = config;
  const res = await axios.get(
    `/api/transactions/${type}?month=${month}&skip=${skip}&limit=${limit}`
  );
  return res.data;
};

export default function TransactionType({ user, pageData }) {
  const screenWidthMatched = useWindowWidth("sm");
  const router = useRouter();
  const { type } = router.query;
  const { setUser, month } = useContext(MyAppContext);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    setUser(user);
  }, [user]);

  const { data, isLoading, isError } = useQuery(
    ["transactions", month, skip, limit, type],
    () => fetchByTransactionType({ skip, limit, month: month.code, type }),
    { initialData: pageData, keepPreviousData: true }
  );
  const { summary, transactions, totalResults } = data.data;
  const pageCount = Math.ceil(totalResults / limit);
  const color = type == "income" ? "green" : "red";
  return (
    <>
      <Header pageTitle={capitalize(type as string)} />
      <div className="max-6xl mx-auto border-t border-gray-200">
        <DetailsDashboard
          totalRecurring={summary.totalRecurring}
          totalOnce={summary.totalOnce}
          color={color}
          typeName={capitalize(type as string)}
        />

        <SectionHeading text={`List of ${type}`} />
        {screenWidthMatched ? (
          <DataTableBig
            transactions={transactions}
            totalResults={totalResults}
            setSkip={setSkip}
            columnData={columns}
            pageCount={pageCount}
            limit={limit}
            skip={skip}
          />
        ) : (
          <DataTableSmall
            transactions={transactions}
            totalResults={totalResults}
            isDetailPage={true}
          />
        )}
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
  const trxType = getTransactionType(query.type);
  const skip = 0;
  const limit = 10;
  const date = DateTime.utc();
  const ownerId = user.id;
  const transactions = await fetchTransactionsByType({
    trxType,
    date,
    limit,
    skip,
    ownerId,
  });
  const totalResults = await fetchTransactionCount({ ownerId, date, trxType });
  const summary = await fetchSumByType({ ownerId, date, trxType });
  console.log(summary, totalResults);
  const data = { transactions, totalResults, summary };
  const result = { msg: "success", data: JSON.parse(JSON.stringify(data)) };
  return {
    props: { user, pageData: result }, //went JSON crazy because Next JS is having problems with _id and date fields
  };
});
