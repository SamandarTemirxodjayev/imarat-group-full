const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  photo: {
    type: String,
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
