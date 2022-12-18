const router = require("express").Router();
const invoiceController = require("../controllers/invoiceController");

router
  .get("/", invoiceController.getPDF)
  .post("/", invoiceController.createPDF)

module.exports = router;
