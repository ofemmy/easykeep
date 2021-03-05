import { TrxFrequency } from "@prisma/client";
import { date, number, object, string, mixed } from "yup";
const normalEntrySchema = object().shape({
  title: string().required("Title is required"),
  type: mixed().required("A transaction type must be chosen"),
  amount: number()
    .integer()
    .positive("Invalid amount")
    .required("Amount is required"),
  category: string().required("Category is required"),
  entryDate: date().required("Date is required"),
});
const recurringEntrySchema = object().shape({
  title: string().required("Title is required"),
  type: mixed().required("A transaction type must be chosen"),
  amount: number()
    .integer()
    .positive("Invalid amount")
    .required("Amount is required"),
  category: string().required("Category is required"),
  entryDate: date().required("Date is required"),
  recurringFrom: date().required("Date is required"),
  recurringTo: date().required("Date is required"),
});
export default function useFormSchema(name: TrxFrequency) {
  if (name == TrxFrequency.Once) {
    return normalEntrySchema;
  } else {
    return recurringEntrySchema;
  }
}
