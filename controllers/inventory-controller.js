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
