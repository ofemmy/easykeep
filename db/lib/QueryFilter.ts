import mongoose from "mongoose";
export default function getQueryFilter(
  queryData,
  options: { withRecurringSum?: boolean } = {},
  additionalFilter={}
) {
  const { userID, month, trxType } = queryData;
  const { withRecurringSum = false } = options;
  const moreFilter = withRecurringSum
    ? { type: trxType, isRecurring: true }
    : { $or: [{ month }, { isRecurring: true }] };
  const ObjectId = mongoose.Types.ObjectId;
  const filter = {
    owner: ObjectId(userID),
    ...moreFilter,
    ...additionalFilter
  };
  return filter;
}
