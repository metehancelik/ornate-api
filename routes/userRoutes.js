const router = require("express").Router();
const userController = require("./../controllers/userController");

router
  .get("/", userController.getMe)
  .get("/all", userController.getAllUsers)
  .post("/", userController.updateUserProfile)
  .patch("/", userController.updateUserPassword);

module.exports = router;
