import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useUser } from "@auth0/nextjs-auth0";
export function useCategory() {
  const fetchCategories = async () => {
    const response = await axios.get("api/category");
    return response.data;
  };
  const { data, isLoading, isError, error } = useQuery(
    "category",
    fetchCategories,
    { staleTime: 1000 * 60 * 30 }
  );
  return { result: data, isLoading, isError, error };
}
