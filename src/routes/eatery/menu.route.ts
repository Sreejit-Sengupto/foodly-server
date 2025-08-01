import Router from "express";
import { verifyAuth } from "../../middleware/verifyAuth";
import {
  createManyMenuItemsHandler,
  createMenuItemHandler,
  deleteMenuItemHandler,
  getMenuHandler,
  getMenuItemHandler,
  updateMenuItemHandler,
} from "../../controllers/eatery/menu.controller";

const router = Router();

router.route("/").get(getMenuHandler);
router.route("/:eateryId/:id").get(getMenuItemHandler);
router.route("/").post(verifyAuth, createManyMenuItemsHandler);
router.route("/:eateryId/:id").patch(verifyAuth, updateMenuItemHandler);
router.route("/:eateryid/:id").delete(verifyAuth, deleteMenuItemHandler);

export default router;
