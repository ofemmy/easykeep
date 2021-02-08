import { IUserModel } from "../db/types/IUser";
import { NextApiResponse } from "next";
export interface ExtendedResponse extends NextApiResponse {
    user: IUserModel;
  }