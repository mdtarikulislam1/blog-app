import express, { Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", PostController.getAllPost);
router.get("/stats",auth(UserRole.ADMIN), PostController.getStats);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.createPost
);

router.get("/myPost",auth(UserRole.ADMIN,UserRole.USER), PostController.getMyPost);

// update own post
router.patch("/updatePost/:postId", auth(UserRole.ADMIN,UserRole.USER),PostController.updatePost) 

// delete post 
router.delete("/delete/:id",auth(UserRole.ADMIN,UserRole.USER),PostController.deletePost)

router.get("/:id", PostController.getPostById);

export const postRouter: Router = router;
