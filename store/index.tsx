import React, { createContext, useState } from "react";
import { User } from "../db/models/User";
import Currency from "../types/Currency";
export const Months = [
  { code: 0, name: "January" },
  { code: 1, name: "February" },
  { code: 2, name: "March" },
  { code: 3, name: "April" },
  { code: 4, name: "May" },
  { code: 5, name: "June" },
  { code: 6, name: "July" },
  { code: 7, name: "August" },
  { code: 8, name: "September" },
  { code: 9, name: "October" },
  { code: 10, name: "November" },
  { code: 11, name: "December" },
];
type MyAppContextType = {
  month: { code: number; name: string };
  changeMonth: Function;
  user: User;
  setUser: Function;
  currency:Currency;
};
export const MyAppContext = createContext<MyAppContextType>(null);

export default function AppStore({ children }) {
  const currentMonth = Months.find(m=>m.code==new Date().getMonth())
  const [month, setMonth] = useState(currentMonth);
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState(Currency.EUR)
  const changeMonth = (newMonthCode) =>
    setMonth(Months.filter((mon) => mon.code === +newMonthCode)[0]);
  return (
    <MyAppContext.Provider value={{ month, changeMonth, user, setUser,currency }}>
      {children}
    </MyAppContext.Provider>
  );
}
