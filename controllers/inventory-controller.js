import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export async function getAll(req, res) {
  try {
    //select all columns from inventories table, and the warehouse_name column from warehouses table
    const data = await knex("inventories")
      .select("inventories.*", "warehouses.warehouse_name")
      .join("warehouses", "warehouses.id", "warehouse_id");
    res.json(data);
  } catch (err) {
    console.log(`Error getting inventory: ${err}`);
    res.status(500).send(`Error getting inventory`);
  }
}

export async function getInventoriesById(req, res) {
  try {
    console.log("params id", req.params.id);
    const data = await knex("inventories")
      .where({ warehouse_id: req.params.id })
      .select("id", "item_name", "category", "status", "quantity");
    if (data.length === 0) {
      return res
        .status(404)
        .send(`could not find warehouse with id: ${req.params.id}`);
    }
    res.json(data);
  } catch (err) {
    console.log(
      `Error getting inventory with warehouseid: ${req.params.id}:${err}`
    );
    res.status(500).send(`Error getting inventory by id`);
  }
}
