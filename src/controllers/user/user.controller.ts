import { Request, Response } from "express";
import { prisma } from "../../db";

export const getUser = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(404).json({
      message: "No user found.",
    });
    return;
  }

  try {
    const fetchedUser = await prisma.user.findFirst({
      where: { id: user.id },
      omit: {
        password: true,
        refreshToken: true,
        otp: true,
        otpExpiry: true,
      },
    });

    if (!fetchedUser) {
      res.status(404).json({
        message: "No user found in the database with this id.",
      });
      return;
    }

    res.status(200).json({
      user: fetchedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to fetch user",
    });
  }
};
