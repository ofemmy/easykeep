import React, { useState, useEffect } from "react";
import { TransactionType } from "@prisma/client";
import CalenderSVG from "./svgs/CalenderSVG";
import Calender from "./Calender";
import { Category } from "../types/Category";
const NewEntryForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  touched,
  setFieldValue,
}) => {
  const [showCal, setShowCal] = useState(false);
  const [showCalIsRecurringFrom, setShowCalIsRecurringFrom] = useState(false);
  const [showCalIsRecurringTo, setShowCalIsRecurringTo] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const categories = Object.keys(Category).sort((a, b) => a.localeCompare(b));
  const toggleCalendar = () => {
    setShowCal(!showCal);
  };
  const toggleCalendarFrom = () => {
    setShowCalIsRecurringFrom(!showCalIsRecurringFrom);
  };
  const toggleCalendarTo = () => {
    setShowCalIsRecurringTo(!showCalIsRecurringTo);
  };
  useEffect(() => {}, [isRecurring]);
  return (
    <form className="space-y-6 pt-6 pb-5" onSubmit={handleSubmit}>
      <div className="">
        <div className="space-x-4 flex">
          <div className="flex items-center">
            <input
              id="income"
              name="type"
              type="radio"
              className="focus:ring-blue-500 h-4 w-4 text-gray-600 border-gray-300"
              checked={TransactionType.Income === values.type}
              value="Income"
              onChange={handleChange}
            />
            <label
              htmlFor="income"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Income
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="expense"
              name="type"
              type="radio"
              className="focus:ring-blue-500 h-4 w-4 text-gray-600 border-gray-300"
              checked={TransactionType.Expense === values.type}
              value="Expense"
              onChange={handleChange}
            />
            <label
              htmlFor="expense"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Expense
            </label>
          </div>
        </div>
        {errors.type && touched.type ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {errors.type}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            onBlur={handleBlur}
            className={`${
              errors.title && touched.title
                ? "border-red-600"
                : "border-gray-300"
            } block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500  rounded-sm`}
            onChange={handleChange}
          />
        </div>
        {errors.title && touched.title ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {errors.title}
          </p>
        ) : null}
      </div>
      <div className="flex justify-between">
        <div className="w-5/12">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              value={values.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${
                errors.amount && touched.amount
                  ? "border-red-600"
                  : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm  rounded-sm`}
              placeholder="0.00"
              aria-describedby="transaction_amount-currency"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span
                className="text-gray-500 sm:text-sm"
                id="transaction_amount-currency"
              >
                EUR
              </span>
            </div>
          </div>
          {errors.amount && touched.amount ? (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              Please enter a valid amount
            </p>
          ) : null}
        </div>
        <div className="w-5/12 relative">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="entryDate"
              placeholder="DD.MM.YYYY"
              className={`${
                errors.entryDate ? "border-red-600" : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500 block w-full pl-2 pr-12 sm:text-sm  rounded-sm`}
              onClick={toggleCalendar}
              value={values.entryDate.toLocaleDateString()}
              onChange={handleChange}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={toggleCalendar}
            >
              <span className="text-gray-500 hover:text-blue-500 sm:text-sm cursor-pointer">
                <CalenderSVG customClasses="cursor-pointer" />
              </span>
            </div>
          </div>
          {showCal && (
            <div className="absolute z-30 mt-2">
              <Calender
                date={values.entryDate}
                clickHandler={setFieldValue}
                toggleCalendar={toggleCalendar}
                field="entryDate"
              />
            </div>
          )}
          {errors.entryDate && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              Please enter valid date
            </p>
          )}
        </div>
      </div>
      <div className="">
        <label htmlFor="" className="block text-sm font-medium text-gray-700">
          Frequency
        </label>
        <div className="mt-1 space-x-6 flex">
          <div className="flex items-center">
            <input
              id="single"
              name="frequency"
              type="radio"
              className="focus:ring-blue-500 h-4 w-4 text-gray-600 border-gray-300"
              checked={"oneTime" === values.frequency}
              value="oneTime"
              onChange={handleChange}
              onClick={() => setIsRecurring(false)}
            />
            <label
              htmlFor="income"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              One-time Entry
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="expense"
              name="frequency"
              type="radio"
              className="focus:ring-blue-500 h-4 w-4 text-gray-600 border-gray-300"
              checked={"recurring" === values.frequency}
              value="Recurring"
              onChange={handleChange}
              onClick={() => setIsRecurring(true)}
            />
            <label
              htmlFor="expense"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Recurring Entry
            </label>
          </div>
        </div>
        {errors.type && touched.type ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {errors.frequency}
          </p>
        ) : null}
      </div>
      {isRecurring && (
        <div className="">
          <label
            htmlFor="recurrenceDuration"
            className="block text-sm font-medium text-gray-700"
          >
            Recurrence Duration (in months)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm w-5/12">
            <input
              type="number"
              name="recurrenceDuration"
              id="recurrenceDuration"
              value={values.recurrenceDuration}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${
                errors.recurrenceDuration && touched.recurrenceDuration
                  ? "border-red-600"
                  : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm  rounded-sm`}
              aria-describedby="transaction_recurrence_duration"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span
                className="text-gray-500 sm:text-sm"
                id="transaction_recurrence_duration"
              >
                Months
              </span>
            </div>
          </div>
          {errors.recurrenceDuration && touched.recurrenceDuration ? (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.recurrenceDuration}
            </p>
          ) : null}
        </div>
      )}
      <div className="">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <div className="mt-1">
          <select
            id="category"
            name="category"
            className={`${
              errors.category && touched.category
                ? "border-red-600"
                : "border-gray-300"
            } mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-sm`}
            value={values.category}
            onChange={handleChange}
          >
            <option defaultValue="default" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} defaultValue={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {errors.category && touched.category ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            Please select a category
          </p>
        ) : null}
      </div>
      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-blue-100 opacity-25"></div>
          )}
          <button
            type="submit"
            className={`ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              isLoading ? "bg-primary-light" : "bg-primary-light"
            } hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewEntryForm;
