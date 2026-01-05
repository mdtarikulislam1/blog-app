import express, { Router } from "express";
import { PostControler } from "./post.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/",auth(UserRole.ADMIN,UserRole.USER),PostControler.getAllPost)

router.post("/", auth(UserRole.ADMIN, UserRole.USER), PostControler.createPost);

export const postRouter: Router = router;
