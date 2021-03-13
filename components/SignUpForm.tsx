import { useContext, useState } from "react";
import Link from "next/link";
import { MyAppContext } from "../store";
import currencies from "../currencies.json";
export default function SignUpForm({
  handleSubmit,
  handleChange,
  isLoading,
  errors,
  touched,
  setFieldValue,
}) {
  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit} noValidate={true}>
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
              onChange={handleChange}
            />
          </div>
          {touched.name && errors.name && (
            <p className="mt-2 text-sm text-red-600" id="name-error">
              {errors.name}
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
              onChange={handleChange}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {errors.email && touched.email && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.email}
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
              id="password1"
              name="password"
              type="password"
              onChange={handleChange}
              autoComplete={"current-password"}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {errors.password && touched.password && (
            <p className="mt-2 text-sm text-red-600" id="password-error">
              {errors.password}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="password2"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="password2"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              autoComplete={"current-password"}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="mt-2 text-sm text-red-600" id="password-error">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              Language
            </label>
            <div className="mt-1">
              <select
                id="language"
                name="language"
                className={`${
                  errors.language && touched.language
                    ? "border-red-600"
                    : "border-gray-300"
                } mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                onChange={handleChange}
              >
                <option defaultValue="default" disabled>
                  Select Language
                </option>
                <option value="english">English</option>
                <option value="deutsch">German</option>
              </select>
            </div>
          </div>
          <div className="">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Currency
            </label>
            <div className="mt-1">
              <select
                id="currency"
                name="currency"
                className={`${
                  errors.currency && touched.currency
                    ? "border-red-600"
                    : "border-gray-300"
                } mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                onChange={handleChange}
              >
                <option defaultValue="default" disabled>
                  Select Currency
                </option>
                {Object.entries(currencies).map((curr) => (
                  <option
                    value={curr[0]}
                    key={curr[0]}
                  >{`${curr[0]} (${curr[1]})`}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-blue-100 opacity-25"></div>
          )}
          <button
            type="submit"
            className="bg-blue-600 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Loading..." : "Register"}
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
  );
}
