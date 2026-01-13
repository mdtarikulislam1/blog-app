import { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();
// get comment by id
router.get("/:id", CommentController.getCommentById);

// get comment by user id
router.get("/author/:id", CommentController.getCommentByAuthor);

// delete comment
router.delete(
  "/delete/comment/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.deleteComment
);

// delete comment
router.patch(
  "/update/comment/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.updateComment
);

// create comment
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  CommentController.createComment
);
export const commentRouter: Router = router;
