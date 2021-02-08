import { NextApiRequest } from "next";
import { User } from "../db/models/User";
export interface ExtendedRequest extends NextApiRequest {
    user:User;
    session: {
      set<T = any>(name: string, value: T): void;
      get<T = any>(name: string): T;
      unset(name: string): void;
      save(): Promise<any>;
      destroy(): void;
    };
  }