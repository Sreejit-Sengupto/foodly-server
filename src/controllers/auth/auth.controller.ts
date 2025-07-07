import { Request, Response } from "express";
import {
  loginSchema,
  otpVerificationSchema,
  registrationSchema,
  resendOTPSchema,
  sendWelcomMailSchema,
  tokenVerificationSchema,
} from "../../validation/auth";
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import { sendMail } from "../../resend";
import { verificationMailTemplate } from "../../utils/email-templates/verify-email";
import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
  verifyAcesssJWT,
} from "../../utils/JWTTokens";
import { FRONTEND_VERIFICATION_URL } from "../../constants";
import { welcomeEmailTemplate } from "../../utils/email-templates/welcome-email";
import { generateOTP } from "../../utils/generateOTP";
import jwt, { JwtPayload } from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const parseRes = registrationSchema.safeParse(req.body);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    const user = await prisma.user.findFirst({
      where: { email: reqData.email },
    });

    if (user) {
      // if user exists check two conditions -
      // 1. if provider = "Google", send a mail to set password
      // 2. if provider  = "Email", return a message for logging in

      if (user.provider === "GOOGLE") {
        const OTP = generateOTP();
        const otpExpiryDate = new Date(Date.now() + 15000 * 60); // 15 mins

        await prisma.user.update({
          where: { email: user.email },
          data: {
            otp: OTP,
            otpExpiry: otpExpiryDate,
          },
        });

        const emailTemplate = verificationMailTemplate(user.firstname, OTP);

        await sendMail(
          user.email,
          "Verify your email to set password - Foodly",
          emailTemplate,
        );

        res.status(409).json({
          message:
            "Plese login using Google or check your mail to set password",
        });
      } else if (user.provider === "EMAIL") {
        res.status(409).json({
          message: "Account already exists. Please login.",
        });
      }
    }
    const password = await bcrypt.hash(reqData.password, 10);
    const OTP = generateOTP();
    const otpExpiryDate = new Date(Date.now() + 15000 * 60); // 15 mins

    const createdUser = await prisma.user.create({
      data: {
        email: reqData.email,
        firstname: reqData.firstname,
        lastname: reqData.lastname,
        password,
        otp: OTP,
        otpExpiry: otpExpiryDate,
        provider: "EMAIL",
        role: reqData.role,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    const emailTemplate = verificationMailTemplate(createdUser.firstname, OTP);
    await sendMail(
      createdUser.email,
      "Verify your email - Foodly",
      emailTemplate,
    );

    res.status(200).json({
      createdUser,
      success: true,
      message: "User registered. Mail sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to register",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const parseRes = loginSchema.safeParse(req.body);
  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    const user = await prisma.user.findFirst({
      where: { email: reqData.email },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found please sign up first",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      reqData.password,
      user.password!,
    );
    if (!isPasswordCorrect) {
      res.status(400).json({
        message: "Incorrect password",
      });
    }

    const accessToken = generateAccessToken(
      user?.id,
      user.email,
      user.firstname,
      `${user.firstname} ${user.lastname}`,
    );
    const refreshToken = generateRefreshToken(user.id);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        loginCount: {
          increment: 1,
        },
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    const options = {
      httpOnly: true,
      secure: false,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: updatedUser,
        success: true,
        message: "Logged in successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to register",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const user = req?.user;

  try {
    await prisma.user.update({
      where: { id: user?.id },
      data: {
        refreshToken: null,
      },
    });

    const options = {
      httpOnly: true,
      secure: false,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to logout",
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const parseRes = otpVerificationSchema.safeParse(req.body);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    const user = await prisma.user.findFirst({
      where: { email: reqData.email },
    });

    console.log(!user);

    if (!user) {
      res.status(404).json({
        message: "No user found with this email",
      });
      return;
    }

    if (user.otpExpiry && new Date(Date.now()) > user.otpExpiry) {
      res.status(401).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user?.otp !== reqData.otp) {
      res.status(401).json({
        success: false,
        message: "OTP did not match",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to verify OTP",
    });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  const parseRes = resendOTPSchema.safeParse(req.body);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    const OTP = generateOTP();
    const otpExpiryDate = new Date(Date.now() + 15000 * 60); // 15 mins

    await prisma.user.update({
      where: { email: reqData.email },
      data: {
        otp: OTP,
        otpExpiry: otpExpiryDate,
      },
    });

    const emailTemplate = verificationMailTemplate(reqData.firstname, OTP);

    await sendMail(reqData.email, "Verify your email - Foodly", emailTemplate);

    res.status(200).json({
      success: true,
      message: "OTP resent to the provided email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to resend OTP",
    });
  }
};

export const sendWelcomeMail = async (req: Request, res: Response) => {
  const parseRes = sendWelcomMailSchema.safeParse(req.body);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    const user = await prisma.user.findFirst({
      where: { email: reqData.email },
    });

    if ((user?.loginCount ?? 0) <= 1) {
      const emailTemplate = welcomeEmailTemplate(reqData.firstname);
      await sendMail(reqData.email, "We welcome you to Foodly!", emailTemplate);
    }

    res.status(200).json({
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to send welcome mail",
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    res.status(401).json({
      message: "Unauthorized request",
    });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as JwtPayload;

    const user = await prisma.user.findFirst({
      where: { id: decodedToken.id },
    });

    if (!user) {
      res.status(401).json({
        message: "Invalid refresh token",
      });
      return;
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      res.status(401).json({
        message: "Refresh token is expired",
      });
    }

    const options = {
      httpOnly: true,
      // secure: true
    };

    const accessToken = generateAccessToken(
      user?.id,
      user?.email,
      user?.firstname,
      `${user?.firstname} ${user?.lastname}`,
    );
    const refreshToken = generateRefreshToken(user.id);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Access token renewed",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to refresh access tokens",
    });
  }
};
