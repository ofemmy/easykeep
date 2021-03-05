import React, { useState } from "react";

import {
    Wrapper,
    Header,
    ArrowBtn,
    WeekDaysBox,
    DateGrid,
    Day,
} from "./styled-components";
const months= [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
function CalendarWidget({
    goPrevMonth,
    goNextMonth,
    getFirstDay,
    days,
    date,
    getCurrentYear,
    getCurrentMonth,
    isSameMonth,
    getDate,
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
                            isSameMonth(date, new Date()) &&
                            getDate(date) === num
                        }
                        style={{ gridColumn: `${getFirstDay(num) || 0}` }}
                        onClick={()=>setDate(num)}
                    >
                        {num}
                    </Day>
                ))}
            </DateGrid>
        </Wrapper>
    );
}
export default CalendarWidget;
