import express from "express";
import { getAllWarehouses } from "../controllers/warehouse-controller.js";
const router = express.Router();

router.route("/").get(getAllWarehouses);

export default router;
