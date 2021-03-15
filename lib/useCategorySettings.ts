import { useState } from "react";
import useSettings from "./useSettings";
export default function useCategorySettings(initialValue) {
  const [category, setCategory] = useState(initialValue);
  const { mutation } = useSettings("categories");
  const addNewCategory = () => {
    if (category) {
      mutation.mutate({ newData: category, action: "add", type: "categories" });
    }
  };
  const deleteCategory = (category) => {
    mutation.mutate({
      newData: category,
      action: "delete",
    });
  };
  return { category, setCategory, addNewCategory, deleteCategory };
}
