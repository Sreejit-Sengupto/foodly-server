import Router, { Request, Response } from "express";
import { verifyAuth } from "../../middleware/verifyAuth";
import {
  createEateryHanlder,
  getEateries,
  getEateryById,
  getEateryByUserHandler,
} from "../../controllers/eatery/eatery.controller";
import { upload } from "../../middleware/multer";

const router = Router();

router.route("/user").get(verifyAuth, getEateryByUserHandler);
router
  .route("/create")
  .post(
    verifyAuth,
    upload.fields([{ name: "eateryImgs", maxCount: 7 }]),
    createEateryHanlder,
  );
router.route("/:id").get(getEateryById);
// router.route('/xyz').get(getEateryByUserHandler)
router.route("/").get(getEateries);

export default router;
