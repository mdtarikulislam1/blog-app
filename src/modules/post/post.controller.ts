import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helper/paginationSortingHelper";
import { UserRole } from "../../middleware/auth";


const createPost = async (req: Request, res: Response ,next:NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (e) {
    next(e)
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // true or false
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );
    // console.log("options",options)

    const result = await postService.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post creation failed",
      details: e,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Post Id is required!");
    }
    const result = await postService.getPostById(id);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      error,
    });
  }
};

const getMyPost = async (req: Request, res: Response) => {
  try {
    console.log(req.user?.id);
    const result = await postService.getMyPost(req.user?.id as string);
    res.status(201).json({
      success: false,
      result,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      err,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const isAdmin = req.user?.role === UserRole.ADMIN;
    const result = await postService.updatePost(
      postId as string,
      req.body,
      req.user?.id as string,
      isAdmin
    );
    res.status(201).json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(401).json({
      status: false,
      details: err,
      message: "post update faid",
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === UserRole.ADMIN;

    const result = await postService.deletePost(id as string, req.user!.id, isAdmin);

    res.status(200).json({
      success: true,
      details: result,
      message: "Post deleted successfully",
    });
  } catch (err: any) {
    res.status(403).json({
      success: false,
      message: err.message || "Post delete failed",
    });
  }
};

const getStats = async (req:Request,res:Response)=>{
   try{
   const result = await postService.getStats()
   res.status(201).json({
    message:"getstats success",
    success:true,
    data:result
   })
   } catch(err){
     res.status(401).json({
      success:false,
      message:"get stats faild",
      details:err
     })
   }
}

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
  getStats
};
