import { capitalize } from "lodash";
import React, { useContext, useState } from "react";
import DeleteSVG from "../components/DeleteSVG";
import Header from "../components/Header";
import EditSVG from "../components/svgs/EditSVG";
import axios from "axios";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { MyAppContext } from "../store";
import { useToast } from "@chakra-ui/react";
const CategoryComponent = ({ data }) => {
  // const { categories, addCategory } = useContext(MyAppContext);
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState("");
  const toast = useToast();
  const mutation = useMutation(
    async ({ newCategory, action }: any) => {
      const response = await axios.patch("/api/profile?type=categories", {
        payload: { newCategory },
        action,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast({
          description: data.msg,
          status: "success",
          duration: 2000,
          position: "top",
        });
      },
      onMutate: async ({ newCategory }) => {
        await queryClient.cancelQueries("profile");
        const previousProfile = (await queryClient.getQueryData(
          "profile"
        )) as any;
        queryClient.setQueryData("profile", (old: any) => {
          const oldCat = previousProfile.profile.categories;
          oldCat.push(newCategory);
          return old;
        });
        return { previousProfile };
      },
      onError: (err, newProfile, context: any) => {
        queryClient.setQueryData("profile", context.previousProfile);
      },
      onSettled: () => {
        queryClient.invalidateQueries("profile");
      },
    }
  );
  const addNewCategory = () => {
    if (category) {
      mutation.mutate({ newCategory: category, action: "add" });
    }
  };
  const deleteCategory = (category) => {
    mutation.mutate({ newCategory: category, action: "delete" });
  };
  // const setEditMode = (category) => {
  //   setIsEditMode(true);
  //   setCategory(category);
  // };
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
              Add New Category
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
const Comp2 = ({ data }) => <p>Comp2</p>;

export default withPageAuthRequired(function Settings() {
  const { language, currency } = useContext(MyAppContext);
  const pageLinks = ["category", "language", "currency"];
  const [activeLink, setActiveLink] = useState("category");
  const ActivePage = ({ activeLink, data }) => {
    if (activeLink == "category") return <CategoryComponent data={data} />;
    if (activeLink == "language") return <Comp2 data={data} />;
  };
  const fetchUserProfile = async () => {
    const response = await axios.get("/api/profile");
    return response.data;
  };
  const { data, isLoading, isError, error } = useQuery(
    "profile",
    fetchUserProfile,
    { refetchOnWindowFocus: false }
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
              {<ActivePage activeLink={activeLink} data={profile} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
