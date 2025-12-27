import express, { Router } from 'express'
import { PostControler } from './post.controller'

const router = express.Router()

router.post('/',PostControler.createPost)

export const postRouter:Router = router