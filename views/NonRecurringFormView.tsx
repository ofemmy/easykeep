import useFormConfig from "lib/useFormConfig";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { DateTime } from "luxon";
import { useLocalStorage } from "../lib/useLocalStorage";
import { TrxFrequency } from "@prisma/client";
export function NonRecurringFormView({ data }) {
  const queryClient = useQueryClient();
  const { removeValue } = useLocalStorage("trxToEdit", null);
  const toast = useToast();
  const router = useRouter();
  let initialTrxData = null;
  if (data) {
    initialTrxData = data.frequency === TrxFrequency.Recurring ? data : null;
  }
  const mutation = useMutation(
    async (data: any) => {
      if (data.id) {
        await axios.put("/api/transactions", data);
      } else {
        await axios.post("/api/transactions", data);
      }
    },
    {
      onSuccess: (responseData) => {
        toast({
          title: "Success.",
          description: "Transaction saved successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
        queryClient.invalidateQueries("transactions");
      },
    }
  );
  const { formComponent, initialValues, schema } = useFormConfig(
    "normalEntryForm"
  );
  const removeFromLocalStorage = () => {
    removeValue("trxToEdit");
  };
  return (
    <main
      className="flex-1 relative z-0 overflow-y-auto focus:outline-none px-0 md:px-0"
      tabIndex={0}
    >
      <div className="mx-auto">
        <div className="flex flex-col overflow-y-scroll rounded-sm">
          <div className="px-4 py-6 bg-primary-light sm:px-6 text-white">
            <div className="flex items-start justify-between space-x-3">
              <div className="space-y-2">
                <h2 id="slide-over-heading" className="text-lg font-medium ">
                  Add New Non-Recurring Entry
                </h2>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="px-4 sm:px-6">
              <Formik
                initialValues={initialTrxData || initialValues}
                validationSchema={schema}
                onSubmit={(values, actions) => {
                  mutation.mutate(values);
                  actions.resetForm();
                  removeFromLocalStorage();
                }}
                component={formComponent}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
