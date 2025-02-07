import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

async function getAllWarehouses(_req, res) {
  try {
    const data = await knex("warehouses").select(
      "id",
      "warehouse_name",
      "address",
      "city",
      "country",
      "contact_name",
      "contact_position",
      "contact_phone",
      "contact_email"
    );
    res.json(data);
  } catch (error) {
    res.send(500).send("Error getting all warehouses");
  }
}

async function deleteWarehouse(req, res) {
  try {
    const deleted = await knex("warehouses").where({ id: req.params.id }).del();

    if (!deleted) {
      return res.status(404).json({
        message: `No warehouse found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      message: `Warehouse deleted successfully`,
    });
  } catch (error) {
    res.status(500).send(`Error deleting warehouse with id: ${req.params.id}`);
  }
}

export { getAllWarehouses, deleteWarehouse };
