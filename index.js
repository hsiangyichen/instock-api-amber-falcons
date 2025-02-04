import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Reached the server!");
});

app.listen(PORT, function () {
  console.log(`listening on http://localhost:${PORT}`);
});
