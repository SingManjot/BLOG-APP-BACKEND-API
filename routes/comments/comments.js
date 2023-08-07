const express = require("express");
const {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../../controllers/comments/comments");
const protected = require("../../middlewares/protected");
const commentRoutes = express.Router();

//POST
commentRoutes.post("/:id", protected, createCommentCtrl);

//GET/:id
commentRoutes.get("/:id", commentDetailsCtrl);

//DELETE/:id
commentRoutes.delete("/:id", protected, deleteCommentCtrl);

//PUT/:id
commentRoutes.put("/:id", protected, updateCommentCtrl);

module.exports = commentRoutes;
