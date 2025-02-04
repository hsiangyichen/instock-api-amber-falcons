import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import warehouseRoutes from "./routes/warehouse-routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Reached the server!");
});

// All warehouse routes
app.use("/api/warehouses", warehouseRoutes);

app.listen(PORT, function () {
  console.log(`listening on http://localhost:${PORT}`);
});
