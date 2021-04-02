import React, { useRef, useState } from "react";
import CalenderWidget from "./CalenderWidget";
import { DateTime } from "luxon";
import { useDisclosure } from "@chakra-ui/react";
const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
interface OCalenderProps {
  CustomComponent?: React.FC<{}>;
  clickHandler: Function;
  toggleCalendar?: Function;
  date?: DateTime;
  field: string;
}
const OCalender: React.FC<OCalenderProps> = ({
  clickHandler,
  toggleCalendar,
  date,
  field,
}) => {
  let today = DateTime.utc().set({ hour: 12, minute: 0, second: 0 });
  const [calDate, setCalDate] = useState(date || today);
  const getFirstDay = (i: number) => {
    if (i === 1) {
      const firstDay = calDate.startOf("month");
      return firstDay.get("day") + 1;
    }
  };
  const days = range(1, calDate.daysInMonth);
  const goNextMonth = () => {
    let newMonth = calDate.plus({ month: 1 });
    setCalDate(newMonth);
  };
  const goPrevMonth = () => {
    let newMonth = calDate.plus({ month: -1 });
    setCalDate(newMonth);
  };
  const getCurrentMonth = () => calDate.get("month");
  const getCurrentYear = () => calDate.get("year");
  const setNewDate = (day: number) => {
    const newDate = calDate.set({
      year: getCurrentYear(),
      month: getCurrentMonth(),
      day,
      hour: 12,
      minute: 0,
      second: 0,
    });
    setCalDate(newDate);
    toggleCalendar();
    clickHandler(field, newDate);
  };
  const isSameMonth = () => calDate.hasSame(DateTime.utc(), "month");

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
      setDate={setNewDate}
    />
  );
};

export default OCalender;
