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

async function getWarehouseDetails(req, res) {
  try {
      const { id } = req.params;
      const data = await knex("warehouses").where({ id: id });
      res.json(data);
  } catch (error) {
      res.send(500).send("Error getting warehouse details");
  }
}

export { getWarehouseDetails, getAllWarehouses };
