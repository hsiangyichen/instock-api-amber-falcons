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

export async function getById(req, res) {
  const { id } = req.params;
  try {
    const data = await knex("inventories")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .join("warehouses", "warehouses.id", "warehouse_id")
      .where({ "inventories.id": id })
      .first();
    if (!data) {
      console.log(`No item with id ${id} found.`);
      return res.status(404).send(`No item with id ${id} found.`);
    }
    res.status(200).json(data);
  } catch (err) {
    console.log(`Error getting inventory item with id ${id}: ${err}`);
    res.status(500).send(`Error getting inventory item with id ${id}`);
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
