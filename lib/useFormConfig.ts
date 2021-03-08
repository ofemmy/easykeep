import { TrxFrequency, TransactionType } from "@prisma/client";
import useFormSchema from "./useFormSchema";
import NormalEntryForm from "../components/NormalEntryForm";
import RecurringEntryForm from "../components/RecurringEntryForm";
import { addMonths } from "date-fns";
import { getDateWithoutTimeZone } from "./useDate";
import { DateTime } from "luxon";
export default function useFormConfig(formType: TrxFrequency) {
  const today = DateTime.utc();
  const schema = useFormSchema(formType);
  let formComponent, initialValues;
  if (formType == TrxFrequency.Once) {
    formComponent = NormalEntryForm;
    initialValues = {
      title: "",
      type: "" as TransactionType,
      amount: "",
      frequency: TrxFrequency.Once,
      entryDate: today,
      category: "",
    };
  } else {
    formComponent = RecurringEntryForm;
    initialValues = {
      title: "",
      type: "" as TransactionType,
      amount: "",
      frequency: TrxFrequency.Recurring,
      entryDate: today,
      category: "",
      recurringFrom: today,
      recurringTo: today.plus({ months: 12 }),
    };
  }
  return { schema, formComponent, initialValues };
}
