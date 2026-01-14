import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(201).json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(201).json({
      success: false,
      message: "comment creation faild",
      details: err,
    });
  }
};

// comment get by  id
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CommentService.getCommentById(id as string);
    res.status(200).json({
      result,
    });
  } catch (err) {
    res.status(201).json({
      success: false,
      message: "comment get faild",
      details: err,
    });
  }
};

// comment get by user id
const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentByAuthor(authorId as string);
    res.status(200).json({
      result,
    });
  } catch (err) {
    res.status(201).json({
      success: false,
      message: "comment get faild",
      details: err,
    });
  }
};

// delete comment
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    console.log(req.params)
    const result = await CommentService.deleteComment(
      id as string,
      user?.id as string
    );
    res.status(200).json({
      success: true,
      result,
      message: "comment deleted faild!",
    });
  } catch (err) {
    res.status(201).json({
      success: false,
      message: "comment delete faild",
      details: err,
    });
  }
};


// delete comment
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    console.log(req.params)
    const result = await CommentService.updateComment(
      id as string,
      req.body,
      user?.id as string
    );
    res.status(200).json({
      success: true,
      result,
      message: "comment update success",
    });
  } catch (err) {
    res.status(201).json({
      success: false,
      message: "comment delete faild",
      details: err,
    });
  }
};


// delete comment
const moderateComment = async (req: Request, res: Response) => {
  try {
    // const user = req.user;
    const { id } = req.params;
     
    const result = await CommentService.moderateComment(
      id as string,req.body
    );
    res.status(200).json({
      success: true,
      result,
      message: "comment update success",
    });
  } catch (err:any) {
    res.status(201).json({
      success: false,
      message: err.message || "comment update faild",
      details: err,
    });
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
  moderateComment
};
