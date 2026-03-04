import { getPool } from "../db/config";
import sql from "mssql";
import { Concern, NewConcern, UpdateConcern } from "../types/concerns.types";

const TABLE = "Concerns";

export const ConcernRepository = {
  async getAll(): Promise<Concern[]> {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT * FROM ${TABLE}`);
    return result.recordset;
  },

  async getById(id: number): Promise<Concern | null> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM ${TABLE} WHERE id = @id`);
    return result.recordset[0] ?? null;
  },

  async create(concern: NewConcern): Promise<Concern> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("user_id", sql.Int, concern.user_id)
      .input("title", sql.NVarChar(255), concern.title)
      .input("description", sql.NVarChar(sql.MAX), concern.description)
      .query(`
        INSERT INTO ${TABLE} (user_id, title, description)
        OUTPUT INSERTED.*
        VALUES (@user_id, @title, @description)
      `);
    return result.recordset[0];
  },

  async update(id: number, updates: UpdateConcern): Promise<Concern | null> {
    const pool = await getPool();
    const sets: string[] = [];
    const req = pool.request();

    if (updates.title !== undefined) {
      sets.push("title = @title");
      req.input("title", sql.NVarChar(255), updates.title);
    }
    if (updates.description !== undefined) {
      sets.push("description = @description");
      req.input("description", sql.NVarChar(sql.MAX), updates.description);
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

  async deleteConcern(id: number): Promise<void> {
    const pool = await getPool();
    await pool.request().input("id", sql.Int, id).query(`DELETE FROM ${TABLE} WHERE id = @id`);
  },
};
