import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

async function getAllWarehouses(_req, res) {
  try {
    const data = await knex("warehouses");
    res.json(data);
  } catch (error) {
    res.send(500).send("Error getting all warehouses");
  }
}

export { getAllWarehouses };
