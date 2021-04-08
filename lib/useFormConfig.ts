import { TrxFrequency, TransactionType } from "@prisma/client";
import useFormSchema from "./useFormSchema";
import NormalEntryForm from "../components/NormalEntryForm";
import RecurringEntryForm from "../components/RecurringEntryForm";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import { DateTime } from "luxon";
import { FormType } from "../types/FormName";
export default function useFormConfig(formName: FormType) {
  const today = DateTime.utc();
  const schema = useFormSchema(formName);
  let formComponent, initialValues;
  switch (formName) {
    case "normalEntryForm":
      formComponent = NormalEntryForm;
      initialValues = {
        title: "",
        type: TransactionType.Income,
        amount: "",
        frequency: TrxFrequency.Once,
        entryDate: today,
        categoryId: "",
      };
      break;
    case "recurringEntryForm":
      formComponent = RecurringEntryForm;
      initialValues = {
        title: "",
        type: TransactionType.Income,
        amount: "",
        frequency: TrxFrequency.Recurring,
        entryDate: today,
        categoryId: "",
        recurringFrom: today,
        recurringTo: today.plus({ months: 12 }),
      };
    case "loginForm":
      break;
    case "signupForm":
      formComponent = SignUpForm;
      initialValues = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        language: "",
        currency: "",
      };
      break;
    default:
      break;
  }
  return { schema, formComponent, initialValues };
}
