import React, { createContext, useState } from "react";
import { User } from "../db/models/User";
import useIsLoading from "../lib/useIsLoading";
import HomeSVG from "../components/svgs/HomeSVG";
import ScaleSVG from "../components/svgs/ScaleSVG";
import CardSVG from "../components/svgs/CardSVG";
import Currency from "../types/Currency";
import AddSVG from "../components/svgs/AddSVG";
import { DateTime } from "luxon";
import DocumentSVG from "../components/svgs/DocumentSVG";
export const Months = [
  { code: 1, name: "January" },
  { code: 2, name: "February" },
  { code: 3, name: "March" },
  { code: 4, name: "April" },
  { code: 5, name: "May" },
  { code: 6, name: "June" },
  { code: 7, name: "July" },
  { code: 8, name: "August" },
  { code: 9, name: "September" },
  { code: 10, name: "October" },
  { code: 11, name: "November" },
  { code: 12, name: "December" },
];
const AppMainLinks = {
  home: {
    href: "/",
    name: "Home",
    icon: <HomeSVG customClasses="mr-4" />,
    color: "",
  },
  new: {
    href: "/new",
    name: "New",
    color: "",
    icon: <AddSVG customClasses="mr-4" />,
  },
  incomes: {
    href: "/transactions/income",
    name: "Incomes",
    icon: <ScaleSVG customClasses="mr-4" />,
    color: "#03c048",
  },
  expenses: {
    href: "/transactions/expense",
    name: "Expenses",
    color: "hsl(0, 100%, 50%)",
    icon: <CardSVG customClasses="mr-4" />,
  },
  report: {
    href: "/report",
    name: "Report",
    color: "",
    icon: <DocumentSVG customClasses="mr-4" />,
  },
};
type MyAppContextType = {
  month: { code: number; name: string };
  language: string;
  setLanguage: Function;
  changeMonth: Function;
  user: User;
  setUser: Function;
  currency: Currency;
  isSidebarOpen: boolean;
  setSidebarOpen: Function;
  setisLoading: Function;
  isLoading: boolean;
  AppMainLinks: {
    [link: string]: {
      href: string;
      name: string;
      icon?: JSX.Element;
      color: string;
    };
  };
};
export const MyAppContext = createContext<MyAppContextType>(null);

export default function AppStore({ children }) {
  const currentMonth = Months.find(
    (m) => m.code == DateTime.now().get("month")
  );
  const [month, setMonth] = useState(currentMonth);
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState(Currency.EUR);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState("English");
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
        language,
        setLanguage,
        currency,
        isSidebarOpen,
        setSidebarOpen,
        isLoading,
        setisLoading,
        AppMainLinks,
      }}
    >
      {children}
    </MyAppContext.Provider>
  );
}
