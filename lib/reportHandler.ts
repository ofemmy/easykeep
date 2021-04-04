import { Transaction, TrxFrequency } from "@prisma/client";
import { reduce, first, last } from "lodash";
type Report = {
  [category: string]: { totalSum: number; transactions: Transaction[] };
};
export function reportHandler(data: Report) {}
export function calculateSum(resultObj: Report) {
  return reduce(
    resultObj,
    function (result, value) {
      return result + value.totalSum;
    },
    0
  );
}
export function calculateLowestAndHighestValue(resultObj: Report) {
  const transactions = Object.entries(resultObj)
    .flatMap((res) => res[1].transactions)
    .map((trx) => {
      trx["multipliedTotal"] = trx["multipliedTotal"] || trx.amount;
      return trx;
    });
  const sortedTransactions = transactions.sort(
    (trx1, trx2) =>
      Number(trx1["multipliedTotal"]) - Number(trx2["multipliedTotal"])
  );
  return [first(sortedTransactions), last(sortedTransactions)];
}
export function getLowestAndHighestCategory(resultObj: Report) {
  const result = Object.entries(resultObj).sort(
    (result1, result2) => result1[1].totalSum - result2[1].totalSum
  );
  return [first(result), last(result)];
}
export function getRecurringItems(resultObj: Report) {
  return Object.entries(resultObj)
    .flatMap((result) => result[1].transactions)
    .filter((trx) => trx.frequency === TrxFrequency.Recurring);
}
