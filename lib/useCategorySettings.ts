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
  const dummyData = [
    {
      id: 1,
      title: "Clothing",
      type: "Expense",
      budget: 2000,
      runningBudget: 1300,
      rollOver: true,
    },
    {
      id: 2,
      title: "Food",
      type: "Expense",
      budget: 3500,
      runningBudget: 1500,
      rollOver: true,
    },
    {
      id: 3,
      title: "Utilities",
      type: "Expense",
      budget: 2500,
      runningBudget: 900,
      rollOver: true,
    },
    {
      id: 4,
      title: "Salaries",
      type: "Income",
      budget: null,
      runningBudget: null,
      rollOver: null,
    },
    {
      id: 5,
      title: "Gifts",
      type: "Income",
      budget: null,
      runningBudget: null,
      rollOver: null,
    },
    {
      id: 6,
      title: "Insurances",
      type: "Expense",
      budget: 1000,
      runningBudget: 650,
      rollOver: true,
    },
  ];
  const categoryForm = useFormik({
    initialValues: {
      title: "",
      type: "Expense",
      budget: 0,
      runningBudget: 0,
      rollOver: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => console.log("submitted", values),
  });
  const [categories, _] = useState(dummyData);
  const [selectedCategory, setCategory] = useState({
    title: "",
    trxType: "Income",
    budget: 0,
    rollOver: false,
  });
  const { mutation } = useSettings("categories");
  const addNewCategory = (category) => {
    if (category) {
      mutation.mutate({ newData: category, action: "add", type: "categories" });
    }
  };
  const editSelectedCategory = (category) => {
    forOwn(category, (value, key) =>
      categoryForm.setFieldValue(key, value, false)
    );
    console.log(category);
  };
  const deleteCategory = (category) => {
    mutation.mutate({
      newData: category,
      action: "delete",
    });
  };
  return {
    categories,
    categoryForm,
    selectedCategory,
    editSelectedCategory,
    setCategory,
    addNewCategory,
    deleteCategory,
  };
}
