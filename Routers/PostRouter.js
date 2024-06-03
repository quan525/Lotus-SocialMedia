const express = require("express")
const { CreatePost, DeletePost, GetUserPosts, GetPost, GetPosts, SharePost } = require("../controllers/PostController")
const { authenticateToken } = require("../middleware/authorization")
const parser = require("../config/multer")
const { route } = require("./AuthRouter")

const router = express.Router()

router.post("/posts", authenticateToken, parser.array("media", 5), CreatePost); // Create a post

router.get("/posts/:postId", authenticateToken, GetPost); // Get a specific post by postId

// router.get("/user/posts", authenticateToken, );
router.post("/:postId/share", authenticateToken, SharePost)

// Get posts for the homepage
router.get("/my-posts", authenticateToken, GetUserPosts);

// Get posts for a user's personal page
router.get("/user/:userId/posts", authenticateToken, GetUserPosts);

// router.put("/posts/{postId}", authenticateToken, UpdatePost);

router.delete("/:postId", authenticateToken, DeletePost);

//Get Feed Post 
router.get("/posts", authenticateToken, GetPosts);

router.post("/test" , (req, res) => {
    const content = req.content
    res.send(content)
})

module.exports = router