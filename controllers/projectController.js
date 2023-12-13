const Project = require("../models/Project");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.json(
      projects.map((project) => ({
        _id: project._id,
        category: project.category,
        photo: project.photo,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json({
      _id: project._id,
      category: project.category,
      photo: project.photo,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createProject = async (req, res) => {
  try {
    const newProject = new Project({
      category: req.body.category,
      photo: req.body.photo,
    });
    const savedProject = await newProject.save();
    return res.json(savedProject);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        project: req.body.project,
        photo: req.body.photo,
      },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json({
      _id: updatedProject._id,
      project: updatedProject.project,
      photo: updatedProject.photo,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
