import { getPool } from "../db/config";
import sql from "mssql";
import { Concern, NewConcern, UpdateConcern, ConcernComment, NewConcernComment } from "../types/concerns.types";

const TABLE = "Concerns";

export const ConcernRepository = {
  

  async getAll(): Promise<Concern[]> {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT c.*,
             ISNULL(r.total_ratings, 0) AS total_ratings,
             ISNULL(r.rating_percent, 0) AS rating_percent
      FROM Concerns c
      LEFT JOIN (
          SELECT 
              concern_id,
              COUNT(*) AS total_ratings,
              ROUND(AVG(CAST(rating AS FLOAT)) * 20, 2) AS rating_percent
          FROM ConcernRatings
          GROUP BY concern_id
      ) r ON c.id = r.concern_id
    `);
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

    if (sets.length === 0) return await this.getById(id);

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


  async createRating(concern_id: number, user_id: number, rating: number): Promise<void> {
    const pool = await getPool();
    await pool
      .request()
      .input("concern_id", sql.Int, concern_id)
      .input("user_id", sql.Int, user_id)
      .input("rating", sql.Int, rating)
      .query(`
        INSERT INTO ConcernRatings (concern_id, user_id, rating)
        VALUES (@concern_id, @user_id, @rating)
      `);
  },

  async getRatings(): Promise<{ concern_id: number; total_ratings: number; rating_percent: number }[]> {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
          concern_id,
          COUNT(*) AS total_ratings,
          ROUND(AVG(CAST(rating AS FLOAT)) * 20, 2) AS rating_percent
      FROM ConcernRatings
      GROUP BY concern_id
    `);
    return result.recordset;
  },


  async getAllCommentsForConcern(concernId: number): Promise<ConcernComment[]> {
    const pool = await getPool();
    const result = await pool.request()
      .input('concernId', sql.Int, concernId)
      .query(`
        SELECT c.id,
               c.concern_id,
               c.user_id,
               u.first_name + ' ' + u.last_name AS user_name,
               c.comment,
               c.created_at
        FROM ConcernComments c
        JOIN Users u ON c.user_id = u.id
        WHERE c.concern_id = @concernId
        ORDER BY c.created_at DESC
      `);
    return result.recordset;
  },

  async addComment(comment: NewConcernComment): Promise<ConcernComment> {
    const pool = await getPool();
    const result = await pool.request()
      .input('concernId', sql.Int, comment.concern_id)
      .input('userId', sql.Int, comment.user_id)
      .input('comment', sql.NVarChar(sql.MAX), comment.comment)
      .query(`
        INSERT INTO ConcernComments (concern_id, user_id, comment)
        OUTPUT INSERTED.*
        VALUES (@concernId, @userId, @comment)
      `);
    return result.recordset[0];
  }
};