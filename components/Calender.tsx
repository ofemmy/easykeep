import React, { useRef, useState } from "react";
import CalenderWidget from "./CalenderWidget";
import {
  getDaysInMonth,
  startOfMonth,
  getDay,
  getMonth,
  getYear,
  getDate,
  addMonths,
  isSameMonth,
  format,
} from "date-fns";
import { getDateWithoutTimeZone } from "../lib/useDate";
const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
interface OCalenderProps {
  CustomComponent?: React.FC<{}>;
  clickHandler: Function;
  toggleCalendar?: Function;
  date?: Date;
  field: string;
}
const OCalender: React.FC<OCalenderProps> = ({
  clickHandler,
  toggleCalendar,
  date,
  field,
}) => {
  const [calDate, setDate] = useState(date || new Date());
  const getFirstDay = (i: number) => {
    if (i === 1) {
      const firstDay = startOfMonth(calDate);
      return getDay(firstDay) + 1;
    }
  };
  const days = range(1, getDaysInMonth(calDate));
  const goNextMonth = () => {
    setDate(addMonths(calDate, 1));
  };
  const goPrevMonth = () => {
    setDate(addMonths(calDate, -1));
  };
  const getCurrentMonth = () => getMonth(calDate);
  const getCurrentYear = () => getYear(calDate);
  const setNewDate = (day) => {
    setDate(new Date(getYear(date), getMonth(calDate), day));
    toggleCalendar();
    let newDate = getDateWithoutTimeZone(
      new Date(getYear(calDate), getMonth(calDate), day)
    );
    clickHandler(field, newDate);
  };

  return (
    <CalenderWidget
      goNextMonth={goNextMonth}
      goPrevMonth={goPrevMonth}
      getFirstDay={getFirstDay}
      days={days}
      date={calDate}
      getCurrentMonth={getCurrentMonth}
      getCurrentYear={getCurrentYear}
      isSameMonth={isSameMonth}
      getDate={getDate}
      setDate={setNewDate}
    />
  );
};

export default OCalender;
