import { TransactionType } from "@prisma/client";
import React from "react";
import formatNumberToCurrency from "../lib/formatCurrency";


const AmountComponent = ({ value, obj }) => {
  const col = obj.type === TransactionType.Expense ? "red" : "green";
  return (
    <>
      <span className={`text-${col}-500 font-medium`}>
        {formatNumberToCurrency(value, "EUR")}
      </span>
    </>
  );
};

export default AmountComponent;
