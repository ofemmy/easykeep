import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Transaction, TransactionType } from "@prisma/client";
import useProfile from "../lib/useProfile";
import { DateTime } from "luxon";
import {
  calculateSum,
  getLowestAndHighestCategory,
  calculateLowestAndHighestValue,
} from "../lib/reportHandler";
import formatNumberToCurrency from "../lib/formatCurrency";
import { UseQueryResult } from "react-query";
export const ReportPanel = ({
  queryObject,
  active,
}: {
  queryObject: UseQueryResult<any, unknown>;
  active: string;
}) => {
  const {
    userProfile,
    isProfileLoading,
    isProfileError,
    profileError,
  } = useProfile();
  const typeColor = active === "income" ? "green" : "red";

  if (isProfileLoading) {
    return <p>Loading....</p>;
  }
  if (isProfileError) {
    return <p>{profileError}</p>;
  }
  if (queryObject.isLoading) {
    return <p>Loading....</p>;
  }
  if (queryObject.error) {
    return <p>{queryObject.error}</p>;
  }
  const { currency } = userProfile.profile;
  const { result } = queryObject.data;
  const [lowestCategory, highestCategory] = getLowestAndHighestCategory(result);
  const [
    lowestTransactionItem,
    highestTransactionItem,
  ] = calculateLowestAndHighestValue(result);
  return (
    <div className="flex">
      <div className="w-[80%] bg-white rounded-md shadow-sm h-screen overflow-hidden">
        {/* <ul className="divide-y divide-gray-200"> */}
        <Accordion allowToggle overflow="hidden" defaultIndex={[0]}>
          {Object.entries<{ totalSum: number; transactions: Transaction[] }>(
            result
          ).map(([categoryName, categoryItem]) => (
            <AccordionItem key={categoryName}>
              <h2>
                <AccordionButton
                  _focus={{ outline: "none" }}
                  color="#4b5563"
                  py={4}
                  _expanded={{ bg: "#374151", color: "white" }}
                >
                  <div className="flex-1 flex items-center min-w-0 justify-between">
                    <div>
                      <p className="text-sm font-medium truncate uppercase">
                        {categoryName}
                      </p>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end items-center">
                      <div className="flex flex-col items-end justify-center">
                        <p className="text-sm font-medium">
                          {formatNumberToCurrency(
                            categoryItem.totalSum,
                            currency
                          )}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-${typeColor}-900 bg-${typeColor}-200`}
                        >
                          <p className={`text-${typeColor}-900`}>
                            {(
                              (100 * categoryItem.totalSum) /
                              calculateSum(result)
                            ).toFixed(2)}
                            %
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                  <AccordionIcon ml={8} />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <div className="flow-root text-green-600">
                  <ul className="-my-5 divide-y #f3f4f6 divide-gray-200">
                    {categoryItem.transactions.map((trxItem) => (
                      <li className="py-6 ">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium  truncate">
                              {trxItem.title}{" "}
                              {trxItem.frequency === "Recurring" && (
                                <span className="text-xs">(Recurring)</span>
                              )}
                            </p>
                            {trxItem.frequency === "Once" ? (
                              <p className="text-sm mt-1">
                                Entry Date:
                                {DateTime.fromJSDate(
                                  new Date(trxItem.entryDate)
                                ).toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-sm mt-1">
                                <span>
                                  {DateTime.fromJSDate(
                                    new Date(trxItem.recurringFrom)
                                  ).toLocaleString()}
                                </span>
                                <span> - </span>
                                <span className="">
                                  {DateTime.fromJSDate(
                                    new Date(trxItem.recurringTo)
                                  ).toLocaleString()}
                                </span>
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {formatNumberToCurrency(trxItem.amount, currency)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="bg-white rounded-md shadow-sm h-screen border-l-2 border-gray-100 py-4 ml-4 px-6">
        <div className="flex-flex-col space-y-2">
          <div className="bg-green-100 w-80 mx-auto rounded-md">
            <div className="flex flex-col p-4">
              <div>
                <h3 className="text-green-600">Total Income</h3>
              </div>
              <div className="text-green-600 font-semibold">20000$</div>
            </div>
          </div>
          <div className="bg-yellow-100 w-80 mx-auto rounded-md">
            <div className="flex flex-col p-4">
              <div>
                <h3 className="text-yellow-600">Highest income</h3>
              </div>
              <div className="text-yellow-600 font-semibold flex justify-between">
                <span className="truncate">{highestTransactionItem.title}</span>
                <span>
                  {formatNumberToCurrency(
                    highestTransactionItem.amount,
                    currency
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-purple-100 w-80 mx-auto rounded-md">
            <div className="flex flex-col p-4">
              <div>
                <h3 className="text-purple-600">Lowest income</h3>
              </div>
              <div className="text-purple-600 font-semibold flex justify-between">
                <span className="truncate">{lowestTransactionItem.title}</span>
                <span>
                  {formatNumberToCurrency(
                    lowestTransactionItem.amount,
                    currency
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-pink-100 w-80 mx-auto rounded-md">
            <div className="flex flex-col p-4">
              <div>
                <h3 className="text-pink-600">Highest income category</h3>
              </div>
              <div className="text-pink-600 font-semibold flex justify-between">
                <span>{highestCategory[0]}</span>
                <span>
                  {formatNumberToCurrency(
                    highestCategory[1].totalSum,
                    currency
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-blue-100 w-80 mx-auto rounded-md">
            <div className="flex flex-col p-4">
              <div>
                <h3 className="text-blue-600">Lowest income category</h3>
              </div>
              <div className="text-blue-600 font-semibold  flex justify-between">
                <span>{lowestCategory[0]}</span>
                <span>
                  {formatNumberToCurrency(lowestCategory[1].totalSum, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
