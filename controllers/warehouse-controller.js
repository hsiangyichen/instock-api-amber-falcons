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

/* ------------------------ Get warehouse details by id ------------------------ */
async function getWarehouseDetails(req, res) {
  const { id } = req.params;
  try {
    const data = await knex("warehouses").where({ id }).first();
    if (!data) {
      return res.status(404).send(`could not find warehouse with id: ${id}`);
    }
    res.json(data);
  } catch (error) {
    res.send(500).send("Error getting warehouse details");
  }
}

/* ------------------------ Update warehouse by id ------------------------ */
async function editWarehouse(req, res) {
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

  // Verify required properties
  if (
    !req.params.id ||
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({
      message:
        "Missing required fields. Please include warehouse_name, address, city, country, contact_name, contact_position, contact_phone, and contact_email",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contact_email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  // Validate phone format (assuming North American format)
  const phoneRegex = /^\+?1?\d{10,}$/;
  if (!phoneRegex.test(contact_phone.replace(/[^0-9]/g, ""))) {
    return res.status(400).json({
      message: "Invalid phone number format",
    });
  }

  // Check if warehouse exists
  try {
    const warehouseInfo = await knex("warehouses")
      .where({ id: req.params.id })
      .first();

    if (!warehouseInfo) {
      console.log(`No warehouse found with id ${req.params.id}`);
      return res.status(404).json({
        message: `Warehouse with id ${req.params.id} does not exist`,
      });
    }
  } catch (error) {
    console.log(`Error finding warehouse with id ${req.params.id}: ${error}`);
    return res.status(500).json({
      message: "Failed to verify warehouse existence",
    });
  }

  // Update warehouse
  try {
    const rowsUpdated = await knex("warehouses")
      .where({ id: req.params.id })
      .update({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      });

    if (rowsUpdated === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    // Fetch and return updated warehouse
    const updatedWarehouse = await knex("warehouses")
      .where({ id: req.params.id })
      .first();

    res.status(200).json(updatedWarehouse);
  } catch (err) {
    console.log(`Error updating warehouse: ${err}`);
    res.status(500).json({
      message: `Error updating warehouse with id ${req.params.id}`,
    });
  }
}

export {
  getWarehouseDetails,
  getAllWarehouses,
  addWarehouse,
  deleteWarehouse,
  editWarehouse,
};
