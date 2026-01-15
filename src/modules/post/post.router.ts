import express, { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", PostController.getAllPost);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost
);

router.get("/myPost",auth(UserRole.ADMIN,UserRole.USER), PostController.getMyPost);

// update own post
router.patch("/updatePost/:postId", auth(UserRole.ADMIN,UserRole.USER),PostController.updatePost) 

router.get("/:id", PostController.getPostById);

export const postRouter: Router = router;
