import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export async function getAll(req, res) {
  try {
    const data = await knex("inventories");
    res.json(data);
  } catch (err) {
    console.log(`Error getting inventory: ${err}`);
    res.status(500).send(`Error getting inventory`);
  }
}
