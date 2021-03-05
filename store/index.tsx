import React, { createContext, useState } from "react";
import { User } from "../db/models/User";
import useIsLoading from "../lib/useIsLoading";
import HomeSVG from "../components/svgs/HomeSVG";
import ScaleSVG from "../components/svgs/ScaleSVG";
import CardSVG from "../components/svgs/CardSVG";
import Currency from "../types/Currency";
import DocumentSVG from "../components/svgs/DocumentSVG";
import AddSVG from "../components/svgs/AddSVG";
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
const AppMainLinks = {
  home: { href: "/", name: "Home", icon: <HomeSVG customClasses="mr-4" /> },
  new: {
    href: "/new2?type=once",
    name: "New",
    icon: <AddSVG customClasses="mr-4" />,
  },
  incomes: {
    href: "/transactions/income",
    name: "Incomes",
    icon: <ScaleSVG customClasses="mr-4" />,
  },
  expenses: {
    href: "/transactions/expense",
    name: "Expenses",
    icon: <CardSVG customClasses="mr-4" />,
  },  
};
type MyAppContextType = {
  month: { code: number; name: string };
  changeMonth: Function;
  user: User;
  setUser: Function;
  currency: Currency;
  isSidebarOpen: boolean;
  setSidebarOpen: Function;
  setisLoading: Function;
  isLoading: boolean;
  AppMainLinks: {
    [link: string]: { href: string; name: string; icon?: JSX.Element };
  };
};
export const MyAppContext = createContext<MyAppContextType>(null);

export default function AppStore({ children }) {
  const currentMonth = Months.find((m) => m.code == new Date().getMonth());
  const [month, setMonth] = useState(currentMonth);
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState(Currency.EUR);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading, setisLoading } = useIsLoading(false);
  const changeMonth = (newMonthCode) => {
    setMonth(Months.filter((mon) => mon.code === +newMonthCode)[0]);
  };
  return (
    <MyAppContext.Provider
      value={{
        month,
        changeMonth,
        user,
        setUser,
        currency,
        isSidebarOpen,
        setSidebarOpen,
        isLoading,
        setisLoading,
        AppMainLinks
      }}
    >
      {children}
    </MyAppContext.Provider>
  );
}
