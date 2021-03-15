import { TransactionType } from "@prisma/client";
import React from "react";
import formatNumberToCurrency from "../lib/formatCurrency";
import useProfile from "../lib/useProfile";

const AmountComponent = ({ value, obj }) => {
  const {
    userProfile,
    isProfileLoading,
    isProfileError,
    profileError,
  } = useProfile();
  if (isProfileLoading) {
    return <span>Loading....</span>;
  }
  if (isProfileError) {
    return <span>Error: {profileError}</span>;
  }

  const { currency } = userProfile.profile;
  const col = obj.type === TransactionType.Expense ? "red" : "green";
  return (
    <>
      <span className={`text-${col}-500 font-medium`}>
        {formatNumberToCurrency(value, currency)}
      </span>
    </>
  );
};

export default AmountComponent;
