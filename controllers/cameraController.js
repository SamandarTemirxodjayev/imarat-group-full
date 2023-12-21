const Camera = require("../models/Camera");

exports.getAllCameras = async (req, res) => {
  try {
    const cameras = await Camera.find();
    return res.json(
      cameras.map((camera) => ({
        _id: camera._id,
        houseName: camera.houseName,
        cameraNumber1: camera.cameraNumber1,
        cameraNumber2: camera.cameraNumber2,
        cameraNumber3: camera.cameraNumber3,
        cameraNumber4: camera.cameraNumber4,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCameraById = async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id);
    if (!camera) {
      return res.status(404).json({ message: "Camera not found" });
    }
    return res.json({
      _id: camera._id,
      houseName: camera.houseName,
      cameraNumber1: camera.cameraNumber1,
      cameraNumber2: camera.cameraNumber2,
      cameraNumber3: camera.cameraNumber3,
      cameraNumber4: camera.cameraNumber4,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createCamera = async (req, res) => {
  try {
    const newCamera = new Camera({
      houseName: req.body.houseName,
      cameraNumber1: req.body.cameraNumber1,
      cameraNumber2: req.body.cameraNumber2,
      cameraNumber3: req.body.cameraNumber3,
      cameraNumber4: req.body.cameraNumber4,
    });
    const savedCamera = await newCamera.save();
    return res.json(savedCamera);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateCamera = async (req, res) => {
  try {
    const updatedCamera = await Camera.findByIdAndUpdate(
      req.params.id,
      {
        houseName: req.body.houseName,
        cameraNumber1: req.body.cameraNumber1,
        cameraNumber2: req.body.cameraNumber2,
        cameraNumber3: req.body.cameraNumber3,
        cameraNumber4: req.body.cameraNumber4,
      },
      { new: true }
    );
    if (!updatedCamera) {
      return res.status(404).json({ message: "Camera not found" });
    }
    return res.json({
      _id: updatedCamera._id,
      url: updatedCamera.url,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCamera = async (req, res) => {
  try {
    const deletedCamera = await Camera.findByIdAndDelete(req.params.id);
    if (!deletedCamera) {
      return res.status(404).json({ message: "Camera not found" });
    }
    return res.json({ message: "Camera deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
