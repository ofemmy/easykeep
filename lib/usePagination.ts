import React, { useState, useEffect, useRef } from "react";
type Config = {
  totalNumofResults: number;
  numPerPage: number;
};
  
export default function usePagination(config: Config) {
  if (!config) {
    throw new Error("Please provide config object");
  }
  const { totalNumofResults, numPerPage } = config;
  const [limit, setLimit] = useState(numPerPage);
  const [skip, setSkip] = useState(0);
  const [currentCount, setCurrentCount] = useState({
    from: skip + 1, //first page has to start with 1 and not 0
    to: limit,
  });
  const [isLastPage, setisLastPage] = useState(false);
  const [isFirstPage, setisFirstPage] = useState(true);
  useEffect(() => {
    skip > 0 ? setisFirstPage(false) : setisFirstPage(true);
    currentCount.to == totalNumofResults
      ? setisLastPage(true)
      : setisLastPage(false);
  }, [currentCount]);
  const goNext = () => {
    if (isLastPage) {
      return;
    }
    setSkip((skip) => skip + limit);
    setCurrentCount((currentCount) => ({
      from: currentCount.from + limit,
      to: Math.min(currentCount.to + limit, totalNumofResults),
    }));
  };
  const goPrev = () => {
    if (isFirstPage) {
      return;
    }
    setSkip((old) => old - limit);
    setCurrentCount((currentCount) => ({
      from: Math.max(0, currentCount.from - limit),
      to: currentCount.to - limit,
    }));
  };
  return {
    skip,
    limit,
    goNext,
    goPrev,
    currentCount,
    isLastPage,
    isFirstPage,
  };
}
