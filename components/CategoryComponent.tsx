import React from "react";
import {Colorcodes} from "../types/Colorcodes";

const CategoryComponent = ({value}) => {
  return (
    <div className="md:block">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600 capitalize"
      //style={{ color:`${Colorcodes[value]}`}}
      >
        {value}
      </span>
    </div>
  );
};

export default CategoryComponent;
