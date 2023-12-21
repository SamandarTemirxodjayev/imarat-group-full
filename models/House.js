const mongoose = require("mongoose");
const houseSchema = new mongoose.Schema({
  clientUsername: {
    type: String,
  },
  clientCamera1: {
    type: String,
  },
  clientCamera2: {
    type: String,
  },
  clientCamera3: {
    type: String,
  },
  clientCamera4: {
    type: String,
  },
});

const House = mongoose.model("House", houseSchema);
module.exports = House;
