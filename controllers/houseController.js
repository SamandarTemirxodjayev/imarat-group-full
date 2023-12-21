const House = require("../models/House");

exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.find();
    return res.json(
      houses.map((house) => ({
        _id: house._id,
        clientUsername: house.clientUsername,
        clientCamera1: house.clientCamera1,
        clientCamera2: house.clientCamera2,
        clientCamera3: house.clientCamera3,
        clientCamera4: house.clientCamera4,
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
      clientUsername: house.clientUsername,
      clientCamera1: house.clientCamera1,
      clientCamera2: house.clientCamera2,
      clientCamera3: house.clientCamera3,
      clientCamera4: house.clientCamera4,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createHouse = async (req, res) => {
  try {
    const newHouse = new House({
      clientUsername: req.body.clientUsername,
      clientCamera1: req.body.clientCamera1,
      clientCamera2: req.body.clientCamera2,
      clientCamera3: req.body.clientCamera3,
      clientCamera4: req.body.clientCamera4,
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
        clientUsername: req.body.clientUsername,
        clientCamera1: req.body.clientCamera1,
        clientCamera2: req.body.clientCamera2,
        clientCamera3: req.body.clientCamera3,
        clientCamera4: req.body.clientCamera4,
      },
      { new: true }
    );
    if (!updatedHouse) {
      return res.status(404).json({ message: "House not found" });
    }
    return res.json({
      _id: updatedHouse._id,
      clientUsername: updatedHouse.clientUsername,
      clientCamera1: updatedHouse.clientCamera1,
      clientCamera2: updatedHouse.clientCamera2,
      clientCamera3: updatedHouse.clientCamera3,
      clientCamera4: updatedHouse.clientCamera4,
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
