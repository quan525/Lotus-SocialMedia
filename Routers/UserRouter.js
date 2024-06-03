const express = require("express");
const {   GetAllUsers, UpdateAvatar, GetSingleUser, SearchUser, FriendSuggestion, UpdateProfile} = require("../controllers/UserController");
const router = express.Router()
const parser = require("../config/multer");
const { authenticateToken } = require("../middleware/authorization");

router.post("/test", parser.single('avatar'), (req, res, next ) =>{
  const file = req.file
  console.log(req.file.path)
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.json({ secure_url: req.file.path });
})

//Friend Suggestion
router.get("/friends_suggestion", authenticateToken, FriendSuggestion  )

router.get("/all_users", authenticateToken, GetAllUsers )

router.get("/search", authenticateToken, SearchUser )

router.put("/update", authenticateToken, UpdateProfile )

router.post("/avatar_update", authenticateToken, parser.single('file'), UpdateAvatar)

router.get("/:userId", authenticateToken, GetSingleUser)

// router.put("/update_avatar", authenticateToken, parser.single('avatar'), UpdateAvatar )

module.exports = router