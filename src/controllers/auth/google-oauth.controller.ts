import { Request, Response } from "express";
import {
  GOOGLE_ACCESS_TOKEN_URL,
  GOOGLE_OAUTH_REDIRECT_URI,
  GOOGLE_OAUTH_ROOT_URL,
} from "../../constants";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import qs from "qs";
import { prisma } from "../../db";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/JWTTokens";
import { sendMail } from "../../resend";
import { welcomeEmailTemplate } from "../../utils/email-templates/welcome-email";

export const createGoogleOauthEndpoint = (req: Request, res: Response) => {
  const { role } = req.headers;

  const rootUrl = GOOGLE_OAUTH_ROOT_URL;
  const redirectUri = GOOGLE_OAUTH_REDIRECT_URI;

  const options = {
    redirect_uri: redirectUri,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["openid", "email", "profile"].join(" "),
  };

  const queryString = new URLSearchParams(options);

  res
    .cookie("userRole", role, {
      httpOnly: true,
      secure: true,
    })
    .json({
      url: `${rootUrl}?${queryString}`,
    });
};

export const handleGoogleOAuthCallback = async (
  req: Request,
  res: Response,
) => {
  const code = req.query.code;
  // const userRole: "EATERY" | "CUSTOMER" = req.cookies.userRole

  if (!code) {
    res.status(400).send("No code found in the query string");
  }

  try {
    const response = await axios.post(
      GOOGLE_ACCESS_TOKEN_URL,
      qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const { id_token, access_token } = response.data;

    const userInfo: JwtPayload = jwt.decode(id_token) as JwtPayload;

    // Update DB if already exists else insert
    const userData = {
      sub: userInfo.sub,
      email: userInfo.email as string,
      isVerified: userInfo.email_verified as boolean,
      name: userInfo.name as string,
      picture: userInfo.picture as string,
    };

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      create: {
        email: userData.email,
        firstname: userData.name.split(" ")[0],
        lastname: userData.name.split(" ")[1],
        // role: userRole ? userRole : "CUSTOMER",
        provider: "GOOGLE",
        providerId: userData.sub,
        profilePicture: userData.picture,
        isVerified: userData.isVerified,
      },
      update: {
        firstname: userData.name.split(" ")[0],
        lastname: userData.name.split(" ")[1],
        providerId: userData.sub,
        isVerified: userData.isVerified,
        profilePicture: userData.picture,
        email: userData.email,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    if (!user) {
      res.status(500).json({
        message: "Sign in failed. Please try again",
      });
    }

    // Generate JWTs
    const refreshToken = generateRefreshToken(user.id);
    const accessToken = generateAccessToken(
      user.id,
      user.email,
      user.username,
      `${user.firstname} ${user.lastname}`,
    );

    // Save refresh token to DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });

    // Save to cookies and send response
    const options = {
      httpOnly: true,
      secure: true,
    };

    // send mail
    const emailTemplate = welcomeEmailTemplate(user.firstname);
    await sendMail(user.email, "We welcome you to Foodly!", emailTemplate);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user,
        message: "User logged in successfully",
      });
  } catch (error: any) {
    console.error(
      "Error exchanging code for tokens:",
      error.response?.data || error.message,
    );
    res
      .status(500)
      .json({ message: "Failed to exchange code for tokens", error });
  }
};
