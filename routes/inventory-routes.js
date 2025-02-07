import express from "express";
const router = express.Router();

import * as inventoryController from "../controllers/inventory-controller.js";

//hit this at : http://localhost:8080/api/inventory
router.route("/").get(inventoryController.getAll);

//hit this at : http://localhost:8080/api/inventory/2
router
  .route("/:id")
  .get(inventoryController.getById)
  .delete(inventoryController.deleteInventory);

export default router;
