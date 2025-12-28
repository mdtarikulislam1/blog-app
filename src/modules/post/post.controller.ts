import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error)
    res.status(401).json({
      error: "post creation faild",
      details: error,
    });
  }
};

export const PostControler = {
  createPost,
};
