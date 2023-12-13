const Short = require("../models/Shorts");

exports.getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find();
    return res.json(
      shorts.map((short) => ({
        _id: short._id,
        url: short.url,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getShortById = async (req, res) => {
  try {
    const short = await Short.findById(req.params.id);
    if (!short) {
      return res.status(404).json({ message: "Short not found" });
    }
    return res.json({
      _id: short._id,
      url: short.url,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createShort = async (req, res) => {
  try {
    const newShort = new Short({
      url: req.body.url,
    });
    const savedShort = await newShort.save();
    return res.json(savedShort);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateShort = async (req, res) => {
  try {
    const updatedShort = await Short.findByIdAndUpdate(
      req.params.id,
      {
        url: req.body.url,
      },
      { new: true }
    );
    if (!updatedShort) {
      return res.status(404).json({ message: "Short not found" });
    }
    return res.json({
      _id: updatedShort._id,
      url: updatedShort.url,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteShort = async (req, res) => {
  try {
    const deletedShort = await Short.findByIdAndDelete(req.params.id);
    if (!deletedShort) {
      return res.status(404).json({ message: "Short not found" });
    }
    return res.json({ message: "Short deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
