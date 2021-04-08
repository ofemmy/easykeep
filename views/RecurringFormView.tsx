import useFormConfig from "lib/useFormConfig";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@chakra-ui/react";
import { TrxFrequency } from "@prisma/client";
import axios from "axios";
export function RecurringFormView(data) {
  const queryClient = useQueryClient();
  const toast = useToast();
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
  const router = useRouter();
  const { formComponent, initialValues, schema } = useFormConfig(
    "recurringEntryForm"
  );
  return (
    <main
      className="flex-1 relative z-0 overflow-y-auto focus:outline-none px-0 md:px-0"
      tabIndex={0}
    >
      <div className="max-w-xl mx-auto mb-16">
        <div className="flex flex-col bg-white shadow-xl overflow-y-scroll rounded-sm">
          <div className="px-4 py-6 bg-primary-light sm:px-6 text-white">
            <div className="flex items-start justify-between space-x-3">
              <div className="space-y-2">
                <h2 id="slide-over-heading" className="text-lg font-medium ">
                  Add New Recurring Entry
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
                  console.log(values);
                  mutation.mutate(values);
                  actions.resetForm(initialValues);
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
