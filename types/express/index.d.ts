import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
      firstname: string;
      profilePicture: string;
      role: "CUSTOMER" | "EATERY" | "ADMIN";
    };
  }
}
