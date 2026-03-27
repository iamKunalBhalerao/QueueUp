import { prisma } from "@infra/db";
import { CreateLinkedInPostInput } from "@repo/shared";
import { Platform, PostStatus } from "@infra/db";

export const createLinkedInPostDao = async (
  userId: string,
  data: CreateLinkedInPostInput,
) => {
  return await prisma.post.create({
    data: {
      userId,
      platform: Platform.LINKEDIN,
      status: data.scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      linkedInPost: {
        create: {
          content: data.content,
          media: data.media || [],
        },
      },
    },
    include: {
      linkedInPost: true,
    },
  });
};

export const getLinkedInSocialAccountDao = async (userId: string) => {
  return await prisma.socialAccount.findUnique({
    where: {
      userId_platform: {
        userId,
        platform: Platform.LINKEDIN,
      },
    },
  });
};
