import React from "react";
import formatNumberToCurrency from "../lib/formatCurrency";
import TransactionType from "../types/TransactionType";

const AmountComponent = ({ value, obj }) => {
  const col = obj.type === TransactionType.EXPENSE ? "red" : "green";
  return (
    <>
      <span className={`text-${col}-500 font-medium`}>
        {formatNumberToCurrency(value, "EUR")}
      </span>
    </>
  );
};

export default AmountComponent;
