const express = require("express");
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);

// Protected routes (requires authentication)
router.use(authMiddleware.authenticateToken);

router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

module.exports = router;
