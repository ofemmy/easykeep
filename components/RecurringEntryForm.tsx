import React, { useState, useEffect } from "react";
import { Router, useRouter } from "next/router";
import { TransactionType } from "@prisma/client";
import CalenderSVG from "./svgs/CalenderSVG";
import { DateTime } from "luxon";
import Calender from "./Calender";
import { useDisclosure } from "@chakra-ui/react";
import useProfile from "../lib/useProfile";
import { useCategory } from "../lib/useCategory";

const RecurringEntryForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  touched,
  setFieldValue,
  editMode = false,
  closeHandler = null,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen: isCalFromOpen, onToggle: onCalFromToggle } = useDisclosure();
  const { isOpen: isCalToOpen, onToggle: onCalToToggle } = useDisclosure();
  const { isOpen, onToggle } = useDisclosure();
  const handleClose = closeHandler
    ? closeHandler
    : () => {
        router.back();
      };
  const {
    result,
    isLoading: isCategoriesLoading,
    isError,
    error,
  } = useCategory();
  if (isCategoriesLoading) {
    return <span>Loading....</span>;
  }
  if (isError) {
    return <span>Error: {error}</span>;
  }
  const { data: categories } = result;
  return (
    <form className="space-y-6 pt-6 pb-5" onSubmit={handleSubmit}>
      <div className="">
        <div className="space-x-4 flex">
          <div className="flex items-center">
            <input
              id="income"
              name="type"
              type="radio"
              className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300"
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
              className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300"
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
            value={values.title}
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
              onClick={onToggle}
              value={values.entryDate.toISODate()}
              onChange={handleChange}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={onToggle}
            >
              <span className="text-gray-500 hover:text-blue-500 sm:text-sm cursor-pointer">
                <CalenderSVG customClasses="cursor-pointer" />
              </span>
            </div>
          </div>
          {isOpen && (
            <div className="absolute z-30 mt-2">
              <Calender
                date={values.entryDate}
                clickHandler={setFieldValue}
                toggleCalendar={onToggle}
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
        <label
          htmlFor="recurringFrom"
          className="block text-sm font-medium text-gray-700"
        >
          Start date
        </label>
        <div className="flex items-center">
          <div className="mt-1 relative rounded-md shadow-sm border ">
            <input
              id="recurringFrom"
              type="text"
              name="recurringFrom"
              placeholder="DD.MM.YYYY"
              className={`${
                errors.recurringFrom ? "border-red-600" : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500 block w-full pl-2 pr-12 sm:text-sm  rounded-sm`}
              onClick={onCalFromToggle}
              value={values.recurringFrom.toISODate()}
              onChange={handleChange}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={onCalFromToggle}
            >
              <span className="text-gray-500 hover:text-blue-500 sm:text-sm cursor-pointer">
                <CalenderSVG customClasses="cursor-pointer" />
              </span>
            </div>
          </div>
          {/* <div className="flex-1 flex items-center ml-4">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember_me"
              className="ml-2 block text-sm text-gray-900"
            >
              No End Date
            </label>
          </div> */}
        </div>

        {isCalFromOpen && (
          <div className="absolute z-30 mt-2">
            <Calender
              date={values.recurringFrom}
              clickHandler={setFieldValue}
              toggleCalendar={onCalFromToggle}
              field="recurringFrom"
            />
          </div>
        )}
        {errors.recurringFrom && (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            Please enter valid date
          </p>
        )}
      </div>

      <div className="">
        <label
          htmlFor="recurringTo"
          className="block text-sm font-medium text-gray-700"
        >
          End date
        </label>
        <div className="flex mt-1 items-center">
          <div className="relative rounded-md shadow-sm border ">
            <input
              id="recurringTo"
              type="text"
              name="recurringTo"
              placeholder="DD.MM.YYYY"
              className={`${
                errors.recurringTo ? "border-red-600" : "border-gray-300"
              } focus:ring-blue-500 focus:border-blue-500 block w-full pl-2 pr-12 sm:text-sm  rounded-sm`}
              onClick={onCalToToggle}
              value={values.recurringTo.toISODate()}
              onChange={handleChange}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={onCalToToggle}
            >
              <span className="text-gray-500 hover:text-blue-500 sm:text-sm cursor-pointer">
                <CalenderSVG customClasses="cursor-pointer" />
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-center ml-4">
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() =>
                setFieldValue(
                  "recurringTo",
                  values.recurringFrom.plus({ months: 6 })
                )
              }
            >
              in 6 months
            </button>
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-2"
              onClick={() =>
                setFieldValue(
                  "recurringTo",
                  values.recurringFrom.plus({ months: 12 })
                )
              }
            >
              in 1 year
            </button>
          </div>
        </div>

        {isCalToOpen && (
          <div className="absolute z-30 mt-2">
            <Calender
              date={values.recurringTo}
              clickHandler={setFieldValue}
              toggleCalendar={onCalToToggle}
              field="recurringTo"
            />
          </div>
        )}
        {errors.recurringTo && (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            Please enter valid date
          </p>
        )}
      </div>
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
            name="categoryId"
            className={`${
              errors.categoryId && touched.categoryId
                ? "border-red-600"
                : "border-gray-300"
            } mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-sm`}
            value={values.categoryId}
            defaultValue={values.categoryId || "default"}
            onChange={handleChange}
          >
            <option value="default">Select Category</option>
            {categories
              .filter((cat) => cat.type === values.type)
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
          </select>
        </div>
        {errors.categoryId && touched.categoryId ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            Please select a category
          </p>
        ) : null}
      </div>
      <div className="flex-shrink-0 px-4 py-4 flex justify-end">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleClose}
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
            {editMode ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RecurringEntryForm;
