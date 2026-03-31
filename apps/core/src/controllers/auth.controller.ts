import type { NextFunction, Request, Response } from "express";
import { httpOptions } from "../config/http.config";
import {
  signUpService,
  signInService,
  logoutService,
  refreshTokenService,
} from "../services/auth.service";
import type { SignInRequest, SignUpRequest } from "@repo/shared";

export const signUpController = async (
  req: SignUpRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tokens, user } = await signUpService(req.body);
    res
      .cookie(
        "accessToken",
        tokens.accessToken,
        // httpCookieOptions as CookieOptions,
        httpOptions,
      )
      .cookie(
        "refreshToken",
        tokens.refreshToken,
        // httpCookieOptions as CookieOptions,
        httpOptions,
      )
      .status(201)
      .json({
        success: true,
        message: "Signed Up Successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const signInController = async (
  req: SignInRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;
    const { tokens, user } = await signInService(data);

    res
      .cookie(
        "accessToken",
        tokens.accessToken,
        // httpCookieOptions as CookieOptions,
        httpOptions,
      )
      .cookie(
        "refreshToken",
        tokens.refreshToken,
        // httpCookieOptions as CookieOptions,
        httpOptions,
      )
      .status(201)
      .json({
        success: true,
        message: "Signed In Successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    if (userId) {
      await logoutService(userId);
    }

    res
      .clearCookie("accessToken", httpOptions)
      .clearCookie("refreshToken", httpOptions)
      .status(201)
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken as string;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    const { tokens, user } = await refreshTokenService(refreshToken);

    res
      .cookie(
        "accessToken",
        tokens.accessToken,
        // httpCookieOptions as CookieOptions,
        httpOptions,
      )
      .cookie(
        "refreshToken",
        tokens.refreshToken,
        // httpCookieOptions as CookieOptions,
        httpOptions,
      )
      .status(200)
      .json({
        success: true,
        message: "Tokens refreshed successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const isAuthenticatedController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(200).json({
        success: false,
        isAuthenticated: false,
      });
    }

    res.status(200).json({
      success: true,
      isAuthenticated: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
