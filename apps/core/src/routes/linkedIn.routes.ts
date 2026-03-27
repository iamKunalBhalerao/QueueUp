import { Router } from "express";
import {
  linkedInSetupController,
  linkedInCallbackController,
  getLinkedInStatusController,
  createLinkedInPostController,
} from "../controllers/linkedIn.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const linkedInRouter: Router = Router();

linkedInRouter.route("/setup").get(authMiddleware, linkedInSetupController);
linkedInRouter
  .route("/callback")
  .get(authMiddleware, linkedInCallbackController);
linkedInRouter
  .route("/status")
  .get(authMiddleware, getLinkedInStatusController);
linkedInRouter
  .route("/create-post")
  .post(authMiddleware, createLinkedInPostController);

export default linkedInRouter;
