import React from "react";
import { Spinner } from "@chakra-ui/react";
const LoadingComponent = () => {
  return (
    <div className="fixed z-40 right-10 top-36">
      <Spinner
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="lg"
      />
    </div>
        
  );
};

export default LoadingComponent;
