const mongoose = require("mongoose");
const houseSchema = new mongoose.Schema({
  clientUsername: {
    type: String,
  },
  clientCamera: {
    type: String,
  },
});

const House = mongoose.model("House", houseSchema);
module.exports = House;
