import Router from "express";
import { upload } from "../../middleware/multer";
import { verifyAuth } from "../../middleware/verifyAuth";
import { uploadProfilePictureHandler } from "../../controllers/media/media.controller";

const router = Router();

router
  .route("/profile-picture")
  .post(verifyAuth, upload.single("pfp"), uploadProfilePictureHandler);
// .post(upload.single("pfp"), uploadProfilePictureHandler);

export default router;
