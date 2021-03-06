import { CheckSVG } from "./svgs/CheckSVG";
import ErrorSVG from "./svgs/ErrorSVG";

export function Toast({ status, message }) {
  const Icon = ({ status }) => {
    return status === "success" ? <CheckSVG /> : <ErrorSVG />;
  };
  const statusColor = status === "success" ? "green" : "red";
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon status={status} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p
              className={`text-sm font-medium text-${statusColor}-900 uppercase`}
            >
              {status}
            </p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Close</span>

              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    // <div
    //   className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    // >
    //   <div className="flex">
    //     <div className="flex-shrink-0">
    //       <Icon status={status} />
    //     </div>
    //     <div className="ml-3">
    //       <p className={`text-sm font-medium text-${statusColor}-800`}>
    //         {message}
    //       </p>
    //     </div>
    //     <div className="ml-auto pl-3">
    //       <div className="-mx-1.5 -my-1.5">
    //         <button
    //           type="button"
    //           className={`inline-flex bg-${statusColor}-50 rounded-md p-1.5 text-${statusColor}-500 hover:bg-${statusColor}-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${statusColor}-50 focus:ring-${statusColor}-600"`}
    //         >
    //           <span className="sr-only">Dismiss</span>

    //           <svg
    //             className="h-5 w-5"
    //             xmlns="http://www.w3.org/2000/svg"
    //             viewBox="0 0 20 20"
    //             fill="currentColor"
    //             aria-hidden="true"
    //           >
    //             <path
    //               fill-rule="evenodd"
    //               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
    //               clip-rule="evenodd"
    //             />
    //           </svg>
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
