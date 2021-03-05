import { TrxFrequency, TransactionType } from "@prisma/client";
import useFormSchema from "./useFormSchema";
import NormalEntryForm from "../components/NormalEntryForm";
import RecurringEntryForm from "../components/RecurringEntryForm";
import { addMonths } from "date-fns";
import { getDateWithoutTimeZone } from "./useDate";
export default function useFormConfig(formType: TrxFrequency) {
  const schema = useFormSchema(formType);
  let formComponent, initialValues;
  if (formType == TrxFrequency.Once) {
    formComponent = NormalEntryForm;
    initialValues = {
      title: "",
      type: "" as TransactionType,
      amount: "",
      frequency: TrxFrequency.Once,
      entryDate: getDateWithoutTimeZone(new Date()),
      category: "",
    };
  } else {
    formComponent = RecurringEntryForm;
    initialValues = {
      title: "",
      type: "" as TransactionType,
      amount: "",
      frequency: TrxFrequency.Recurring,
      entryDate: getDateWithoutTimeZone(new Date()),
      category: "",
      recurringFrom: getDateWithoutTimeZone(new Date()),
      recurringTo: getDateWithoutTimeZone(addMonths(new Date(), 12)),
    };
  }
  return { schema, formComponent, initialValues };
}
