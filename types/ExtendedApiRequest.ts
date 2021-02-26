import { User } from "@prisma/client";
import { NextApiRequest } from "next";

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