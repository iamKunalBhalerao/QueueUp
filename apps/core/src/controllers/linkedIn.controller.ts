import { NextFunction, Request, Response } from "express";
import {
  createImmediatePostService,
  createScheduledPostService,
  exchangeCodeForToken,
  getLinkedInProfile,
} from "../services/linkedIn.service";
import { prisma } from "@infra/db";
import { createLinkedInPostSchema } from "@repo/shared";

export const linkedInSetupController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const state = process.env.LINKEDIN_STATE || "default_state";
    const scope = "openid profile w_member_social";

    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=${scope}&state=${state}`;

    res.redirect(url);
  } catch (error) {
    next(error);
  }
};

export const linkedInCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const { code } = req.query;

    if (!code) return res.status(400).json({ error: "No code" });

    const tokenData = await exchangeCodeForToken(code as string);

    const profile = await getLinkedInProfile(tokenData.access_token);

    const CallBackData = await prisma.socialAccount.upsert({
      where: {
        userId_platform: {
          userId: userId,
          platform: "LINKEDIN",
        },
      },
      update: {
        accessToken: tokenData.access_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        platformAccountId: profile.sub,
      },
      create: {
        userId: userId,
        platform: "LINKEDIN",
        name: profile.name,
        accessToken: tokenData.access_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        platformAccountId: profile.sub,
      },
    });

    res.json({
      data: profile,
      tokenData: tokenData,
      accessToken: tokenData.access_token,
      CallBackData,
    });
    // res
    //   .cookie("linkedin_connected", "true", {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "lax",
    //   })
    //   .cookie("linkedin_access_token", tokenData.access_token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "lax",
    //   });
    // res.redirect(`${process.env.CLIENT_URL}/auth/success`);
  } catch (error) {
    next(error);
  }
};

export const getLinkedInStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const socialAccount = await prisma.socialAccount.findUnique({
      where: {
        userId_platform: {
          userId,
          platform: "LINKEDIN",
        },
      },
      select: {
        id: true,
        platform: true,
        platformAccountId: true,
        name: true,
        avatarUrl: true,
        accessToken: true,
        expiresAt: true,
      },
    });

    if (!socialAccount) {
      return res.status(200).json({
        connected: false,
        status: "not_connected",
        account: null,
      });
    }

    if (socialAccount.expiresAt < new Date()) {
      return res.status(401).json({
        connected: false,
        status: "expired",
        profile: {
          name: socialAccount.name,
        },
        expiredAt: socialAccount.expiresAt,
      });
    }

    const totalMs = 60 * 24 * 60 * 60 * 1000; // LinkedIn tokens ~60 days
    const remainingMs = socialAccount.expiresAt.getTime() - Date.now();

    return res.status(200).json({
      connected: !!socialAccount,
      status: "connected",
      profile: {
        name: socialAccount.name,
        avatarUrl: socialAccount.avatarUrl,
      },
      token: {
        expiresAt: socialAccount.expiresAt,
        percentRemaining: Math.round((remainingMs / totalMs) * 100),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createLinkedInPostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const validatedData = createLinkedInPostSchema.parse(req.body);

    const isScheduled = req.query.scheduled === "true";

    const post = isScheduled
      ? await createScheduledPostService(userId, validatedData)
      : await createImmediatePostService(userId, validatedData);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
