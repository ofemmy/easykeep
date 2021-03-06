import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useWindowWidth from "../../lib/useWindowWidth";
import { MyAppContext } from "../../store/index";
import Header from "../../components/Header";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { QueryClient, useQuery } from "react-query";
import { columns } from "../index";
import useProfile from "../../lib/useProfile";
import SectionHeading from "../../components/SectionHeading";
import axios from "axios";
import { capitalize } from "lodash";
import { DateTime } from "luxon";
import PieWidget from "../../components/PieWidget";
import PieTotalComponent from "../../components/PieTotalComponent";
import Dropdown from "../../components/Dropdown";

const DataTableBig = dynamic(() => import("../../components/DataTableBig"));
const DataTableSmall = dynamic(() => import("../../components/DataTableSmall"));

const fetchByTransactionType = async (config) => {
  const { month, skip, limit, type, frequency } = config;
  const res = await axios.get(
    `/api/transactions/${type}?month=${month}&skip=${skip}&limit=${limit}&frequency=${frequency}`
  );
  return res.data;
};

export default withPageAuthRequired(function TransactionType() {
  const screenWidthMatched = useWindowWidth("sm");
  const router = useRouter();
  const { type } = router.query;
  const { setUser, month, AppMainLinks } = useContext(MyAppContext);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [frequency, setFrequency] = useState("all");

  const { data, isLoading, isError } = useQuery(
    ["transactions", month, skip, limit, type, frequency],
    () =>
      fetchByTransactionType({
        skip,
        limit,
        month: month.code,
        type,
        frequency,
      }),
    { keepPreviousData: true, staleTime: 1000 * 60 * 30 }
  );
  const color = type == "income" ? "green" : "red";
  const {
    userProfile,
    isProfileLoading,
    isProfileError,
    profileError,
  } = useProfile();
  if (isLoading || isProfileLoading) {
    return <span>Loading....</span>;
  }
  if (isError || isProfileError) {
    return <span>Error: {profileError}</span>;
  }
  const { summary, transactions, totalResults } = data.data;
  const pageCount = Math.ceil(totalResults / limit);
  const { currency } = userProfile.profile;
  return (
    <div className="pb-8">
      <Header pageTitle={capitalize(type as string)} />
      <div className="max-6xl mx-auto border-t border-gray-200">
        <div className="px-8 mt-5">
          <div className="bg-white rounded-md shadow-sm w-full p-4 flex flex-col h-96 items-start">
            <h2
              className={`text-sm font-semibold tracking-wide uppercase p-2 bg-${color}-100 inline-block rounded-md text-${color}-600`}
            >
              {`${month.name} ${DateTime.now().year}`}
            </h2>
            <PieWidget
              summary={summary}
              trxType={type}
              currency={currency}
              CustomLayerComponent={PieTotalComponent(currency, type)}
            />
          </div>
        </div>
        {/* <DetailsDashboard
          totalRecurring={summary.totalRecurring}
          totalOnce={summary.totalOnce}
          color={color}
          typeName={capitalize(type as string)}
        /> */}
        <div className="flex items-center px-8 justify-between">
          <SectionHeading text={`${capitalize(type as string)}s`} />
          <div className="my-4">
            <Dropdown
              menuItems={["all", "non-recurring only", "recurring only"]}
              title="Filter by"
              actionHandler={setFrequency}
            />
          </div>
        </div>

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
            currency={currency}
          />
        )}
      </div>
    </div>
  );
});
// export const getServerSideProps = withPageAuthRequired({
//   async getServerSideProps({ req, res, query }) {
//     const { user } = getSession(req, res);
//     const trxType = getTransactionType(query.type as string);
//     const skip = 0;
//     const limit = 10;
//     const date = DateTime.utc();
//     const ownerId = user.sub;
//     const transactions = await fetchTransactionsByType({
//       trxType,
//       date,
//       limit,
//       skip,
//       ownerId,
//     });
//     const totalResults = await fetchTransactionCount({
//       ownerId,
//       date,
//       trxType,
//     });
//     const summary = await fetchSumByType({ ownerId, date, trxType });
//     console.log(summary, totalResults);
//     const data = { transactions, totalResults, summary };
//     const result = { msg: "success", data: JSON.parse(JSON.stringify(data)) };
//     return {
//       props: { user, pageData: result }, //went JSON crazy because Next JS is having problems with _id and date fields
//     };
//   },
// });
