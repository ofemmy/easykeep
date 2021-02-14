import React, { useContext } from "react";
import formatNumberToCurrency from "../lib/formatCurrency";
import { MyAppContext } from "../store";

const DetailsDashboard = ({ totalRecurring, totalValue,color,typeName }) => {
  const { currency } = useContext(MyAppContext);
  return (
    <div className={`bg-${color}-600 text-${color}-100`}>
      <div className="max-w-6xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:px-8 lg:py-6">
        <dl className="text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-5 sm:gap-8">
          <div className="flex flex-col justify-center items-center">
            <dt className="md:order-2 mt-2 text-sm leading-6 font-medium">
              Total {typeName}
            </dt>
            <dd className="order-1 text-2xl font-extrabold text-white">
              {formatNumberToCurrency(totalValue, currency)}
            </dd>
          </div>
          <span className="flex justify-center items-center">&#61;</span>
          <div className="flex flex-col sm:mt-0 justify-center items-center">
            <dt className="md:order-2 mt-2 text-sm leading-6 font-medium">
             Monthly {typeName}
            </dt>
            <dd className="order-1 text-2xl font-extrabold text-white">
              {formatNumberToCurrency(
                Math.abs(totalValue - totalRecurring),
                currency
              )}
            </dd>
          </div>
          <span className="flex justify-center items-center">&#43;</span>
          <div className="flex flex-col sm:mt-0 justify-center items-center">
            <dt className="md:order-2 mt-2 text-sm leading-6 font-medium">
              Recurring {typeName}
            </dt>
            <dd className="order-1 text-2xl font-extrabold text-white">
              {formatNumberToCurrency(totalRecurring, currency)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default DetailsDashboard;
