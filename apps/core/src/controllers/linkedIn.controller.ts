import { NextFunction, Request, Response } from "express";
import {
  exchangeCodeForToken,
  getLinkedInProfile,
} from "../services/linkedIn.service";
import { prisma } from "@infra/db";

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
        userId_provider: {
          userId: userId,
          provider: "LINKEDIN",
        },
      },
      update: {
        accessToken: tokenData.access_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        providerAccountId: profile.sub,
      },
      create: {
        userId: userId,
        provider: "LINKEDIN",
        accessToken: tokenData.access_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        providerAccountId: profile.sub,
      },
    });

    res.json({
      data: profile,
      tokenData: tokenData,
      accessToken: tokenData.access_token,
      CallBackData
    });
  } catch (error) {
    next(error);
  }
};
