const express = require("express");
const vacancyController = require("../controllers/vacancyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", vacancyController.getAllVacancies);
router.get("/:id", vacancyController.getVacancyById);

// Protected routes (requires authentication)
router.use(authMiddleware.authenticateToken);

router.post("/", vacancyController.createVacancy);
router.put("/:id", vacancyController.updateVacancy);
router.delete("/:id", vacancyController.deleteVacancy);

module.exports = router;
