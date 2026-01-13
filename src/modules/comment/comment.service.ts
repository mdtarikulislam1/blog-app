import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentById = async (id: string) => {
  console.log(id);
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const getCommentByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      id: authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (id: string, userId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id,
      authorId: userId,
    },
  });

  if (!commentData) {
    throw new Error("Your provided input is invalid");
  }

  const result = await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });

  return result;
};

const updateComment = async (
  id: string,
  data: {
    content?: string;
    status?: CommentStatus;
  },
  authorId: string
) => {
  const updateData = prisma.comment.findFirst({
    where: {
      id,
      authorId,
    },
  });

  if (!updateData) {
    throw new Error("Comment not found");
  }
  return await prisma.comment.update({
    where: {
      id,
      authorId,
    },
    data,
  });
};

export const CommentService = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
};
