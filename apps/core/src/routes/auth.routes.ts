import { Router } from "express";
import {
  logoutController,
  refreshTokenController,
  signInController,
  signUpController,
} from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.route("/signup").post(signUpController);
authRouter.route("/signin").post(signInController);
authRouter.route("/logout").post(logoutController);
authRouter.route("/refresh-account").post(refreshTokenController);

export default authRouter;
