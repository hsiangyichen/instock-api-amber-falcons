import express from "express";
import {
  getAllWarehouses,
  addWarehouse,
  deleteWarehouse,
  getWarehouseDetails
} from "../controllers/warehouse-controller.js";
import { getInventoriesById } from "../controllers/inventory-controller.js";

const router = express.Router();

router.route("/").get(getAllWarehouses).post(addWarehouse);

router.route("/:id").get(getWarehouseDetails).delete(deleteWarehouse);

router.route("/:id/inventories").get(getInventoriesById);

export default router;
