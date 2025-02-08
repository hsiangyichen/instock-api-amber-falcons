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
        "inventories.warehouse_id",
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
  //verify properties:
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
  //check if warehouse exists:
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
  // insert into inventories and return the record
  try {
    const itemId = await knex("inventories").insert(newItem);
    const data = await knex("inventories").where({ id: itemId[0] }).first();
    if (!data) {
      console.log(`No item with id ${itemId} found.`);
      return res.status(404).send(`No item with id ${itemId} found.`);
    }
    delete data.created_at;
    delete data.updated_at;

    res.status(201).json(data);
  } catch (error) {
    console.log(`Unable to add an item with this body: ${newItem}. ${error}`);
    return res.status(500).send(`Unable to add new item`);
  }
}

export async function deleteInventory(req, res) {
  const { id } = req.params;
  try {
    // Check if inventory exists before deleting
    const existingInventory = await knex("inventories").where({ id }).first();
    if (!existingInventory) {
      return res
        .status(404)
        .json({ message: `No inventory found with id: ${id}` });
    }

    // Delete the inventory item
    await knex("inventories").where({ id }).del();

    return res.status(200).json({
      message: `Inventory deleted successfully`,
      id,
    });
  } catch (error) {
    return res
      .status(500)
      .send(`Error deleting inventory with id: ${req.params.id}`);
  }
}

export async function editItem(req, res) {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;
  //verify properties:
  if (
    !req.params.id ||
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status
  ) {
    return res.status(400).json({
      message:
        "Missing properties in the request body. Please include warehouse_id, item_name, description, category, status, and quantity",
    });
  }
  if (typeof quantity !== typeof 1) {
    console.log(`Quantity is not a number: ${quantity}`);
    return res.status(400).send(`Error: Quantity is not a number.`);
  }

  //Check if item exists:
  try {
    const itemInfo = await knex("inventories")
      .where({ id: req.params.id })
      .first();
    if (!itemInfo) {
      console.log(`No item found with id ${req.params.id}.`);
      return res
        .status(400)
        .send(`Error: Item with id ${req.params.id} does not exist`);
    }
  } catch (error) {
    console.log(`Error finding item with id ${req.params.id}. ${error}`);
    return res
      .status(500)
      .send(`Error: Item with id ${req.params.id} not found`);
  }

  //check if warehouse exists:
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
    return res.status(500).send(`Error: Warehouse not found`);
  }

  try {
    const rowsUpdated = await knex("inventories")
      .where({ id: req.params.id })
      .update(req.body);
    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Item with ID ${req.params.id} not found`,
      });
    }
    const updatedItem = await knex("inventories").where({
      id: req.params.id,
    });

    res.status(200).json(updatedItem[0]);
  } catch (err) {
    console.log(`${err}`);
    res.status(500).send(`Error editing item with id ${req.params.id}`);
  }
}
