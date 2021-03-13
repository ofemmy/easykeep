import { useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import useIsLoading from "../lib/useIsLoading";
import useFormConfig from "../lib/useFormConfig";
export default function SignUp() {
  const { formComponent, initialValues, schema } = useFormConfig("signupForm");
  const { isLoading, setisLoading } = useIsLoading(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  async function signup(data) {
    try {
      setisLoading(true);
      const res = await axios.post("/api/signup", data);
      if (res.status == 201) {
        if (typeof window !== "undefined") {
          router.push("/");
          setisLoading(false);
        }
      }
    } catch (error) {
      if (error.response) {
        setisLoading(false);
        setServerError("Invalid registration details please try again");
      }
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          Sign up to get started
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-12 sm:px-0">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {serverError && (
            <p
              className="mb-2 text-sm text-red-600 text-center"
              id="server-error"
            >
              {serverError}
            </p>
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={signup}
            component={formComponent}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
