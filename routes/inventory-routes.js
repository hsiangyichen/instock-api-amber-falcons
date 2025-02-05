import express from "express";
const router = express.Router();

import * as inventoryController from "../controllers/inventory-controller.js";

//hit this at : http://localhost:8080/api/inventory
router.route("/").get(inventoryController.getAll);

export default router;
