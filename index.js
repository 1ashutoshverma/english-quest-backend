const express = require("express");
const cors = require("cors");
const { connection } = require("./configs/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { userController } = require("./controllers/UserController");
const { authorization } = require("./middlewares/authorization");
const { bookController } = require("./controllers/BooksController");
const morgon = require("morgan");

const app = express();
const PORT = process.env.PORT || 8080;

//Middlewares
app.use(morgon("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_FRONTEND_LINK,
    credentials: true,
  })
);
app.use(express.json());

//Basic route to check server is running or not
app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

//other routes
app.use("/api", userController);
app.use("/books", bookController);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("DB is connected");
  } catch (error) {
    console.log("Error while connection to db");
    console.log(error);
  }
  console.log("server is running");
});
