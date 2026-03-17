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
      .query(`SELECT * FROM ${TABLE} WHERE id=@id`);
    return result.recordset[0] ?? null;
  },

  async getByEmail(email: string): Promise<User | null> {
    const pool = await getPool();
    const result = await pool.request()
      .input("email", sql.NVarChar(255), email)
      .query(`SELECT * FROM ${TABLE} WHERE email=@email`);
    return result.recordset[0] ?? null;
  },

  async create(user: NewUser): Promise<User> {
    const pool = await getPool();

    const result = await pool.request()
      .input("first_name", sql.NVarChar(100), user.first_name)
      .input("last_name", sql.NVarChar(100), user.last_name)
      .input("email", sql.NVarChar(255), user.email)
      .input("password", sql.NVarChar(255), user.password)
      .input("phone_number", sql.NVarChar(20), user.phone_number ?? null)
      .input("role", sql.NVarChar(10), user.role ?? "student")
      .query(`
        INSERT INTO ${TABLE}
        (first_name,last_name,email,password,phone_number,role)
        OUTPUT INSERTED.*
        VALUES
        (@first_name,@last_name,@email,@password,@phone_number,@role)
      `);

    return result.recordset[0];
  },

  async setVerificationCode(
    email: string,
    code: string | null,
    expiry: Date | null
  ): Promise<void> {
    const pool = await getPool();

    await pool.request()
      .input("email", sql.NVarChar(255), email)
      .input("verification_code", sql.NChar(6), code)
      .input("verification_code_expiry", sql.DateTime, expiry)
      .query(`
        UPDATE ${TABLE}
        SET verification_code=@verification_code,
            verification_code_expiry=@verification_code_expiry
        WHERE email=@email
      `);
  },

  async verifyCode(email: string, code: string): Promise<User | null> {
    const pool = await getPool();

    const result = await pool.request()
      .input("email", sql.NVarChar(255), email)
      .input("code", sql.NChar(6), code)
      .query(`
        UPDATE ${TABLE}
        SET is_verified = 1,
            verification_code = NULL,
            verification_code_expiry = NULL
        WHERE email=@email AND verification_code=@code;

        SELECT * FROM ${TABLE} WHERE email=@email;
      `);

    return result.recordset[0] ?? null;
  },

  async deleteUser(id: number): Promise<void> {
    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM ${TABLE} WHERE id=@id`);
  },

  async update(id: number, updates: UpdateUser): Promise<User | null> {
    const pool = await getPool();

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM ${TABLE} WHERE id=@id`);

    return result.recordset[0] ?? null;
  }
};