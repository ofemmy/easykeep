import { capitalize } from "lodash";
import React, { useContext, useState } from "react";
import DeleteSVG from "../components/DeleteSVG";
import Header from "../components/Header";
import EditSVG from "../components/svgs/EditSVG";

import { MyAppContext } from "../store";
const CategoryComponent = () => {
  const { categories, addCategory } = useContext(MyAppContext);
  const [category, setCategory] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState("");
  const setEditMode = (category) => {
    setIsEditMode(true);
    setCategory(category);
  };
  return (
    <div className="overflow-y-auto">
      <div className="flex justify-between">
        <ul className=" flex-1 bg-white rounded-sm shadow-sm">
          {categories.map((category) => (
            <li
              onMouseEnter={() => {
                setHoveredCategory(category);
              }}
              onMouseLeave={() => {
                setHoveredCategory("");
              }}
              className="py-4 px-4 hover:bg-yellow-100 odd:bg-yellow-50 flex justify-between items-center"
            >
              <p>{capitalize(category)}</p>
              <div
                className={`${
                  hoveredCategory == category ? "flex" : "hidden"
                } space-x-2`}
              >
                <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <DeleteSVG />
                </button>
                <button
                  onClick={() => setEditMode(category)}
                  className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <EditSVG />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="bg-white rounded-md shadow-sm ml-8 w-5/12 h-52 py-8 px-4">
          <div>
            <label
              htmlFor="new-category"
              className="block text-sm font-medium text-gray-700"
            >
              {isEditMode ? "Update Category" : "Add New Category"}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="new-category"
                id="new-category"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <button
                onClick={() => addCategory(category)}
                type="button"
                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {isEditMode ? "Update" : "Add New Category"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Comp2 = () => <p>Comp2</p>;
export default function Settings() {
  const { language, currency } = useContext(MyAppContext);
  const pageLinks = ["category", "language", "currency"];
  const [activeLink, setActiveLink] = useState("category");
  const ActivePage = ({ activeLink }) => {
    if (activeLink == "category") return <CategoryComponent />;
    if (activeLink == "language") return <Comp2 />;
  };
  return (
    <div className="max-6xl mx-auto border-t border-gray-200">
      <Header pageTitle={"Settings"} />
      <div className="px-4 sm:px-6 md:px-0">
        <div className="py-6">
          <div className="sm:hidden">
            <label htmlFor="selected-tab" className="sr-only">
              Select a tab
            </label>
            <select
              name="selected-tab"
              id="selected-tab"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-gray-900 sm:text-sm rounded-md"
            >
              {pageLinks.map((link) => (
                <option value={link}>{capitalize(link)}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block px-10">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {pageLinks.map((link, i) => (
                  <button
                    onClick={() => setActiveLink(link)}
                    className={`${
                      activeLink == link
                        ? "border-yellow-500 text-yellow-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      i == 0 ? "ml-0" : "ml-8"
                    }`}
                  >
                    {capitalize(link)}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-10">
              {<ActivePage activeLink={activeLink} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
