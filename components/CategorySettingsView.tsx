import { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Switch } from "@headlessui/react";
import useCategorySettings from "../lib/useCategorySettings";
import { useCategory } from "../lib/useCategory";

export default function CategorySettingsView({ data }) {
  const {
    removeSelectedCategory,
    editSelectedCategory,
    categoryForm,
  } = useCategorySettings();

  const [trxType, setTrxType] = useState("Expense");
  const [mode, setMode] = useState("add");
  const { categories: result, isLoading, isError, error } = useCategory();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>{error}</div>;
  }
  const { data: categories } = result;
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="flex">
          {["Income", "Expense"].map((option) => (
            <div className="flex items-center mr-4">
              <input
                id={option}
                name="entry_type"
                type="radio"
                value={option}
                onChange={(e) => setTrxType(e.target.value)}
                checked={trxType === option}
                className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-yellow-300"
              />
              <label
                htmlFor={option}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Accordion defaultIndex={[0]}>
            {categories
              .filter((cat) => cat.type === trxType)
              .map((category) => (
                <AccordionItem>
                  <h2 className="">
                    <AccordionButton
                      _focus={{ outline: "none" }}
                      color="#4b5563"
                      py={4}
                      _expanded={{ bg: "#407cca", color: "white" }}
                    >
                      <div className="flex-1 flex items-center min-w-0 justify-between">
                        <p>{category.title}</p>
                      </div>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel bgColor="gray.50">
                    <div className="flex items-center mt-2">
                      <dl className="flex flex-1 items-center">
                        <dt className="text-sm font-medium text-gray-500">
                          Monthly Budget
                        </dt>
                        <dd className="ml-10 text-sm text-gray-600">
                          {category.budget ? `${category.budget}$` : "N/A"}
                        </dd>
                      </dl>
                      <div className="flex">
                        <button
                          onClick={() => {
                            setMode("edit");
                            editSelectedCategory(category);
                          }}
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeSelectedCategory(category)}
                          type="button"
                          className="inline-flex ml-4 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
      <div className="rounded-md bg-white shadow-sm px-6 py-8">
        <form
          className="flex flex-col space-y-4"
          onSubmit={categoryForm.handleSubmit}
        >
          <div>
            <div className="flex">
              {["Income", "Expense"].map((option) => (
                <div className="flex items-center mr-4" key={option}>
                  <input
                    id={option}
                    name="type"
                    type="radio"
                    checked={categoryForm.values.type == option}
                    defaultChecked={categoryForm.values.type == option}
                    value={option}
                    onChange={categoryForm.handleChange}
                    onBlur={categoryForm.handleBlur}
                    className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-yellow-300"
                  />
                  <label
                    htmlFor={option}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {categoryForm.touched.type && categoryForm.errors.type ? (
              <p className="mt-2 text-sm text-red-600">
                {categoryForm.errors.type}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="new-category"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="title"
                id="title"
                onChange={categoryForm.handleChange}
                onBlur={categoryForm.handleBlur}
                value={categoryForm.values.title}
                placeholder="Category Name"
                className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            {categoryForm.touched.title && categoryForm.errors.title ? (
              <p className="mt-2 text-sm text-red-600">
                {categoryForm.errors.title}
              </p>
            ) : null}
          </div>
          <div>
            <div className="flex justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Monthly Budget
              </label>
              <span className="text-sm text-yellow-500" id="email-optional">
                Optional
              </span>
            </div>
            <div className="mt-1 relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {data.currency}
                </span>
              </div>
              <input
                type="text"
                name="budget"
                id="budget"
                onChange={categoryForm.handleChange}
                onBlur={categoryForm.handleBlur}
                value={categoryForm.values.budget}
                className="shadow-sm focus:ring-yellow-500 block w-full pl-12 pr-12 sm:text-sm focus:border-yellow-500 border-gray-300 rounded-md"
                placeholder="0.00"
                aria-describedby="budget"
              />
            </div>
            {categoryForm.touched.budget && categoryForm.errors.budget ? (
              <p className="mt-2 text-sm text-red-600">
                {categoryForm.errors.budget}
              </p>
            ) : null}
          </div>
          <div>
            <Switch.Group as="div" className="flex items-center space-x-4">
              <Switch.Label className="text-sm">
                Rollover unused budget to next month
              </Switch.Label>
              <Switch
                name="rollOver"
                as="button"
                checked={categoryForm.values.rollOver}
                onChange={() =>
                  categoryForm.setFieldValue(
                    "rollOver",
                    !categoryForm.values.rollOver,
                    false
                  )
                }
                className={`${
                  categoryForm.values.rollOver ? "bg-yellow-600" : "bg-gray-200"
                } relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline`}
              >
                {({ checked }) => (
                  <span
                    className={`${
                      checked ? "translate-x-5" : "translate-x-0"
                    } inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full`}
                  />
                )}
              </Switch>
            </Switch.Group>
          </div>
          <button
            type="submit"
            onClick={() => setMode("add")}
            className="inline-flex mt-4 items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-light hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 uppercase"
          >
            {mode === "add" ? "Add Category" : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
