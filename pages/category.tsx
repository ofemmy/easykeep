import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Switch } from "@headlessui/react";
const categories = [
  {
    title: "Clothing",
    trxType: "Expense",
    budget: 2000,
    runningBudget: 1300,
    rollOver: true,
  },
  {
    title: "Food",
    trxType: "Expense",
    budget: 3500,
    runningBudget: 1500,
    rollOver: true,
  },
  {
    title: "Utilities",
    trxType: "Expense",
    budget: 2500,
    runningBudget: 900,
    rollOver: true,
  },
  {
    title: "Salaries",
    trxType: "Income",
    budget: null,
    runningBudget: null,
    rollOver: null,
  },
  {
    title: "Gifts",
    trxType: "Income",
    budget: null,
    runningBudget: null,
    rollOver: null,
  },
  {
    title: "Insurances",
    trxType: "Expense",
    budget: 1000,
    runningBudget: 650,
    rollOver: true,
  },
];
export default function Category() {
  const [switchValue, setSwitchValue] = useState(false);
  const [trxType1, setTrxType1] = useState("Income");
  const [trxType2, setTrxType2] = useState("Income");
  return (
    <div className="p-8 grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <div className="flex">
          {["Income", "Expense"].map((option) => (
            <div className="flex items-center mr-4">
              <input
                id={option}
                name="entry_type"
                type="radio"
                value={option}
                onChange={(e) => setTrxType1(e.target.value)}
                checked={trxType1 === option}
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
              .filter((cat) => cat.trxType === trxType1)
              .map((category) => (
                <AccordionItem>
                  <h2 className="">
                    <AccordionButton
                      _focus={{ outline: "none" }}
                      color="#4b5563"
                      py={4}
                      _expanded={{ bg: "#374151", color: "white" }}
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

                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        Edit
                      </button>
                    </div>
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
      <div className="rounded-md bg-white shadow-sm px-6 py-8">
        <div className="flex flex-col space-y-4">
          <div className="flex">
            {["Income", "Expense"].map((option) => (
              <div className="flex items-center mr-4">
                <input
                  id={option}
                  name="trx_type"
                  type="radio"
                  value={option}
                  onChange={(e) => setTrxType2(e.target.value)}
                  checked={trxType2 === option}
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
                name="new-category"
                id="new-category"
                placeholder="Category Name"
                className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
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
                <span className="text-gray-500 sm:text-sm">EUR</span>
              </div>
              <input
                type="text"
                name="budget_amount"
                id="budget_amount"
                className="shadow-sm focus:ring-yellow-500 block w-full pl-12 pr-12 sm:text-sm focus:border-yellow-500 border-gray-300 rounded-md"
                placeholder="0.00"
                aria-describedby="budget_amount"
              />
            </div>
          </div>
          <div>
            <Switch.Group as="div" className="flex items-center space-x-4">
              <Switch.Label className="text-sm">
                Rollover unused budget to next month
              </Switch.Label>
              <Switch
                as="button"
                checked={switchValue}
                onChange={setSwitchValue}
                className={`${
                  switchValue ? "bg-yellow-600" : "bg-gray-200"
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
            type="button"
            className="inline-flex mt-4 items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 uppercase"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
}
// function RadioGroup({
//   options,
//   orientation = "horizontal",
//   name,
//   changeHandler,
// }: {
//   options: string[];
//   changeHandler: any;
//   name: string;
//   orientation: "horizontal" | "vertical";
// }) {
//   return (
//     <div className={`flex ${orientation === "vertical" ? "flex-col" : ""}`}>
//       {options.map((option) => (
//         <div className="flex items-center mr-4">
//           <input
//             id={option}
//             name={name}
//             type="radio"
//             value={option}
//             onChange={changeHandler}
//             checked={checkedCondition}
//             className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-yellow-300"
//           />
//           <label
//             htmlFor={option}
//             className="ml-3 block text-sm font-medium text-gray-700"
//           >
//             {option}
//           </label>
//         </div>
//       ))}
//     </div>
//   );
// }
