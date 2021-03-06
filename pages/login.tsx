import {useState} from "react"
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import useIsLoading from "../lib/useIsLoading"
import { object, string } from "yup";

const loginSchema = object().shape({
  email: string().email().required("Email is required."),
  password: string().required("Password is required."),
});

export default function Login() {
  const [serverError, setServerError] = useState("")
  const router = useRouter();
  const{isLoading, setisLoading} = useIsLoading(false)
  const { register, handleSubmit, errors } = useForm({resolver: yupResolver(loginSchema)});
  async function onSubmit(data) {
    try {
      setisLoading(true)
      const res = await axios.post("/api/login", data);
      if (res.status==200) {
        if(typeof window !== "undefined") {
          router.push("/");
          setisLoading(false)
        }
      }
    } catch (error) {
      if(error.response){
        setisLoading(false)
        setServerError("Invalid email/password.")
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
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full px-12 sm:max-w-md sm:px-0">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-6">
        {serverError&&<p className="mb-2 text-sm text-red-600 text-center" id="server-error">{serverError}</p>}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                 {isLoading? "Loading..." :"Log in"}
              </button>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-sm">
              <small>Not yet registered? </small>
              <Link href="/signup">
              <a
                  className="font-medium text-blue-600 hover:text-blue-500 text-xs"
                >
                 Sign up
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
