const mongoose = require("mongoose");
const cameraSchema = new mongoose.Schema({
  houseName: {
    type: String,
  },
  cameraNumber1: {
    type: String,
  },
  cameraNumber2: {
    type: String,
  },
  cameraNumber3: {
    type: String,
  },
  cameraNumber4: {
    type: String,
  },
});
const Camera = mongoose.model("Camera", cameraSchema);
module.exports = Camera;
