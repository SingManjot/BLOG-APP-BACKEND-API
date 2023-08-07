const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const Comment = require("../../model/comment/Comment");
const appErr = require("../../utils/appErr");

//create
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    //find the post
    const post = await Post.findById(req.params.id);

    //create the comment
    const comment = await Comment.create({
      user: req.seesion.userAuth,
      message,
    });

    //push the comment to post
    post.comments.push(commnet._id);

    //find the user
    const user = await User.findById(req.session.userAuth);

    //push the comment into user
    user.comments.push(comment._id);

    //disable validation and save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    res.json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    res.json(error);
  }
};

const commentDetailsCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Post comment",
    });
  } catch (error) {
    res.json(error);
  }
};

//delete
const deleteCommentCtrl = async (req, res, next) => {
  try {
    //find the comment
    const comment = await Comment.findById(req.params.id);

    //check if the comment belongs to the user
    if (commnet.user.toString() !== req.sessions.userAuth.toString) {
      return next(appErr("You are not allowed to delete this comment", 401));
    }

    //delete comment
    await Comment.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      user: "comment deleted",
    });
  } catch (error) {
    res.json(error);
  }
};

//update
const updateCommentCtrl = async (req, res, next) => {
  try {
    //find the comment
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(appErr("Comment not found"));
    }

    //check if the post belongs to the user
    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are not allowed to update this comment", 403));
    }

    //update
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        message: req.body.message,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: updatedComment,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

module.exports = {
  createCommentCtrl,
  commentDetailsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
