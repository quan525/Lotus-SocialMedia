const express = require("express")
const { authenticateToken } = require("../middleware/authorization")
const { LikePost, UnLikePost, GetTotalLikes } = require("../controllers/LikeController")

const router = express.Router()

router.post("/:postId", authenticateToken, LikePost)

router.delete("/:postId", authenticateToken, UnLikePost)

router.get("/:postId/likes", authenticateToken, GetTotalLikes)

module.exports = router 