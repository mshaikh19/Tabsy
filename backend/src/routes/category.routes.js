const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validators/category.validator");

// All category routes require authentication
router.use(authenticate);

router.get("/", categoryController.getCategories);
router.post("/", validate(createCategorySchema), categoryController.createCategory);
router.put("/:id", validate(updateCategorySchema), categoryController.updateCategory);

module.exports = router;
