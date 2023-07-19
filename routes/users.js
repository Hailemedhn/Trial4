const user = require("../models/user");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.get("/", (req,res)=>{
    res.send("Hey this is user.");
});
//Update User
router.put("/:id", async(req,res)=>{
    console.log(req.params.id)
    if(req.body.userId===req.params.id || req.body.isAdmin){
        if(req.body.password){
            try {
               const salt = await bcrypt.genSalt(10);
               req.body.password = await bcrypt.hash(req.body.password, salt); 
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("Account updated");
        } catch (error) {
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You can only change your account.")
    }
});
router.delete("/:id", async(req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try {
            const user = await User.findOneAndDelete(req.params.id);
            res.status(200).json("Account deleted");
        } catch (error) {
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You can only delete your account.")
    }
});
router.get("/:id", async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other }= user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json("Someting went wrong");
    }
});
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: { followers: req.body.userId}});
                await currentUser.updateOne({$push: {followings: req.params.id}});
                res.status(200).json("User is added as friend");
            }else{
                res.status(403).json("You are already friends")
            }
            
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You can't follow yourself.")
    }
});
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: { followers: req.body.userId}});
                await currentUser.updateOne({$pull: {followings: req.params.id}});
                res.status(200).json("User is taken out of friends");
            }else{
                res.status(403).json("You are not friends")
            }
            
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You can't unfollow yourself.")
    }
});
module.exports=router;