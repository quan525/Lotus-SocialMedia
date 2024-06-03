const express = require("express")
const { authenticateToken } = require("../middleware/authorization")
const { AddComment, UpdateComment, GetPostComments, DeleteComment } = require("../controllers/CommentController")
const parser = require("../config/multer")

const router = express.Router()

router.post("/:postId", authenticateToken, parser.single("media"), AddComment)

router.put("/:postId", authenticateToken, UpdateComment)

router.get("/:postId", authenticateToken, GetPostComments)

router.delete("/:postId", authenticateToken, DeleteComment)


module.exports = router