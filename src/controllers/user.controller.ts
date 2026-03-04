import { Request, Response } from "express";
import { getPool } from "../db/config";
import sql from "mssql";

export const UserController = {
  async list(_: Request, res: Response) {
    try {
      const pool = await getPool();
      const result = await pool.request().query("SELECT * FROM Users");
      return res.json(result.recordset);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async get(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    try {
      const pool = await getPool();
      const result = await pool.request().input("id", sql.Int, id).query("SELECT * FROM Users WHERE id = @id");
      const user = result.recordset[0];
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async create(req: Request, res: Response) {
    const { first_name, last_name, email, password, phone_number, verification_code, role } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const pool = await getPool();
      await pool
        .request()
        .input("first_name", sql.NVarChar(100), first_name)
        .input("last_name", sql.NVarChar(100), last_name)
        .input("email", sql.NVarChar(255), email)
        .input("password", sql.NVarChar(255), password)
        .input("phone_number", sql.NVarChar(20), phone_number ?? null)
        .input("verification_code", sql.NChar(6), verification_code ?? null)
        .input("role", sql.NVarChar(10), role ?? "student")
        .query(
          `INSERT INTO Users (first_name,last_name,email,password,phone_number,verification_code,role)
           VALUES (@first_name,@last_name,@email,@password,@phone_number,@verification_code,@role)`
        );

      return res.status(201).json({ message: "User created successfully" });
    } catch (err: any) {
      console.error(err);
      if (err && err.number === 2627) {
        return res.status(409).json({ message: "Duplicate entry" });
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const { first_name, last_name, email, password, phone_number, role, is_active } = req.body;

    try {
      const pool = await getPool();
      const sets: string[] = [];
      const reqPool = pool.request();

      if (first_name !== undefined) { sets.push("first_name = @first_name"); reqPool.input("first_name", sql.NVarChar(100), first_name); }
      if (last_name !== undefined) { sets.push("last_name = @last_name"); reqPool.input("last_name", sql.NVarChar(100), last_name); }
      if (email !== undefined) { sets.push("email = @email"); reqPool.input("email", sql.NVarChar(255), email); }
      if (password !== undefined) { sets.push("password = @password"); reqPool.input("password", sql.NVarChar(255), password); }
      if (phone_number !== undefined) { sets.push("phone_number = @phone_number"); reqPool.input("phone_number", sql.NVarChar(20), phone_number); }
      if (role !== undefined) { sets.push("role = @role"); reqPool.input("role", sql.NVarChar(10), role); }
      if (is_active !== undefined) { sets.push("is_active = @is_active"); reqPool.input("is_active", sql.Bit, is_active ? 1 : 0); }

      if (sets.length === 0) return res.status(400).json({ message: "No fields to update" });

      reqPool.input("id", sql.Int, id);
      const query = `UPDATE Users SET ${sets.join(", ")} WHERE id = @id`;
      const result = await reqPool.query(query);

      if (result.rowsAffected[0] === 0) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    try {
      const pool = await getPool();
      const result = await pool.request().input("id", sql.Int, id).query("DELETE FROM Users WHERE id = @id");

      if (result.rowsAffected[0] === 0) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });
    try {
      const pool = await getPool();
      const result = await pool.request().input("email", sql.NVarChar(255), email).query("SELECT * FROM Users WHERE email = @email");
      const user = result.recordset[0];
      if (!user || user.password !== password) return res.status(401).json({ message: "Invalid credentials" });
      delete user.password;
      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async verifyCode(req: Request, res: Response) {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Missing fields" });
    try {
      const pool = await getPool();
      const result = await pool
        .request()
        .input("email", sql.NVarChar(255), email)
        .input("code", sql.NChar(6), code)
        .query("UPDATE Users SET is_verified = 1 WHERE email = @email AND verification_code = @code; SELECT * FROM Users WHERE email = @email");

      const user = result.recordset[0];
      if (!user) return res.status(400).json({ message: "Invalid code or email" });
      delete user.password;
      return res.status(200).json({ message: "User verified successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default UserController;