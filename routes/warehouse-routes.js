import express from "express";
import {
  getAllWarehouses,
  deleteWarehouse,
} from "../controllers/warehouse-controller.js";
const router = express.Router();

router.route("/").get(getAllWarehouses);

router.route("/:id").delete(deleteWarehouse);

export default router;
