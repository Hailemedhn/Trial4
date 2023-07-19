const router = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");

//create post
router.post("/", async(req, res)=>{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.put("/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.updateOne({$set: req.body});
            res.status(200).json("the post has been upkdaeed")
        }else{
            res.status(403).json("You can't edit people's posts!")
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
router.delete("/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne();
            res.status(200).json("the post has been deleted")
        }else{
            res.status(403).json("You can't delete people's posts!")
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
router.put("/:id/like", async(req,res)=>{
    console.log (req.params.id,req.body.userId)
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("post");
        }else{
            await post.updateOne({$pull: {likes:req.body.userId}});
            res.status(200).json("The post has been unliked");
        }
    } catch (error) {
        res.status(500).json("error")
    }
});
router.get("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);        
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/timeline/all", async(req, res)=>{
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId: friendId})
            })
        );
        res.json(userPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(error)
    }
});


module.exports = router;