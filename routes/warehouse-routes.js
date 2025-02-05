import express from "express";
import { getAllWarehouses, getWarehouseDetails } from "../controllers/warehouse-controller.js";
const router = express.Router();

router.route("/").get(getAllWarehouses);
router.route("/:id").get(getWarehouseDetails)

export default router;
