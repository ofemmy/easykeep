import React, { useEffect, useContext, useState, Component } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { MyAppContext } from "../../store";
import { Formik } from "formik";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@chakra-ui/react";
import useFormConfig from "../../lib/useFormConfig";

const RecurringEntry = ({ user }) => {
  const {
    setUser,
    month,
    setSidebarOpen,
    isLoading,
    setisLoading,
  } = useContext(MyAppContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { formComponent, initialValues, schema } = useFormConfig(
    "recurringEntryForm"
  );

  useEffect(() => {
    if (router.isReady && router.query.id) {
      setIsEditMode(true);
    }
  }, [isEditMode]);
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data: any) => {
      if (isEditMode) {
        await axios.put("/api/transactions", data);
      } else {
        await axios.post("/api/transactions", data);
      }
    },
    {
      onMutate: () => setisLoading(true),
      onSuccess: (responseData) => {
        //Reset form state
        setisLoading(false);
        isEditMode ? router.push("/") : null;
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
      onError: () => setisLoading(false),
    }
  );
  return (
    <main
      className="flex-1 relative z-0 overflow-y-auto focus:outline-none px-0 md:px-0"
      tabIndex={0}
    >
      <div className="max-w-xl mx-auto md:mt-4">
        <div className="flex flex-col bg-white shadow-xl overflow-y-scroll rounded-sm">
          <div className="px-4 py-6 bg-primary-light sm:px-6 text-white">
            <div className="flex items-start justify-between space-x-3">
              <div className="space-y-2">
                <h2 id="slide-over-heading" className="text-lg font-medium ">
                  New Recurring Transaction
                </h2>
                <div className="flex items-center">
                  <button
                    type="button"
                    className="inline-flex items-center px-1.5 py-1 border border-transparent text-xs rounded text-gray-700 bg-gray-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold"
                    onClick={() => {
                      router.push("/new");
                    }}
                  >
                    Click here to add non-recurring transaction
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="px-4 sm:px-6">
              <Formik
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={(values, actions) => {
                  mutation.mutate(values);
                  actions.resetForm({});
                }}
                component={formComponent}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RecurringEntry;

export const getServerSideProps = withPageAuthRequired();
