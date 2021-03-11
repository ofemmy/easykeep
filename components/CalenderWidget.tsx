import React, { useState } from "react";
import {DateTime} from "luxon"
import {
  Wrapper,
  Header,
  ArrowBtn,
  WeekDaysBox,
  DateGrid,
  Day,
} from "./styled-components";
const months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};
function CalendarWidget({
  goPrevMonth,
  goNextMonth,
  getFirstDay,
  days,
  date,
  getCurrentYear,
  getCurrentMonth,
  isSameMonth,
  setDate,
}) {
  return (
    <Wrapper>
      <Header>
        <ArrowBtn onClick={goPrevMonth}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 25 25"
            stroke="currentColor"
            width="15px"
            height="15px"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </ArrowBtn>
        <h3>
          {months[getCurrentMonth()]},{getCurrentYear()}
        </h3>
        <ArrowBtn onClick={goNextMonth}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 25 25"
            stroke="currentColor"
            width="15px"
            height="15px"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </ArrowBtn>
      </Header>
      <WeekDaysBox>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </WeekDaysBox>
      <DateGrid>
        {days.map((num) => (
          <Day
            key={num}
            active={
                isSameMonth() &&
                date.get('day') === num
            }
            style={{ gridColumn: `${getFirstDay(num) || 0}` }}
            onClick={() => setDate(num)}
          >
            {num}
          </Day>
        ))}
      </DateGrid>
    </Wrapper>
  );
}
export default CalendarWidget;
