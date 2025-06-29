import Router from "express";
import {
  loginUser,
  registerUser,
  verifyToken,
} from "../../controllers/auth/auth.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-token").post(verifyToken);

export default router;
