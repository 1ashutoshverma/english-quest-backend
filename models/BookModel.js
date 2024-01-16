const { default: mongoose } = require("mongoose");

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  createrId: { type: mongoose.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BookModel = mongoose.model("book", bookSchema);

module.exports = { BookModel };
