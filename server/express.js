import express from "express";
import mongoose from "mongoose";
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path  from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Blog from "./models/blog.model.js"
config({
  path: "./data/config.env",
});
mongoose.connect(process.env.MONGO_URI,{
  dbName:"cmsuser"
}).then((c)=>{console.log(`database connected with ${c.connection.host}`)}).catch((e)=>{console.log(e)})
const app=express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.redirect("/api/blog");
})
app.set("view engine","ejs")
app.get("/show-blogs",async(req,res)=>{
  try {   const blog=await Blog.find({})
  console.log(blog);
 res.render(path.join(__dirname,"views")+"\\show_blogs",{blog})
}
 catch (e) {
  console.error(e);
  return res.status(500).json({
    success: false,
    Message: 'Internal Server Error'
  });
}
})
app.get("/api/blog",(req,res)=>{
  res.render(path.join(__dirname,"views")+"\\create_blog.ejs");
})
app.post("/api/blog",async(req,res)=>{
  try {
 const {Title,Subject,image,Explanation}=req.body
 const blog=await Blog.create({Title:Title,Subject:Subject,photo:[image],Explanation:Explanation})
 if(!blog){
  console.log("err");
 }
 res.redirect("/show-blogs")
 return res.status(200).json({ 
  success:true,
  Message:"Successfully created"
 });
}catch (e) {
  console.error(e);
  return res.status(500).json({
    success: false,
    Message: 'Internal Server Error'
  });
}
})
app.get("/read-blog/:id", async (req, res) => {
  const { id } = req.params;
  const item = await Blog.findById(id);
  console.log(item);
  res.render(path.join(__dirname,"views")+"\\myblog", { item });
});
app.post("/api/blog/:id",async(req,res)=>{
  try {
  let blog=await Blog.findById(req.params.id)
  await Blog.deleteOne(blog)
  res.redirect("/show-blogs");
  return res.status(200).json({
      success:true,
      Message:"Blog deleted successfully"
  })
}
catch (e) {
  console.error(e);
  return res.status(500).json({
    success: false,
    Message: 'Internal Server Error'
  });
}
})
app.listen(6700, () => {
    console.log(
      `Server is working on port:${process.env.PORT} in Mode`
    );
  });
export default app