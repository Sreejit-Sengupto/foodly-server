import Router from "express";
import { verifyAuth } from "../../middleware/verifyAuth";
import { getUser } from "../../controllers/user/user.controller";

const router = Router();

router.route("/get").get(verifyAuth, getUser);

export default router;
