import React, { createContext, useState } from "react";
import { User } from "../db/models/User";
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
};
export const MyAppContext = createContext<MyAppContextType>(null);

export default function AppStore({ children }) {
  const [month, setMonth] = useState({ code: 0, name: "January" });
  const [user, setUser] = useState(null);
  const changeMonth = (newMonthCode) =>
    setMonth(Months.filter((mon) => mon.code === +newMonthCode)[0]);
  return (
    <MyAppContext.Provider value={{ month, changeMonth, user, setUser }}>
      {children}
    </MyAppContext.Provider>
  );
}

