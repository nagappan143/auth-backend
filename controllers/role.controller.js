const db = require("../config/db");

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roles } = req.body;

    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Role ID required"
      });
    }

    if (!name || !roles || !Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        message: "Name and roles array required"
      });
    }

    // ✅ check role exists
    const checkRole = await db.query(
      "SELECT * FROM roles WHERE id = $1",
      [id]
    );

    if (checkRole.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found"
      });
    }

    // ✅ update role name
    const updatedRole = await db.query(
      "UPDATE roles SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    // ✅ delete old sub roles
    await db.query(
      "DELETE FROM sub_roles WHERE role_id = $1",
      [id]
    );

    // ✅ insert new sub roles
    const insertedRoles = [];

    for (let r of roles) {
      const result = await db.query(
        "INSERT INTO sub_roles (role_id, name) VALUES ($1,$2) RETURNING *",
        [id, r.name]
      );

      insertedRoles.push(result.rows[0]);
    }

    // ✅ response
    res.json({
      success: true,
      message: "Role updated successfully",
      data: {
        ...updatedRole.rows[0],
        roles: insertedRoles
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.createRole = async (req, res) => {
  try {
    console.log("Create Role API HIT");

    const { name, roles } = req.body;

    if (!name || !Array.isArray(roles)) {
      return res.status(400).json({
        success: false,
        message: "Name and roles array required"
      });
    }

    const roleResult = await db.query(
      "INSERT INTO roles (name) VALUES ($1) RETURNING *",
      [name]
    );

    const role = roleResult.rows[0];

    const insertedRoles = [];

    for (const r of roles) {
      const subRole = await db.query(
        "INSERT INTO sub_roles (role_id, name) VALUES ($1,$2) RETURNING *",
        [role.id, r.name]
      );

      insertedRoles.push(subRole.rows[0]);
    }

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: {
        ...role,
        roles: insertedRoles
      }
    });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getRoles = async (req, res) => {
  try {
    console.log("GET ROLES API HIT");

    // 1️⃣ get all roles
    const rolesResult = await db.query(
      "SELECT * FROM roles ORDER BY id ASC"
    );

    const roles = rolesResult.rows;

    // 2️⃣ attach sub roles
    for (let role of roles) {

      const subRolesResult = await db.query(
        "SELECT id, name FROM sub_roles WHERE role_id = $1",
        [role.id]
      );

      role.roles = subRolesResult.rows;
    }

    // 3️⃣ send response
    return res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });

  } catch (error) {
    console.error("GET ROLES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.updateRole = async (req, res) => {
  try {
    console.log("Update Role API HIT");

    const { id } = req.params;
    const { name, roles } = req.body;

    // ✅ validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Role id required"
      });
    }

    // ✅ update role name
    const roleResult = await db.query(
      "UPDATE roles SET name=$1 WHERE id=$2 RETURNING *",
      [name, id]
    );

    if (roleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found"
      });
    }

    const updatedRole = roleResult.rows[0];

    // ✅ delete old sub roles
    await db.query(
      "DELETE FROM sub_roles WHERE role_id=$1",
      [id]
    );

    // ✅ insert new sub roles
    const updatedSubRoles = [];

    if (Array.isArray(roles)) {
      for (const r of roles) {
        const subRole = await db.query(
          "INSERT INTO sub_roles (role_id, name) VALUES ($1,$2) RETURNING *",
          [id, r.name]
        );

        updatedSubRoles.push(subRole.rows[0]);
      }
    }

    // ✅ response
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: {
        ...updatedRole,
        roles: updatedSubRoles
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.deleteRole = async (req, res) => { };