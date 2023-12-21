const mongoose = require("mongoose");
const houseSchema = new mongoose.Schema({
  client_username: {
    type: String,
  },
  client_camera_1: {
    type: String,
  },
  client_camera_2: {
    type: String,
  },
  client_camera_3: {
    type: String,
  },
  client_camera_4: {
    type: String,
  },
});

const House = mongoose.model("House", houseSchema);
module.exports = House;
