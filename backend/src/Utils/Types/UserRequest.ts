interface userRequest extends Request {
  user?: {
    id: string;
    role: "admin" | "user" | "guest";
  };
}

export type { userRequest };
