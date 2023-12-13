const mongoose = require("mongoose");
const shortSchema = new mongoose.Schema({
  url: {
    type: String,
  },
});
const Shorts = mongoose.model("Shorts", shortSchema);
module.exports = Shorts;
