import Router from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyToken,
} from "../../controllers/auth/auth.controller";
import { verifyAuth } from "../../middleware/verifyAuth";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-token").post(verifyToken);

// protected route
router.route("/logout").post(verifyAuth, logoutUser);

export default router;
