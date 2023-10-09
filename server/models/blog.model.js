import mongoose from "mongoose";
const Blogschema=new mongoose.Schema({
   Title:{
    type:String,
    trim:true,
    required:"Title is required",
    unquie:true
   },
   Subject:{
    type:String,
    trim: true,
    required:"Describe shortly about your blog"
   },
   photo:{
    type:Array,
    trim:true,
    required:"Add image to your blog"
   },
   Explanation:{
    type:String,
    trim:true,
    required:"Explain about your blog"
   },
   created:{
     type:Date,
     default:Date.now
   },
   updated:Date,
})

export default mongoose.model('Blog',Blogschema);