const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const usersWithoutPassword = users.map((user) => ({
      _id: user._id,
      house: user.house,
      firstName: user.firstName,
      lastName: user.lastName,
      houseDesc: user.houseDesc,
      username: user.username,
      password: user.password,
      cameraOne: user.cameraOne,
      cameraTwo: user.cameraTwo,
      cameraThree: user.cameraThree,
      cameraFour: user.cameraFour,
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
      house: user.house,
      firstName: user.firstName,
      lastName: user.lastName,
      houseDesc: user.houseDesc,
      username: user.username,
      password: user.password,
      cameraOne: user.cameraOne,
      cameraTwo: user.cameraTwo,
      cameraThree: user.cameraThree,
      cameraFour: user.cameraFour,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      house: req.body.house,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      houseDesc: req.body.houseDesc,
      username: req.body.username,
      password: req.body.password,
      cameraOne: req.body.cameraOne,
      cameraTwo: req.body.cameraTwo,
      cameraThree: req.body.cameraThree,
      cameraFour: req.body.cameraFour,
    });
    const savedUser = await newUser.save();
    const userWithoutPassword = {
      _id: savedUser._id,
      house: req.body.house,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      houseDesc: req.body.houseDesc,
      username: req.body.username,
      cameraOne: req.body.cameraOne,
      cameraTwo: req.body.cameraTwo,
      cameraThree: req.body.cameraThree,
      cameraFour: req.body.cameraFour,
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
        house: req.body.house,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        houseDesc: req.body.houseDesc,
        username: req.body.username,
        password: req.body.password,
        cameraOne: req.body.cameraOne,
        cameraTwo: req.body.cameraTwo,
        cameraThree: req.body.cameraThree,
        cameraFour: req.body.cameraFour,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userWithoutPassword = {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      house: updatedUser.house,
      houseDesc: updatedUser.houseDesc,
      username: updatedUser.username,
      cameraOne: updatedUser.cameraOne,
      cameraTwo: updatedUser.cameraTwo,
      cameraThree: updatedUser.cameraThree,
      cameraFour: updatedUser.cameraFour,
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
