import express from 'express'
import { postRouter } from './modules/post/post.router';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/posts",postRouter)

app.get('/',(req,res)=>{
    res.send('hello world')
})

export default app



