import { getPool } from "../db/config";
import sql from "mssql";
import { NewUser, UpdateUser, User } from "../types/user.types";

const TABLE = "Users";

export const UserRepository = {
  async getAll(): Promise<User[]> {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM ${TABLE}`);
    return result.recordset;
  },

  async getById(id: number): Promise<User | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM ${TABLE} WHERE id = @id`);
    return result.recordset[0] ?? null;
  },

  async getByEmail(email: string): Promise<User | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input("email", sql.NVarChar(255), email)
      .query(`SELECT * FROM ${TABLE} WHERE email = @email`);
    return result.recordset[0] ?? null;
  },

  async create(user: NewUser): Promise<User> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("first_name", sql.NVarChar(100), user.first_name)
      .input("last_name", sql.NVarChar(100), user.last_name)
      .input("email", sql.NVarChar(255), user.email)
      .input("password", sql.NVarChar(255), user.password)
      .input("phone_number", sql.NVarChar(20), user.phone_number ?? null)
      .input("verification_code", sql.NChar(6), user.verification_code ?? null)
      .input("role", sql.NVarChar(10), user.role ?? "student")
      .query(`INSERT INTO ${TABLE} (first_name,last_name,email,password,phone_number,verification_code,role) OUTPUT INSERTED.* VALUES (@first_name,@last_name,@email,@password,@phone_number,@verification_code,@role)`);
    return result.recordset[0];
  },

  async update(id: number, updates: UpdateUser): Promise<User | null> {
    const pool = await getPool();
    const sets: string[] = [];
    const req = pool.request();

    if (updates.first_name !== undefined) {
      sets.push("first_name = @first_name");
      req.input("first_name", sql.NVarChar(100), updates.first_name);
    }

    if (updates.last_name !== undefined) {
      sets.push("last_name = @last_name");
      req.input("last_name", sql.NVarChar(100), updates.last_name);
    }

    if (updates.email !== undefined) {
      sets.push("email = @email");
      req.input("email", sql.NVarChar(255), updates.email);
    }

    if (updates.password !== undefined) {
      sets.push("password = @password");
      req.input("password", sql.NVarChar(255), updates.password);
    }

    if (updates.phone_number !== undefined) {
      sets.push("phone_number = @phone_number");
      req.input("phone_number", sql.NVarChar(20), updates.phone_number);
    }

    if (updates.role !== undefined) {
      sets.push("role = @role");
      req.input("role", sql.NVarChar(10), updates.role);
    }

    if (updates.is_active !== undefined) {
      sets.push("is_active = @is_active");
      req.input("is_active", sql.Bit, updates.is_active ? 1 : 0);
    }

    if (sets.length === 0) {
      return await this.getById(id);
    }

    req.input("id", sql.Int, id);

    const query = `
      UPDATE ${TABLE}
      SET ${sets.join(", ")}
      WHERE id = @id;

      SELECT * FROM ${TABLE} WHERE id = @id;
    `;

    const result = await req.query(query);
    return result.recordset[0] ?? null;
  },

  async deleteUser(id: number): Promise<void> {
    const pool = await getPool();
    await pool.request().input("id", sql.Int, id).query(`DELETE FROM ${TABLE} WHERE id = @id`);
  },

  async verifyCode(email: string, code: string): Promise<User | null> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("email", sql.NVarChar(255), email)
      .input("code", sql.NChar(6), code)
      .query(`UPDATE ${TABLE} SET is_verified = 1 WHERE email = @email AND verification_code = @code; SELECT * FROM ${TABLE} WHERE email = @email`);
    return result.recordset[0] ?? null;
  }
};
