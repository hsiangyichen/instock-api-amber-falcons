import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

/* ------------------ Get all warehouses from the database ------------------ */
async function getAllWarehouses(_req, res) {
  try {
    const data = await knex("warehouses");
    return res.json(data);
  } catch (error) {
    console.error("Error getting all warehouses:", error);
    return res
      .status(500)
      .json({ message: "Error getting all warehouses", error: error.message });
  }
}

/* ------------------------ Delete a warehouse by id ------------------------ */
async function deleteWarehouse(req, res) {
  const { id } = req.params;
  try {
    // Check if warehouse exists before deleting
    const existingWarehouse = await knex("warehouses").where({ id }).first();
    if (!existingWarehouse) {
      return res
        .status(404)
        .json({ message: `No warehouse found with id: ${id}` });
    }

    // Delete the warehouse
    await knex("warehouses").where({ id }).del();

    return res.status(200).json({
      message: `Warehouse with id ${id} deleted successfully`,
    });
  } catch (error) {
    console.error(`Error deleting warehouse with id ${id}:`, error);
    return res.status(500).json({
      message: `Error deleting warehouse with id: ${id}`,
      error: error.message,
    });
  }
}

export { getAllWarehouses, deleteWarehouse };
