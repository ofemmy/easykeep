import React from "react";
import { Category } from "../types/Category";
import {Colorcodes} from '../types/Colorcodes'
type CategoryIconPropType = {
  category: Category;
};
export const CategoryIcon: React.FC<CategoryIconPropType> = ({ category }) => {
  return (
    <div 
    className="w-3 h-3 rounded-full flex items-center justify-items-center bg-blue-900"
    style={{ backgroundColor:`${Colorcodes[category]}`}}
    ></div>
  );
};
