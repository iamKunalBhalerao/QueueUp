import { Router } from "express";
import {
  isAuthenticatedController,
  logoutController,
  refreshTokenController,
  signInController,
  signUpController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRouter: Router = Router();

authRouter.route("/signup").post(signUpController);
authRouter.route("/signin").post(signInController);
authRouter.route("/logout").post(logoutController);
authRouter.route("/refresh-account").post(refreshTokenController);
authRouter
  .route("/is-authenticated")
  .get(authMiddleware, isAuthenticatedController);

export default authRouter;
