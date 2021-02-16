import { useState } from "react";

export default function useIsLoading(initialState:boolean) {
  const [isLoading, setisLoading] = useState(initialState);
  return { isLoading, setisLoading };
}
