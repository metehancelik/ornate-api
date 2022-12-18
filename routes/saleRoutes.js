const router = require("express").Router();
const saleController = require("../controllers/saleController");

router
  .get("/", saleController.getAllSales)
  .get("/total", saleController.getTotalPrice)
  .get("/uiSales", saleController.getUISales)
  .get("/:userId", saleController.getSalesByUserId)
  .get("/sale/:saleId", saleController.getSaleById)
  .post("/", saleController.createSale)
  .put("/:saleId", saleController.updateSaleById)
  .delete("/:saleId", saleController.deleteSaleById);

module.exports = router;
