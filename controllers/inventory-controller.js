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
export async function createItem(req, res) {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;
  const newItem = {
    item_name,
    description,
    category,
    status,
    quantity,
    warehouse_id,
  };
  if (!warehouse_id || !item_name || !description || !category || !status) {
    return res.status(400).json({
      message:
        "Missing properties in the request body. Please include warehouse_id, item_name, description, category, status, and quantity",
    });
  }
  if (typeof quantity !== typeof 1) {
    console.log(`Quantity is not a number: ${quantity}`);
    return res.status(400).send(`Error: Quantity is not a number.`);
  }
  try {
    const warehouseInfo = await knex("warehouses")
      .where({ id: warehouse_id })
      .first();
    if (!warehouseInfo) {
      console.log(`No warehouse found with id ${warehouse_id}.`);
      return res
        .status(400)
        .send(
          `Unable to add new item. Warehouse with id ${warehouse_id} does not exist in the warehouses table`
        );
    }
  } catch (error) {
    console.log(`Error finding warehouse with id ${warehouse_id}. ${error}`);
    return res
      .status(500)
      .send(`Unable to add new item. Warehouse id not valid`);
  }
  try {
    const itemId = await knex("inventories").insert(newItem);
    return res.status(201).send(`${itemId[0]}`);
  } catch (error) {
    console.log(`Unable to add an item with this body: ${newItem}. ${error}`);
    return res.status(500).send(`Unable to add new item`);
  }
}
