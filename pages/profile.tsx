import { useState } from "react";
import axios from "axios";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Banner from "../components/Banner";
import Header from "../components/Header";
import currencies from "../currencies.json";
export default function Profile({ user }) {
  const [currency, setCurrency] = useState("");
  const [language, setLanguage] = useState("english");
  const router = useRouter();
  const onSubmit = async () => {
    if (!currency || !language) {
      return;
    }
    try {
      const response = await axios.post("/api/profile", {
        currency,
        language,
        ownerId: user.sub,
      });
      if (response.status == 201 && typeof window !== "undefined") {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-6xl mx-auto border-t border-gray-200">
      <Header pageTitle={"Profile"} />
      <Banner color="red" message="Please verify your email address" />
      <div className="flex items-center justify-center">
        <div
          className="mt-32 px-10 flex items-center justify-center space-y-6 flex-col
      rounded-md shadow-sm bg-white py-12 sm:px-6 lg:px-8"
        >
          <div className="w-5/12">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Set Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              id="location"
              name="location"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="english">English</option>
              <option value="german">German</option>
            </select>
          </div>
          <div className="w-5/12 mt-4">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Set Currency
            </label>
            <div className="mt-1">
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
          </div>
          <button
            type="submit"
            onClick={onSubmit}
            className="bg-gray-600 w-5/12 mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Set Profile
          </button>
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps = withPageAuthRequired();
