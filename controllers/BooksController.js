const express = require("express");
const { BookModel } = require("../models/BookModel");
const { authorization } = require("../middlewares/authorization");

const bookController = express.Router();

bookController.get(
  "/",
  authorization(["VIEW_ALL", "VIEWER", "CREATER"]),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const roleQuery = req.query.role;

      let query = {};

      // Filtering option
      if (req.query.genre) {
        query.genre = req.query.genre;
      }

      // Show books created 10 mins ago or earlier
      if (req.query.old) {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        query.createdAt = { $lt: `${tenMinutesAgo}` };
      }

      // Show books created less than 10 minutes ago
      if (req.query.new) {
        const lessThanTenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        query.createdAt = { $gt: lessThanTenMinutesAgo };
      }

      // Sorting logic
      const sortOptions = {};
      if (req.query.sort) {
        // Assuming sort is a query parameter containing the field to sort by
        sortOptions[req.query.sort] = req.query.order === "desc" ? -1 : 1;
      }

      // Searching logic for title
      if (req.query.title) {
        // Use a regex for partial matching
        query.title = { $regex: new RegExp(req.query.title, "i") };
      }

      //search for author
      if (req.query.author) {
        // Use a regex for partial matching
        query.author = { $regex: new RegExp(req.query.author, "i") };
      }

      //for VIEW_ALL and VIEWER or CREATER
      if (roleQuery === "CREATER" || roleQuery === "VIEW") {
        query.createrId = req.userId;
      }

      const totalItems = await BookModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / pageSize);

      const data = await BookModel.find(query)
        .sort(sortOptions)
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      res.json({
        data,
        page,
        totalPages,
        totalItems,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

bookController.post("/", authorization(["CREATER"]), async (req, res) => {
  const userId = req.userId;

  const { title, author, genre } = req.body;
  try {
    if (title && author && genre) {
      const data = await BookModel.create({ ...req.body, createrId: userId });
      res.json({ message: "Book added successfully" });
    } else {
      return res.status(400).json({ message: "please fill all the details" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

bookController.patch(
  "/update/:id",
  authorization(["CREATER"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const createrId = req.userId;

      const data = await BookModel.findOneAndUpdate(
        { _id: id, createrId },
        { ...req.body }
      );
      if (data) {
        res.json({ message: "Book updated successfully" });
      } else {
        res.status(400).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

bookController.delete(
  "/delete/:id",
  authorization(["CREATER"]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const createrId = req.userId;

      const data = await BookModel.findOneAndDelete({ _id: id, createrId });
      if (data) {
        res.json({ message: "Book deleted successfully" });
      } else {
        res.status(400).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = { bookController };
