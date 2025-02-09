import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// All warehouse routes
import warehouseRoutes from "./routes/warehouse-routes.js";
app.use("/api/warehouses", warehouseRoutes);

// All inventory Routes
import inventoryRoutes from "./routes/inventory-routes.js";
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("Reached the server!");
});

app.listen(PORT, function () {
  console.log(`listening on http://localhost:${PORT}`);
});
