import { Doughnut } from "react-chartjs-2";
import ScaleSVG from "./svgs/ScaleSVG";
import formatNumberToCurrency from "../lib/formatCurrency";
import React, { useContext } from "react";
import { MyAppContext } from "../store";
interface DashboardPropType {
  summary: { totalIncome: number; totalExpense: number };
}
const Dashboard: React.FC<DashboardPropType> = ({ summary }) => {
  const graphData = {
    labels: [
      "Income",
      "Expenses",
      //'Yellow',
      //'Test','Another'
    ],
    datasets: [
      {
        data: [summary.totalIncome, summary.totalExpense],
        //data:[0,0],
        backgroundColor: [
          "#10a335",
          "#ec0b3c",
          //'#36A2EB',
          //'#e4af2a',

          // '#58197c3'
        ],
        hoverBackgroundColor: [
          "#10a335",
          "#ec0b3c",
          //'#36A2EB',
          //'#FFCE56',

          //'#58197c3'
        ],
      },
    ],
  };
  const { month, currency } = useContext(MyAppContext);
  return (
    <div className="max-w-6xl px-4 sm:px-6 mt-6 lg:px-8">
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        {month.name}
      </h2>

      <div className="mt-4 grid lg:h-40 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card component */}
        <div className="bg-white overflow-hidden shadow rounded-lg relative">
          <div className="p-5">
            <div className="flex items-center lg:mt-4">
              <div className="flex-shrink-0">
                <ScaleSVG />
              </div>
              <div className="ml-1 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Income
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-800">
                      {formatNumberToCurrency(summary.totalIncome, currency)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-green-400 px-5 py-3 lg:absolute bottom-0 left-0 right-0">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-white hover:text-gray-900"
              >
                View all
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg relative">
          <div className="p-5">
            <div className="flex items-center lg:mt-4">
              <div className="flex-shrink-0">
                <ScaleSVG />
              </div>
              <div className="ml-1 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Expenses
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatNumberToCurrency(summary.totalExpense, currency)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-red-400 px-5 py-3 lg:absolute bottom-0 left-0 right-0">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-white hover:text-gray-900"
              >
                View all
              </a>
            </div>
          </div>
        </div>
        {summary ? (
          <div className="bg-white overflow-hidden shadow rounded-lg lg:py-4 py-2">
            <Doughnut
              data={graphData}
              options={{
                maintainAspectRatio: false,
                legend: {
                  position: "right",
                  align: "center",
                  labels: { usePointStyle: true },
                },
                layout: { padding: { right: 10, left: 10 } },
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default Dashboard;
