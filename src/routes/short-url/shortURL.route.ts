import Router from "express";
import { handleShortURLRedirect } from "../../controllers/short-url/shortURL.controller";

const router = Router();

router.route("/:id").get(handleShortURLRedirect);

export default router;
