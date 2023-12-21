const express = require("express");
const houseController = require("../controllers/houseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", houseController.getAllHouses);
router.get("/:id", houseController.getHouseById);

// Protected routes (requires authentication)
router.use(authMiddleware.authenticateToken);

router.post("/", houseController.createHouse);
router.put("/:id", houseController.updateHouse);
router.delete("/:id", houseController.deleteHouse);

module.exports = router;
