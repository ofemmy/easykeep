export default function getQueryOptions(options, additionalOptions = {}) {
  const { limit, skip } = options;

  return {
    take: limit,
    skip,
    orderBy: {
      date: "desc",
    },
    ...additionalOptions,
  };
}
