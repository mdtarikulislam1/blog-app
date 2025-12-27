import express from 'express'
import { postRouter } from './modules/post/post.router';

const app = express();

app.use(express.json());

app.use("/posts",postRouter)

app.get('/',(req,res)=>{
    res.send('hello world')
})

export default app



