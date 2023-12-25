const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  house: {
    type: String,
  },
  houseDesc: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cameraOne: {
    type: String,
  },
  cameraTwo: {
    type: String,
  },
  cameraThree: {
    type: String,
  },
  cameraFour: {
    type: String,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
