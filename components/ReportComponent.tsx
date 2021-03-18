import { DateTime } from "luxon";
import { useContext } from "react";
import { MyAppContext } from "../store";
import { useQuery } from "react-query";
import { TransactionType } from "@prisma/client";
import { ResponsiveBar } from "@nivo/bar";
import axios from "axios";
export default function ReportComponent({ month, active }) {
  const fetchReport = async ({ queryKey }) => {
    const [_, month, active] = queryKey;
    const trxType =
      active === "income" ? TransactionType.Income : TransactionType.Expense;
    const { data } = await axios.get(
      `/api/transactions/report?month=${month}&type=${trxType}`
    );
    return data;
  };
  const { data, isLoading, isError, error } = useQuery(
    ["report", month.code, active],
    fetchReport,
    { staleTime: 1000 * 60 * 30 }
  );
  if (isLoading) {
    return <span>Loading....</span>;
  }
  if (isError) {
    return <span>Error: {error}</span>;
  }
  const { result } = data;
  console.log(result);
  const color = active === "income" ? "green" : "red";
  return (
    <div className="bg-white rounded-md shadow-sm w-full p-4 flex flex-col h-96 items-start">
      <h2
        className={`text-sm font-semibold tracking-wide uppercase p-2 bg-${color}-100 inline-block rounded-md text-${color}-600`}
      >
        {`${month.name} ${DateTime.now().year}`}
      </h2>
      <ResponsiveBar
        data={result}
        indexBy="category"
        colors={{ scheme: "nivo" }}
        keys={["sum"]}
      />
    </div>
  );
}
