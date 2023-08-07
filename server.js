require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/users/users");
const session = require("express-session");
const postRoutes = require("./routes/posts/posts");
const MongoStore = require("connect-mongo");
const commentRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
require("./config/dbConnect");

const app = express();

//middlewares
//----------

app.use(express.json()); //pass the incoming data
app.use(
  //session config
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, //1day
    }),
  })
);

//users route
//----------
app.use("/api/v1/users", userRoutes);

//----------
//posts route
//----------
app.use("/api/v1/posts", postRoutes);

//----------
//comments
//----------
app.use("/api/v1/comments", commentRoutes);

//Error handler middlewares
app.use(globalErrHandler);
//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is running on PORT ${PORT}`));
