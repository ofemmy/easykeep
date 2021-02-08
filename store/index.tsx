import React, { createContext, useState } from "react";
type MyAppContextType = {
  month: number;
  setMonth: Function;
  user: { name: string };
  setUser:Function
};
export const MyAppContext = createContext<MyAppContextType>(null);

export default function AppStore({ children }) {
  const [month, setMonth] = useState(0);
  const [user,setUser] = useState({name:"Test User"});
  return (
    <MyAppContext.Provider value={{ month, setMonth,user,setUser }}>
      {children}
    </MyAppContext.Provider>
  );
}
