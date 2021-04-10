import { useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/dist/frontend";
import RecurringEntryForm from "@/components/RecurringEntryForm";
import Header from "@/components/Header";
import { Modal } from "@/components/Modal";
import { Toast } from "@/components/Toast";
import { useLocalStorage } from "lib/useLocalStorage";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { TransactionType } from ".prisma/client";
import usePageLink from "lib/usePageLinks";
import axios from "axios";
import useFormConfig from "lib/useFormConfig";
import CashSVG from "../../components/svgs/CashSVG";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { DateTime } from "luxon";
import Link from "next/link";
import { Formik } from "formik";
function EditForm({ onClose, initData }) {
  initData.entryDate =
    initData.entryDate && DateTime.fromISO(initData.entryDate);
  initData.recurringFrom =
    initData.recurringFrom && DateTime.fromISO(initData.recurringFrom);
  initData.recurringTo =
    initData.recurringTo && DateTime.fromISO(initData.recurringTo);

  const { initialValues, schema } = useFormConfig("recurringEntryForm");
  const queryClient = useQueryClient();
  const toast = useToast();
  const mutation = useMutation(
    async (data: any) => {
      return await axios.put("/api/transactions", data);
    },
    {
      onSuccess: (responseData) => {
        toast({
          duration: 3000,
          position: "top",
          render: () => (
            <Toast status="success" message="Entry saved successfully." />
          ),
        });
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("recurrings");
      },
    }
  );
  return (
    <>
      <div className="px-4 py-6 bg-primary-light sm:px-6 text-white">
        <h2 id="slide-over-heading" className="text-lg font-medium ">
          Edit Recurring Entry
        </h2>
      </div>
      <div className="px-4">
        <Formik
          component={(props) => (
            <RecurringEntryForm
              {...props}
              closeHandler={onClose}
              editMode={true}
            />
          )}
          initialValues={initData || initialValues}
          validationSchema={schema}
          onSubmit={(values) => {
            mutation.mutate(values);
            onClose();
          }}
        />
      </div>
    </>
  );
}

const fetchRecurringEntries = async (config) => {
  const { activeLink } = config;
  const res = await axios.get(
    `/api/transactions/recurrings/?type=${activeLink}`
  );
  return res.data;
};

export default withPageAuthRequired(function Recurrings() {
  const { pageLinks, activeLink, setActiveLink } = usePageLink(
    Object.keys(TransactionType),
    TransactionType.Expense
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setValue: setTrxToEdit } = useLocalStorage("trxToEdit", null);
  const trxRef = useRef(null);
  const openModal = (currentTrx) => {
    trxRef.current = currentTrx;
    onOpen();
  };
  const { data: queryResponse, isLoading, isError, error } = useQuery(
    ["recurrings", activeLink],
    () =>
      fetchRecurringEntries({
        activeLink,
      }),
    { staleTime: 1000 * 60 * 30 }
  );
  if (isLoading) {
    return <span>Loading....</span>;
  }
  if (isError) {
    return <span>Error: {error}</span>;
  }
  const { data } = queryResponse;

  return (
    <>
      <Header pageTitle="Recurring Entries" />
      {isOpen ? (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          Component={() => (
            <EditForm onClose={onClose} initData={trxRef.current} />
          )}
        />
      ) : null}
      <div className="max-6xl mx-auto border-t border-gray-200 h-full pb-16">
        <div className="mt-4 px-4 sm:px-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full focus:ring-secondary-500 focus:border-gray-500 border-gray-300 rounded-md p-2"
            >
              {pageLinks.map((link) => (
                <option value={link} key={link}>
                  {link}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav
              className="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
              aria-label="Tabs"
            >
              {pageLinks.map((link, i) => (
                <a
                  href="#"
                  aria-current={activeLink === link}
                  key={link}
                  onClick={() => setActiveLink(link)}
                  className={`${
                    activeLink === link ? "text-secondary bg-white" : ""
                  }  group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10`}
                >
                  <span>{link.toUpperCase()}</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      activeLink === link ? "bg-yellow-500" : "bg-transparent"
                    } absolute inset-x-0 bottom-0 h-0.5`}
                  ></span>
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-8">
            <div className="shadow sm:hidden">
              <ul className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden rounded-lg">
                {data.map((trx) => (
                  <li>
                    <Link href={`/new?id=${trx.id}`}>
                      <a
                        onClick={() => setTrxToEdit(trx)}
                        className="block px-4 py-4 bg-white hover:bg-gray-50"
                      >
                        <span className="flex items-center space-x-4">
                          <span className="flex-1 flex space-x-2 truncate">
                            <CashSVG customClasses="text-gray-500" />
                            <span className="flex flex-col text-gray-500 text-sm truncate">
                              <span className="truncate">{trx.title}</span>
                              <span className="text-gray-900 font-medium">
                                ${trx.amount}
                              </span>
                              <span>
                                <time dateTime={trx.recurringFrom}>
                                  {DateTime.fromISO(
                                    trx.recurringFrom
                                  ).toLocaleString(DateTime.DATE_FULL)}
                                </time>
                                {" - "}
                                <time dateTime={trx.recurringTo}>
                                  {DateTime.fromISO(
                                    trx.recurringTo
                                  ).toLocaleString(DateTime.DATE_FULL)}
                                </time>
                              </span>
                            </span>
                          </span>

                          <div className="flex">
                            <button
                              onClick={() => {}}
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              Stop
                            </button>
                            <button
                              onClick={() => {}}
                              type="button"
                              className="inline-flex ml-2 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden sm:block">
              <div className="max-w-6xl mx-auto px-2">
                <div className="flex flex-col mt-2">
                  <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 w-full bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            from - to
                          </th>
                          <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>

                          <th className="hidden px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:block">
                            Category
                          </th>

                          <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((trx) => (
                          <tr className="bg-white group">
                            <td className="max-w-0 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex">
                                <Link href={`/new?id=${trx.id}`}>
                                  <a
                                    onClick={() => setTrxToEdit(trx)}
                                    className="group inline-flex space-x-2 truncate text-sm"
                                  >
                                    <CashSVG customClasses="text-gray-500 group-hover:text-secondary" />
                                    <p className="text-gray-500 truncate group-hover:text-secondary">
                                      {trx.title}
                                    </p>
                                  </a>
                                </Link>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                              <div className="flex">
                                <time dateTime={trx.recurringFrom}>
                                  {DateTime.fromISO(
                                    trx.recurringFrom
                                  ).toLocaleString(DateTime.DATE_FULL)}
                                </time>
                                {" - "}
                                <time dateTime={trx.recurringTo}>
                                  {DateTime.fromISO(
                                    trx.recurringTo
                                  ).toLocaleString(DateTime.DATE_FULL)}
                                </time>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-gray-500">
                              <span className="text-gray-900 font-medium">
                                ${trx.amount}
                              </span>
                            </td>

                            <td className="hidden px-6 py-4 whitespace-nowrap text-sm text-white md:block">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary  capitalize">
                                {trx.category.title}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
                              <div className="flex justify-end">
                                <button
                                  onClick={() => openModal(trx)}
                                  type="button"
                                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {}}
                                  type="button"
                                  className="inline-flex ml-2 items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
