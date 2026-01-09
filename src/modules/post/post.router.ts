import express, { Router } from 'express';
import { PostController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth';


const router = express.Router();

router.get(
    "/",
    PostController.getAllPost
)

router.post(
    "/",
    auth(UserRole.USER),
    PostController.createPost
)

router.get("/:id",PostController.getPostById)

export const postRouter: Router = router; 