import { mapKeys, camelCase } from "lodash";
export default function mapToTransactionModel(obj) {
  //map amount from string to numberFormat
  //obj.amount = Number(obj.amount);
  //map dates from string to date
  //obj.entry_date = new Date(obj.entry_date);
  //obj.recurring_from = obj.recurring_from ? new Date(obj.recurring_from) : null;
  //obj.recurring_to = obj.recurring_to ? new Date(obj.recurring_to) : null;
  //map snake case props to camel case
  return mapKeys(obj, function (value, key) {
    return camelCase(key);
  });
}
function mapAmountToNumber(obj) {
  obj.amount = Number(obj.amount);
  return obj;
}
