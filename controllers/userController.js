const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const usersWithoutPassword = users.map(user => ({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
    }));
    return res.json(usersWithoutPassword);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      fullName: req.body.fullName,
      username: req.body.username,
      password: req.body.password,
    });
    const savedUser = await newUser.save();
    const userWithoutPassword = {
      _id: savedUser._id,
      fullName: savedUser.fullName,
      username: savedUser.username,
    };
    return res.json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName: req.body.fullName,
        username: req.body.username,
        password: req.body.password,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userWithoutPassword = {
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
    };
    return res.json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
