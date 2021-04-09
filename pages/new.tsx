import { TrxFrequency } from ".prisma/client";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/dist/frontend";
import { useQueryClient } from "react-query";
import { DateTime } from "luxon";
import Header from "../components/Header";
import usePageLink from "../lib/usePageLinks";
import { NonRecurringFormView } from "views/NonRecurringFormView";
import { RecurringFormView } from "views/RecurringFormView";
import { useLocalStorage } from "../lib/useLocalStorage";

export default withPageAuthRequired(function New() {
  const router = useRouter();
  const { value: trxToEdit } = useLocalStorage("trxToEdit", null);
  const trxId = router.query?.id as string;
  let data = null;
  if (trxId) {
    data = trxToEdit?.id === parseInt(trxId) ? trxToEdit : null;
  }
  if (data) {
    data.entryDate = data.entryDate && DateTime.fromISO(data.entryDate);
    data.recurringFrom =
      data.recurringFrom && DateTime.fromISO(data.recurringFrom);
    data.recurringTo = data.recurringTo && DateTime.fromISO(data.recurringTo);
  }
  const { pageLinks, activeLink, setActiveLink } = usePageLink(
    Object.keys(TrxFrequency),
    data?.frequency || TrxFrequency.Once
  );
  const ActivePage = ({ activeLink, data }) => {
    if (activeLink == TrxFrequency.Once)
      return <NonRecurringFormView data={data} />;
    if (activeLink == TrxFrequency.Recurring)
      return <RecurringFormView data={data} />;
  };
  return (
    <>
      <Header pageTitle="Add New Entry" />
      <div className="max-6xl mx-auto border-t border-gray-200 h-full pb-16">
        <div className="mt-4 px-4 sm:px-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full focus:ring-indigo-500 focus:border-gray-500 border-gray-300 rounded-md p-2"
            >
              <option selected>Non-recurring Entry</option>
              <option>Recurring Entry</option>
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
                  <span>
                    {link === TrxFrequency.Once
                      ? "Non-Recurring".toUpperCase()
                      : link.toUpperCase()}
                  </span>
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
          <div className="max-w-xl mx-auto mt-8 shadow-lg bg-white">
            <ActivePage activeLink={activeLink} data={data} />
          </div>
        </div>
      </div>
    </>
  );
});
