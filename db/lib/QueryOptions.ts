export default function getQueryOptions(options, additionalOptions = {}) {
  const { limit, skip } = options;

  return {
    limit,
    skip,
    sort: { $natural: -1 },
    ...additionalOptions,
  };
}
