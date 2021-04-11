import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import useSettings from "./useSettings";
import { forOwn } from "lodash";
import { useFormik } from "formik";
import * as Yup from "yup";
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  type: Yup.string().required("Entry type is required"),
  budget: Yup.number().optional(),
  runningBudget: Yup.number().optional(),
  rollOver: Yup.boolean().optional(),
});
export default function useCategorySettings(initialValue = null) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const addCategoryMutation = useMutation(
    async (newCategory) => {
      const response = await axios.post("/api/category", newCategory);
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("category");
        toast({
          description: data.msg,
          status: data.status,
          duration: 2000,
          position: "top",
        });
      },
      onError: (error) => {
        toast({
          description: error["response"]["data"]["msg"],
          status: "error",
          duration: 2000,
          position: "top",
        });
      },
    }
  );
  const editCategoryMutation = useMutation(
    async (category: Category) => {
      const response = await axios.put("/api/category", category);
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("category");
        toast({
          description: data.msg,
          status: data.status,
          duration: 2000,
          position: "top",
        });
      },
      onError: (error) => {
        toast({
          description: error["response"]["data"]["msg"],
          status: "error",
          duration: 2000,
          position: "top",
        });
      },
    }
  );
  const removeCategoryMutation = useMutation(
    async (category: Category) => {
      const response = await axios.delete(`/api/category?id=${category.id}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("category");
        toast({
          description: data.msg,
          status: "success",
          duration: 2000,
          position: "top",
        });
      },
    }
  );
  const addNewCategory = (category) => {
    if (!category) return;
    addCategoryMutation.mutate(category);
  };
  const removeSelectedCategory = (category) => {
    if (!category) return;
    removeCategoryMutation.mutate(category);
  };
  const editCategory = (category) => {
    if (!category) return;
    editCategoryMutation.mutate(category);
  };
  const categoryForm = useFormik({
    initialValues: {
      title: "",
      type: "Expense",
      budget: 0,
      runningBudget: 0,
      rollOver: false,
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, actions) => {
      if (!values["id"]) {
        values.runningBudget = values.budget;
        addNewCategory(values);
      } else {
        editCategory(values);
      }
      actions.resetForm({
        values: initialValue,
      });
    },
  });
  const [selectedCategory, setCategory] = useState({
    title: "",
    trxType: "Income",
    budget: 0,
    rollOver: false,
  });

  const editSelectedCategory = (category) => {
    forOwn(category, (value, key) =>
      categoryForm.setFieldValue(key, value, false)
    );
  };

  return {
    categoryForm,
    selectedCategory,
    removeSelectedCategory,
    editSelectedCategory,
    setCategory,
    addNewCategory,
  };
}
