import { NextFunction, Request, Response } from "express";
import { verifyAcesssJWT } from "../utils/JWTTokens";
import { prisma } from "../db";
import { JwtPayload } from "jsonwebtoken";

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;
    console.log("Token: ", req.cookies.accessToken);

    if (!token) {
      res.status(401).json({
        message: "Unauthorized request",
      });
    }

    const decodedToken = verifyAcesssJWT(token) as JwtPayload;

    const user = await prisma.user.findFirst({
      where: { id: decodedToken.id },
      omit: {
        password: true,
        refreshToken: true,
      },
    });
    if (!user) {
      res.status(401).json({ message: "Invalid access token" });
      return;
    }

    const reqBodyUser = {
      id: user.id,
      email: user.email,
      firstname: user.email,
      profilePicture: user.profilePicture ?? "",
      role: user.role,
    };

    req.user = reqBodyUser;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ message: "Invalid access token. Something went wrong." });
    return;
  }
};
