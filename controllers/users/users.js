const User = require("../../model/user/User");
const bcrypt = require("bcryptjs");
const appErr = require("../../utils/appErr");

//register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  //check if field is empty
  if (!fullname || !email || !password) {
    return next(appErr("All fields are required"));
  }
  try {
    //1.check if user exist(email)
    const userFound = await User.findOne({ email });

    //throw an error
    if (userFound) {
      return next(appErr("User Alredy Exists"));
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    //create the user
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};

//login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(appErr("All fields are required"));
  }
  try {
    //check if email exists
    const userFound = await User.findOne({ email });

    //if email does not exist throw an error
    if (!userFound) {
      return next(appErr("Invalid Login Credentials"));
    }

    //verify the user password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    //if pass does not match throw an error
    if (!isPasswordValid) {
      return next(appErr("Invalid Login Credentials"));
    }

    //here all the login credentials are verified
    //save the user into session
    req.session.userAuth = userFound._id;
    console.log(req.session);
    res.json({
      status: "success",
      data: userFound,
    });
  } catch (error) {
    res.json(error);
  }
};

//details
const userDetailsCtrl = async (req, res) => {
  try {
    //get userID from params
    const userId = req.params.id;

    //find the user
    const user = await User.findById(userId);
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};

//profile
const profileCtrl = async (req, res) => {
  try {
    //get the login user
    const userID = req.session.userAuth;

    //find the user
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments");

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error);
  }
};

//upload profile photo
const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    //1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    //2. check if the user is found
    if (!userFound) {
      return next(appErr("User not found", 403));
    }

    //3. update profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: "You have successfully updated your profile picture",
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

//update cover image
const uploadConverImgCtrl = async (req, res) => {
  try {
    //1. find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    //2. check if the user is found
    if (!userFound) {
      return next(appErr("User not found", 403));
    }

    //3. update profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: "You have successfully updated your profile picture",
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

//update Password
const updatePasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    //check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);

      //update user
      await User.findByIdAndUpdate(
        req.params.id,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        user: "Password has been changed successfully",
      });
    }
  } catch (error) {
    return next(appErr("Please provide password field"));
  }
};

//update user
const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  try {
    //check if the email is already taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(appErr("Email is Taken", 404));
      }
    }

    //update User
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return next(appErr(error.message));
  }
};

const logoutCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "User logout",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadConverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
