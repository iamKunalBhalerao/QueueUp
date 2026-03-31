import axios from "axios";
import {
  createLinkedInPostDao,
  getLinkedInSocialAccountDao,
} from "../dao/linkedIn.dao";
import { CreateLinkedInPostInput } from "@repo/shared";

export const exchangeCodeForToken = async (code: string) => {
  const { data } = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    null,
    {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      },
    },
  );

  return data;
};

export const getLinkedInProfile = async (accessToken: string) => {
  const { data } = await axios.get("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

export const createScheduledPostService = async (
  userId: string,
  postData: CreateLinkedInPostInput,
) => {
  // 1. Check if LinkedIn is connected
  const socialAccount = await getLinkedInSocialAccountDao(userId);
  if (!socialAccount) {
    throw new Error("LinkedIn account not connected");
  }

  const post = await createLinkedInPostDao(userId, postData);

  // 3. If it's not scheduled, we can trigger the worker or immediate publishing
  // For now, we just return the created post
  // In a real scenario, you might call a worker here if it's meant to be published immediately

  return post;
};

export const createImmediatePostService = async (
  userId: string,
  postData: CreateLinkedInPostInput,
) => {
  // 1. Check if LinkedIn is connected
  const socialAccount = await getLinkedInSocialAccountDao(userId);
  if (!socialAccount) {
    throw new Error("LinkedIn account not connected");
  }

  const post = await createLinkedInPostDao(userId, postData);

  // 3. If it's not scheduled, we can trigger the worker or immediate publishing
  // For now, we just return the created post
  // In a real scenario, you might call a worker here if it's meant to be published immediately

  return post;
};
