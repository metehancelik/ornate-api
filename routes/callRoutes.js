const router = require("express").Router();
const callController = require("../controllers/callController");

router
  .get("/", callController.getAllCalls)
  .get("/:userId", callController.getCallsByUserId)
  .get("/call/:id", callController.getCallById)
  .post("/", callController.createCall)
  .put("/:callId", callController.updateCallById);

module.exports = router;
