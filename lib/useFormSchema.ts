import { TrxFrequency } from "@prisma/client";
import { date, number, object, string, mixed, ref } from "yup";
import { FormType } from "../types/FormName";
const normalEntrySchema = object().shape({
  title: string().required("Title is required"),
  type: mixed().required("A transaction type must be chosen"),
  amount: number().positive("Invalid amount").required("Amount is required"),
  category: string().required("Category is required"),
  entryDate: date().required("Date is required"),
});
const recurringEntrySchema = object().shape({
  title: string().required("Title is required"),
  type: mixed().required("A transaction type must be chosen"),
  amount: number().positive("Invalid amount").required("Amount is required"),
  category: string().required("Category is required"),
  entryDate: date().required("Date is required"),
  recurringFrom: date().required("Date is required"),
  recurringTo: date().required("Date is required"),
});
const loginFormSchema = object().shape({});
const signupSchema = object().shape({
  name: string().required("Name is required"),
  email: string().email().required("Email is required"),
  password: string()
    .ensure()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("password"), null], "Passwords do not match")
    .required("Please enter password again"),
  language: string(),
  currency: string(),
});
export default function useFormSchema(formName: FormType) {
  switch (formName) {
    case "loginForm":
      return loginFormSchema;
    case "normalEntryForm":
      return normalEntrySchema;
    case "signupForm":
      return signupSchema;
    case "recurringEntryForm":
      return recurringEntrySchema;
    default:
      break;
  }
}
