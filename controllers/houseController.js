const House = require("../models/House");

exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.find();
    return res.json(
      houses.map((house) => ({
        _id: house._id,
        client_username: house.client_username,
        client_camera_1: house.client_camera_1,
        client_camera_2: house.client_camera_2,
        client_camera_3: house.client_camera_3,
        client_camera_4: house.client_camera_4,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    return res.json({
      _id: house._id,
      client_username: house.client_username,
      client_camera_1: house.client_camera_1,
      client_camera_2: house.client_camera_2,
      client_camera_3: house.client_camera_3,
      client_camera_4: house.client_camera_4,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createHouse = async (req, res) => {
  try {
    const newHouse = new House({
      client_username: req.body.client_username,
      client_camera_1: req.body.client_camera_1,
      client_camera_2: req.body.client_camera_2,
      client_camera_3: req.body.client_camera_3,
      client_camera_4: req.body.client_camera_4,
    });
    const savedHouse = await newHouse.save();
    return res.json(savedHouse);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateHouse = async (req, res) => {
  try {
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      {
        client_username: req.body.client_username,
        client_camera_1: req.body.client_camera_1,
        client_camera_2: req.body.client_camera_2,
        client_camera_3: req.body.client_camera_3,
        client_camera_4: req.body.client_camera_4,
      },
      { new: true }
    );
    if (!updatedHouse) {
      return res.status(404).json({ message: "House not found" });
    }
    return res.json({
      _id: updatedHouse._id,
      client_username: updatedHouse.client_username,
      client_camera_1: updatedHouse.client_camera_1,
      client_camera_2: updatedHouse.client_camera_2,
      client_camera_3: updatedHouse.client_camera_3,
      client_camera_4: updatedHouse.client_camera_4,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteHouse = async (req, res) => {
  try {
    const deletedHouse = await House.findByIdAndDelete(req.params.id);
    if (!deletedHouse) {
      return res.status(404).json({ message: "House not found" });
    }
    return res.json({ message: "House deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
