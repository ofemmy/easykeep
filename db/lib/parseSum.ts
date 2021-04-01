import { camelCase } from "lodash";
export function parseSum({
  data,
  key,
  resultKeys,
}: {
  data: [];
  key: string;
  resultKeys: string[];
}) {
  let result = resultKeys.reduce((acc, curr) => ((acc[curr] = 0), acc), {});
  if (data.length == 0) {
    return result;
  }
  const d = {};
  data.forEach((obj) => {
    return (d[camelCase(`total ${obj[key]}`)] = obj["sum"]);
  });
  result = { ...result, ...d };
  return result;
}
