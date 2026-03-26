const db = require("../config/db");

const getRoleByName = async (name) => {
  const result = await db.query(
    "SELECT * FROM roles WHERE name = $1",
    [name]
  );

  return result.rows[0];
};

module.exports = {
  getRoleByName
};