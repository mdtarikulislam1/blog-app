import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  
  try {
    const user = req.user;
    if(!user){
      return res.status(400).json({
        error:"unauthorized",
      })
    }
    const result = await postService.createPost(req.body,user.id as string);
    res.status(201).json(result);
  } catch (error) {
    console.log(error)
    res.status(401).json({
      error: "post creation faild",
      details: error,
    });
  }
};

const getAllPost = async(req:Request,res:Response)=>{
  try{
    const {search} = req.query
    const searchString = typeof search === 'string' ? search : undefined
    console.log("search value",search)
      const result = await postService.getAllPost({search:searchString})
      res.status(200).json(result)

  }catch(e){
    res.status(401).json({
      status:false,
      details:e
    })
  }
}

export const PostControler = {
  createPost,
  getAllPost
};
