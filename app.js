//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const homeStartingContent = "WELCOME TO MY DAILY JOURNAL!";
const aboutContent = "Hello! My name is Garvit Batra";
const contactContent = "Email Id : batra.garvit28@gmail.com";
const mongoose = require("mongoose");
const app = express();

mongoose.connect('mongodb+srv://admin-garvit:'+process.env.PASSWORD+'@cluster0.d0xethr.mongodb.net/blogPostDB');
const blogSchema = new mongoose.Schema({
    heading : String,
    content : String
});
const blog = new mongoose.model("blog",blogSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  blog.find({},function(err,results){
    res.render('home',{homeSC:homeStartingContent, posts:results});
  });
  
});
app.get("/about",function(req,res){
  res.render('about',{aboutC:aboutContent})
});
app.get("/contact",function(req,res){
  res.render('contact',{contactC:contactContent})
});
app.get("/compose",function(req,res){
  res.render('compose');
});
//This is something that we have not learnt in any module but the challenge of blog post module
//This is express routing parameters
app.get("/posts/:topic",function(req,res){
    const id = req.params.topic;
    blog.findOne({_id : id},function(err,result){               //Here if you have used find method that will not work
      //console.log(result);
      /*results.forEach(function(element){
          if(_.lowerCase(element.heading)===_.lowerCase(topic)){
            res.render('post',{et:element.heading,ec:element.content});
          }
      });*/
      res.render('post',{et:result.heading,ec:result.content});
    }); 
    /*posts.forEach(function(element){
      if(_.lowerCase(element.title)=== _.lowerCase(req.params.topic)){
          //console.log("Match found");
          res.render('post',{et:element.title,ec:element.cont});
      }
    });*/
});


app.post("/compose",function(req,res){
      let post =new blog({
        heading: req.body.postTitle,
        content: req.body.postContent  
      });
      //posts.push(post);
      post.save(function(err){
        if(!err){
          res.redirect("/");
        }
      });
      
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);




/*app.listen(3000, function() {
  console.log("Server started on port 3000");
});*/
