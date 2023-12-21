const mongoose = require("mongoose");
const cameraSchema = new mongoose.Schema({
  url: {
    type: String,
  },
});
const Camera = mongoose.model("Camera", cameraSchema);
module.exports = Camera;
