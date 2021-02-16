import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import useIsLoading from "../lib/useIsLoading";
import { yupResolver } from "@hookform/resolvers/yup";
import { date, number, object, string, mixed } from "yup";
const signupSchema = object().shape({
  name: string().required("Name is required"),
  email: string().email().required("Email is required"),
  password: string().ensure().min(8,"Password must be at least 8 characters").required("Password is required"),
});

export default function Signup() {
  const [serverError, setServerError] = useState("")
 const {isLoading,setisLoading} = useIsLoading(false)
  const router = useRouter();
  const { register, handleSubmit, errors } = useForm({resolver: yupResolver(signupSchema)});
  async function onSubmit(data) {
    try {
      setisLoading(true)
      const res = await axios.post("/api/signup", data);
      if (res.status==201) {
        if(typeof window !== "undefined") {
          router.push("/");
          setisLoading(false)
        }
      }
    } catch (error) {
      if(error.response){
        setisLoading(false)
        setServerError("Invalid registration details please try again")
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
        {serverError&&<p className="mb-2 text-sm text-red-600 text-center" id="server-error">{serverError}</p>}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ref={register}
                />
              </div>
              {errors.name && (
                      <p className="mt-2 text-sm text-red-600" id="name-error">
                        {errors.name.message}
                      </p>
                    )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ref={register}
                />
              </div>
              {errors.email && (
                      <p className="mt-2 text-sm text-red-600" id="email-error">
                        {errors.email.message}
                      </p>
                    )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={"current-password"}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ref={register}
                />
              </div>
              {errors.password && (
                      <p className="mt-2 text-sm text-red-600" id="password-error">
                        {errors.password.message}
                      </p>
                    )}
            </div>
            <div className="relative">
            {isLoading&&<div className="absolute inset-0 bg-blue-100 opacity-25"></div>}
              <button
                type="submit"
                className="bg-blue-600 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
               {isLoading? "Loading..." :"Register"}
              </button>
            </div>
            <div className="flex items-center justify-end">
             
              <div className="text-sm">
              <small>Already registered? </small>
              <Link href="/login">
              <a
              className="text-blue-600 font-medium
              hover:text-blue-500 text-xs"
                >
                Login
                </a>
              </Link>
                
              </div>
            </div>
          </form>

          </div>
      </div>
    </div>
  );
}
