const router = require("express").Router();
const commissionController = require("../controllers/commissionController");

router
  .post("/", commissionController.getAllCommissions)

module.exports = router;
