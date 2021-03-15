import { useState } from "react";
import useSettings from "./useSettings";
export default function useLanguage(initialValue) {
  const [language, setLanguage] = useState(initialValue);
  const { mutation } = useSettings("language");
  const changeLanguage = () => {
    if (language) {
      mutation.mutate({
        newData: language,
        action: "change",
        // type: "language",
      });
    }
  };
  return { language, setLanguage, changeLanguage };
}
