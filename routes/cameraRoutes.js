const express = require("express");
const cameraController = require("../controllers/cameraController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", cameraController.getAllCameras);
router.get("/:id", cameraController.getCameraById);

// Protected routes (requires authentication)
router.use(authMiddleware.authenticateToken);

router.post("/", cameraController.createCamera);
router.put("/:id", cameraController.updateCamera);
router.delete("/:id", cameraController.deleteCamera);

module.exports = router;
