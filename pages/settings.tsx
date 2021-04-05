import { capitalize } from "lodash";
import React, { useContext, useState } from "react";
import DeleteSVG from "../components/DeleteSVG";
import Header from "../components/Header";
import currencies from "../currencies.json";
import axios from "axios";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useQuery } from "react-query";
import useLanguageSettings from "../lib/useLanguageSettings";
import useCategorySettings from "../lib/useCategorySettings";
import usePageLinks from "../lib/usePageLinks";
import useCurrencySettings from "../lib/useCurrencySettings";
import CategorySettingsView from "../components/CategorySettingsView";

const CategoryComponent = ({ data }) => {
  const [hoveredCategory, setHoveredCategory] = useState("");
  const {
    category,
    setCategory,
    addNewCategory,
    deleteCategory,
  } = useCategorySettings("");

  return (
    <div className="overflow-y-auto">
      <div className="flex justify-between">
        <ul className=" flex-1 bg-white rounded-sm shadow-sm">
          {data.categories.length > 0 ? (
            data.categories.map((category) => (
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
                  <button
                    onClick={() => deleteCategory(category)}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <DeleteSVG />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="py-4 px-4 hover:bg-yellow-100 odd:bg-yellow-50 flex justify-between items-center">
              No category yet
            </li>
          )}
        </ul>
        <div className="bg-white rounded-md shadow-sm ml-8 w-5/12 h-52 py-8 px-4">
          <div>
            <label
              htmlFor="new-category"
              className="block text-sm font-medium text-gray-700"
            >
              Add new category
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
                onClick={addNewCategory}
                type="button"
                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Add New Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const LanguageComponent = ({ data }) => {
  const { language, setLanguage, changeLanguage } = useLanguageSettings(
    data.language
  );

  return (
    <div className="overflow-y-auto h-screen px-2">
      <div className="space-y-4">
        <div>
          <span>Your current language setting is</span>
          <span className="uppercase ml-4 p-2 bg-yellow-200 rounded-sm text-yellow-900">
            {data.language}
          </span>
        </div>
        <div className="w-5/12">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Change Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            id="location"
            name="location"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="english">English (en-US)</option>
            <option value="german">German (de-DE)</option>
          </select>
        </div>
        <button
          onClick={changeLanguage}
          type="button"
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Set new language
        </button>
      </div>
    </div>
  );
};
const CurrencyComponent = ({ data }) => {
  const { currency, setCurrency, changeCurrency } = useCurrencySettings(
    data.currency
  );

  return (
    <div className="overflow-y-auto h-screen px-2">
      <div className="space-y-4">
        <div>
          <span>Your current currency setting is</span>
          <span className="uppercase ml-4 p-2 bg-yellow-200 rounded-sm text-yellow-900">
            {data.currency}
          </span>
        </div>
        <div className="w-5/12">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Change currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            id="currency"
            name="currency"
            className="border-gray-300
                mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option defaultValue="default" disabled>
              Select Currency
            </option>
            {Object.entries(currencies).map((curr) => (
              <option
                value={curr[0]}
                key={curr[0]}
              >{`${curr[0]} (${curr[1]})`}</option>
            ))}
          </select>
        </div>
        <button
          onClick={changeCurrency}
          type="button"
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Set new currency
        </button>
      </div>
    </div>
  );
};
export default withPageAuthRequired(function Settings() {
  const { pageLinks, activeLink, setActiveLink } = usePageLinks(
    ["category", "language", "currency"],
    "category"
  );

  const ActivePage = ({ activeLink, data }) => {
    if (activeLink == "category") return <CategorySettingsView data={data}/>;
    if (activeLink == "language") return <LanguageComponent data={data} />;
    if (activeLink == "currency") return <CurrencyComponent data={data} />;
  };

  const { language, setLanguage, changeLanguage } = useLanguageSettings("");
  const { currency, setCurrency, changeCurrency } = useCurrencySettings("");
  const {
    category,
    setCategory,
    addNewCategory,
    deleteCategory,
  } = useCategorySettings("");
  const fetchUserProfile = async () => {
    const response = await axios.get("/api/profile");
    return response.data;
  };
  const { data, isLoading, isError, error } = useQuery(
    "profile",
    fetchUserProfile
  );
  if (isLoading) {
    return <span>Loading....</span>;
  }
  if (isError) {
    return <span>Error: {error}</span>;
  }
  const { profile } = data;

  return (
    <div className="max-6xl mx-auto border-t border-gray-200">
      <Header pageTitle="Settings" />
      <div className="px-4 sm:px-6 md:px-0">
        <div className="py-6">
          <div className="sm:hidden">
            <div className="space-y-10">
              <div>
                <p>
                  Your current currency setting is{" "}
                  <span className="uppercase ml-4 p-2 bg-yellow-200 rounded-sm text-yellow-900">
                    {profile.currency}
                  </span>
                </p>
                <div className="mt-4">
                  <div className="">
                    <label htmlFor="currency" className="sr-only">
                      Change currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="border-gray-300
                mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option defaultValue="default" disabled>
                        Select Currency
                      </option>
                      {Object.entries(currencies).map((curr) => (
                        <option
                          value={curr[0]}
                          key={curr[0]}
                        >{`${curr[0]} (${curr[1]})`}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={changeCurrency}
                    type="button"
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Change Currency
                  </button>
                </div>
              </div>
              <div>
                <p>
                  Your current language is{" "}
                  <span className="uppercase ml-4 p-2 bg-blue-200 rounded-sm text-blue-900">
                    {profile.language}
                  </span>
                </p>
                <div className="mt-4">
                  <div className="">
                    <label htmlFor="language" className="sr-only">
                      Change language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      id="language"
                      name="language"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="english">English (en-US)</option>
                      <option value="german">German (de-DE)</option>
                    </select>
                  </div>
                  <button
                    onClick={changeLanguage}
                    type="button"
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Change Language
                  </button>
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="new-category" className="sr-only">
                    Add new category
                  </label>
                  <div className="mt-2 flex">
                    <input
                      type="text"
                      name="new-category"
                      id="new-category"
                      placeholder="Enter new category"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 sm:text-sm border-gray-300 rounded-md"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                    <button
                      onClick={addNewCategory}
                      type="button"
                      className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Add New Category
                    </button>
                  </div>
                </div>
                <ul className="bg-white rounded-sm shadow-sm mt-8">
                  {profile.categories.length > 0 ? (
                    profile.categories.map((category) => (
                      <li className="py-4 px-4 hover:bg-yellow-100 odd:bg-yellow-50 flex justify-between items-center">
                        <p>{capitalize(category)}</p>
                        <div>
                          <button
                            onClick={() => deleteCategory(category)}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <DeleteSVG />
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-4 px-4 hover:bg-yellow-100 odd:bg-yellow-50 flex justify-between items-center">
                      No category yet
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="hidden sm:block px-10">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {pageLinks.map((link, i) => (
                  <button
                    type="button"
                    key={link}
                    onClick={() => setActiveLink(link)}
                    className={`${
                      activeLink == link
                        ? "border-yellow-500 text-yellow-600"
                        : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }  whitespace-nowrap border-transparent py-4 px-1 border-b-2 font-medium text-sm ${
                      i == 0 ? "ml-0" : "ml-8"
                    }`}
                  >
                    {link.toUpperCase()}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-8">
              {<ActivePage activeLink={activeLink} data={profile} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
