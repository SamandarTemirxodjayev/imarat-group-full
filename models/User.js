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
});
const User = mongoose.model("User", userSchema);
module.exports = User;
