const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Post = require("../models/Post");


router.post("/create", authMiddleware, async (req, res) => {
  try {
    const post = new Post({ ...req.body, author: req.user.id });
    await post.save();
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.put("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only edit your own posts" });
    }

    Object.assign(post, req.body);
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;