import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andConditions: PostWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
    });
  }

  if (status) {
    andConditions.push({
      status,
    });
  }

  if (authorId) {
    andConditions.push({
      authorId,
    });
  }

  const allPost = await prisma.post.findMany({
    take: limit,
    skip,

    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: { select: { comments: true } },
    },
  });
  const totalData = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: allPost,
    pagination: {
      totalData,
      page,
      limit,
      totalPage: Math.ceil(totalData / limit),
    },
  };
};

const getPostById = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: {
                createdAt: "asc",
              },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: {
                    createdAt: "asc",
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
  return result;
};

const getMyPost = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.aggregate({
    where: {
      authorId,
    },
    _count: {
      id: true,
    },
  });
  return {
    data: result,
    count: total,
  };
};

type UpdatePostData = Omit<Post, "id" | "authorId" | "createdAt" | "updatedAt">;

const updatePost = async (
  postId: string,
  data: Partial<UpdatePostData>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findFirstOrThrow({
    where: { id: postId },
    select: { id: true, authorId: true },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }

  return prisma.post.update({
    where: { id: postData.id },
    data,
  });
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  // 🔹 Admin হলে শুধু ID দিয়ে খুঁজবে
  const postData = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!postData) {
    throw new Error("Post not found");
  }

  // 🔹 Admin না হলে ownership check
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  return await prisma.post.delete({
    where: { id: postId },
  });
};

const getStats = async () => {
  //  total post, publishedPosts, draftPosts, totalComments, totalViews
  return await prisma.$transaction(async (tx) => {
    const [
      totalPost,
      publishedPosts,
      draftPosts,
      archivedPost,
      totalComments,
      approvedComments,
      rejectComment,
      totalUsers,
      totalAdmin,
      userTotal,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: UserRole.ADMIN,
        },
      }),
      await tx.user.count({
        where: {
          role: UserRole.USER,
        },
      }),
    ]);

    return {
      totalPost,
      publishedPosts,
      draftPosts,
      archivedPost,
      totalComments,
      approvedComments,
      rejectComment,
      totalUsers,
      totalAdmin,
      userTotal,
    };
  });
};

export const postService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  getStats,
};
