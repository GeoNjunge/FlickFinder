import "express";
import { Request } from "express";

export interface AllRequest extends Request {
  user?: {
    sub: string;
    email: string;
    role: enum = ["parent", "child", "admin"];
  };
  device?: {
    role: "device";
    deviceId: string;
    childId: string;
  };
}

import "express";

declare module "express-serve-static-core" {
  interface Request {
    device?: {
      role: "device";
      deviceId: string;
      childId: string;
      iat?: number;
      exp?: number;
    };
    user?: {
      sub: string;
      email: string;
      role: enum = ["parent", "child", "admin"];
      iat?: number;
      exp?: number;
    };
  }
}

export {};
