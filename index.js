const express = require("express");
const cors = require("cors");
const { connection } = require("./configs/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { userController } = require("./controllers/UserController");
const { bookController } = require("./controllers/BooksController");
const morgon = require("morgan");
const { rateLimit } = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 8080;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

//Middlewares
app.use(limiter);
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

const connectWithRetry = async (retryCount) => {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      await connection;
      console.log("DB is connected");
      break;
    } catch (error) {
      console.error(
        `Error while connecting to the database (attempt ${attempt}):`,
        error
      );
      if (attempt < retryCount) {
        console.log(`Retrying in 2 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        console.log(
          `Max retry attempts reached. Unable to connect to the database.`
        );
        process.exit(1);
      }
    }
  }
};

app.listen(PORT, async () => {
  const maxAttempts = 3;
  try {
    await connectWithRetry(maxAttempts);
    console.log("Server is running");
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
});
