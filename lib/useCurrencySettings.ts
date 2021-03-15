import { useState } from "react";
import useSettings from "./useSettings";
export default function useCurrencySettings(initialValue) {
  const { mutation } = useSettings("currency");
  const [currency, setCurrency] = useState(initialValue);
  const changeCurrency = () => {
    if (currency) {
      mutation.mutate({
        newData: currency,
        action: "change",
      });
    }
  };
  return { currency, setCurrency, changeCurrency };
}
