export function TrendingSVG({ customClasses = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 ${customClasses}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );
}
