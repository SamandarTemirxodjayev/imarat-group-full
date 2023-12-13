const express = require("express");
const shortsController = require("../controllers/shortsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", shortsController.getAllShorts);
router.get("/:id", shortsController.getShortById);

// Protected routes (requires authentication)
router.use(authMiddleware.authenticateToken);

router.post("/", shortsController.createShort);
router.put("/:id", shortsController.updateShort);
router.delete("/:id", shortsController.deleteShort);

module.exports = router;
