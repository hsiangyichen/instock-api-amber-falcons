import express from "express";
const router = express.Router();

import * as inventoryController from "../controllers/inventory-controller.js";

//hit this at : http://localhost:8080/api/inventories?s={searchTerm}
router
  .route("/")
  .get(inventoryController.getAll)
  .post(inventoryController.createItem);

//hit this at : http://localhost:8080/api/inventories/2
router
  .route("/:id")
  .get(inventoryController.getById)
  .delete(inventoryController.deleteInventory)
  .put(inventoryController.editItem);

export default router;
