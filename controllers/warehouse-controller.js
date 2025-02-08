import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Helper functions for validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\+1 \(\d{3}\) \d{3}-\d{4}$/.test(phone);

/* ------------------ Get all warehouses from the database ------------------ */
async function getAllWarehouses(req, res) {
  let query = req.query.s;
  if (!query) {
    query = ""; //grabs all warehouses
  }
  try {
    const data = await knex("warehouses")
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .whereILike("warehouse_name", `${query}%`)
      .orWhereILike("address", `${query}%`)
      .orWhereILike("city", `%${query}%`)
      .orWhereILike("country", `%${query}%`)
      .orWhereILike("contact_name", `%${query}%`)
      .orWhereILike("contact_position", `%${query}%`)
      .orWhereILike("contact_phone", `%${query}%`)
      .orWhereILike("contact_email", `%${query}%`);

    res.json(data);
  } catch (error) {
    console.error("Error getting all warehouses:", error);
    return res
      .status(500)
      .json({ message: "Error getting all warehouses", error: error.message });
  }
}

/* --------------------------- Add a new warehouse -------------------------- */
async function addWarehouse(req, res) {
  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  // Validate required fields
  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  if (!isValidEmail(contact_email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate phone format
  if (!isValidPhone(contact_phone)) {
    return res.status(400).json({
      message: "Invalid phone number format (e.g., +1 (919) 797-2875)",
    });
  }

  try {
    // Insert the new warehouse and retrieve the data from this id
    const [newWarehouseId] = await knex("warehouses").insert(req.body);
    const newWarehouse = await knex("warehouses")
      .select([
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email",
      ])
      .where({ id: newWarehouseId })
      .first();

    return res.status(201).json(newWarehouse);
  } catch (error) {
    console.error("Error adding warehouse:", error);
    return res
      .status(500)
      .json({ message: "Error adding warehouse", error: error.message });
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

export { getAllWarehouses, addWarehouse, deleteWarehouse };
