import express from "express";
import {
  getAllWarehouses,
  addWarehouse,
  deleteWarehouse,
  getWarehouseDetails,
  editWarehouse
} from "../controllers/warehouse-controller.js";
import { getInventoriesById } from "../controllers/inventory-controller.js";

const router = express.Router();

router.route("/").get(getAllWarehouses).post(addWarehouse);

router.route("/:id").get(getWarehouseDetails).delete(deleteWarehouse).put(editWarehouse);

router.route("/:id/inventories").get(getInventoriesById);

export default router;
