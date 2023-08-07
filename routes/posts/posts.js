const express = require("express");
const multer = require("multer");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const postRoutes = express.Router();
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");

//instance of multer
const upload = multer({
  storage,
});
//POST
postRoutes.post("", protected, upload.single("file"), createPostCtrl);

//GET
postRoutes.get("", fetchPostsCtrl);

//GET/:id
postRoutes.get("/:id", fetchPostCtrl);

//DELETE/:id
postRoutes.delete("/:id", protected, deletePostCtrl);

//PUT/:id
postRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);

module.exports = postRoutes;
