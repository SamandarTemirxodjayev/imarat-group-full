const House = require("../models/House");

exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.find();
    return res.json(
      houses.map((house) => ({
        _id: house._id,
        clientUsername: house.clientUsername,
        clientCamera: house.clientCamera,
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
      clientCamera: house.clientCamera,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createHouse = async (req, res) => {
  try {
    const newHouse = new House({
      clientUsername: req.body.clientUsername,
      clientCamera: req.body.clientCamera,
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
        clientCamera: req.body.clientCamera,
      },
      { new: true }
    );
    if (!updatedHouse) {
      return res.status(404).json({ message: "House not found" });
    }
    return res.json({
      _id: updatedHouse._id,
      clientUsername: updatedHouse.clientUsername,
      clientCamera: updatedHouse.clientCamera,
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
