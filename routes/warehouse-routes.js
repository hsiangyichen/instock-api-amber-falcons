import express from "express";
import {
  getAllWarehouses,
  deleteWarehouse,
} from "../controllers/warehouse-controller.js";
import { getInventoriesById } from "../controllers/inventory-controller.js";

const router = express.Router();

router.route("/").get(getAllWarehouses);

router.route("/:id").delete(deleteWarehouse);

router.route("/:id/inventories").get(getInventoriesById);

export default router;
