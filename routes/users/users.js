const express = require("express");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadConverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");

const userRoutes = express.Router();
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const multer = require("multer");

//instance of multer
const upload = multer(storage);

//POST/register
userRoutes.post("/register", registerCtrl);

//POST/login
userRoutes.post("/login", loginCtrl);

//GET/api/v1/profile
userRoutes.get("/profile", protected, profileCtrl);

//PUT/api/v1/profile-photo-upload/
userRoutes.put(
  "/profile-photo-upload/",
  protected,
  upload.single("profile"),
  uploadProfilePhotoCtrl
);

//PUT/api/v1/cover-photo-upload/:id
userRoutes.put(
  "/cover-photo-upload/",
  protected,
  upload.single("profile"),
  uploadConverImgCtrl
);

//PUT/update-password/:id
userRoutes.put("/update-password/:id", updatePasswordCtrl);

//PUT/update/:id
userRoutes.put("/update/:id", updateUserCtrl);

//GET/:id
userRoutes.get("/:id", userDetailsCtrl);

//GET/logout
userRoutes.get("/logout", logoutCtrl);

module.exports = userRoutes;
