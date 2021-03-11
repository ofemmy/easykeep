import React, { useContext } from "react";
import formatNumberToCurrency from "../lib/formatCurrency";
import { MyAppContext } from "../store";

const DetailsDashboard = ({
  totalRecurring,
  color,
  typeName,
  totalOnce,
}) => {
  const { currency } = useContext(MyAppContext);
  return (
    <div className="pb-4 bg-gray-100 sm:pb-4">
      <div className="relative pt-16">
        <div className={`absolute inset-0 h-2/3 bg-${color}-600`}></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <dl className="rounded-md bg-white shadow-lg sm:grid sm:grid-cols-3">
              <div className="flex flex-col border-b border-gray-100 p-2 sm:p-6 text-center sm:border-0 sm:border-r">
                <dt className="order-2 mt-2 text-sm sm:text-lg leading-6 font-medium text-gray-500">
                  Total {typeName}
                </dt>
                <dd
                  className={`order-1 text-lg sm:text-2xl font-extrabold text-${color}-600`}
                >
                  {formatNumberToCurrency(totalOnce + totalRecurring, currency)}
                </dd>
              </div>
              <div className="flex flex-col border-t border-b border-gray-100 p-2 sm:p-6 text-center sm:border-0 sm:border-l sm:border-r">
                <dt className="order-2 mt-2 text-sm sm:text-lg leading-6 font-medium text-gray-500">
                  Monthly {typeName}
                </dt>
                <dd
                  className={`order-1 text-lg sm:text-2xl font-extrabold text-${color}-600`}
                >
                  {formatNumberToCurrency(totalOnce, currency)}
                </dd>
              </div>
              <div className="flex flex-col border-t border-gray-100 p-2 sm:p-6 text-center sm:border-0 sm:border-l">
                <dt className="order-2 mt-2 text-sm sm:text-lg leading-6 font-medium text-gray-500">
                  Recurring {typeName}
                </dt>
                <dd
                  className={`order-1 text-lg sm:text-2xl font-extrabold text-${color}-600`}
                >
                  {formatNumberToCurrency(totalRecurring, currency)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsDashboard;

/**
 * 
 * <div className="max-w-6xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:px-8 lg:py-6">
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
 * 
 * 
 */
