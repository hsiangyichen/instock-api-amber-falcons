import express from "express";
<<<<<<< HEAD
import {
  getAllWarehouses,
  addWarehouse,
  deleteWarehouse,
} from "../controllers/warehouse-controller.js";
import { getInventoriesById } from "../controllers/inventory-controller.js";

const router = express.Router();

router.route("/").get(getAllWarehouses).post(addWarehouse);

router.route("/:id").delete(deleteWarehouse);

router.route("/:id/inventories").get(getInventoriesById);
=======
import { getAllWarehouses, getWarehouseDetails } from "../controllers/warehouse-controller.js";
const router = express.Router();

router.route("/").get(getAllWarehouses);
router.route("/:id").get(getWarehouseDetails)
>>>>>>> e685132 (added warehouse details in controller and routes)

export default router;
