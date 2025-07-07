import Router from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendOTP,
  sendWelcomeMail,
  verifyOTP,
} from "../../controllers/auth/auth.controller";
import { verifyAuth } from "../../middleware/verifyAuth";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/send-welcome-mail").post(sendWelcomeMail);

// protected route
router.route("/logout").post(verifyAuth, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
