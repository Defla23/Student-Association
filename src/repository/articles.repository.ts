import { getPool } from "../db/config";
import sql from "mssql";
import { Article, NewArticle, UpdateArticle } from "../types/articles.types";

const TABLE = "Articles";

export const ArticleRepository = {
  // async getAll(): Promise<Article[]> {
  //   const pool = await getPool();
  //   const result = await pool.request().query(`SELECT * FROM ${TABLE}`);
  //   return result.recordset;
  // },

  async getById(id: number): Promise<Article | null> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM ${TABLE} WHERE id = @id`);
    return result.recordset[0] ?? null;
  },

  async create(article: NewArticle): Promise<Article> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("user_id", sql.Int, article.user_id)
      .input("title", sql.NVarChar(255), article.title)
      .input("content", sql.NVarChar(sql.MAX), article.content)
      .input("is_approved", sql.Bit, article.is_approved ? 1 : 0)
      .query(`
        INSERT INTO ${TABLE} (user_id, title, content, is_approved)
        OUTPUT INSERTED.*
        VALUES (@user_id, @title, @content, @is_approved)
      `);
    return result.recordset[0];
  },
  async getAll(): Promise<Article[]> {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT 
      A.*,
      U.first_name
    FROM Articles A
    JOIN Users U ON A.user_id = U.id
    ORDER BY A.created_at DESC
  `);

  return result.recordset;
},

  async update(id: number, updates: UpdateArticle): Promise<Article | null> {
    const pool = await getPool();
    const sets: string[] = [];
    const req = pool.request();

    if (updates.title !== undefined) {
      sets.push("title = @title");
      req.input("title", sql.NVarChar(255), updates.title);
    }
    if (updates.content !== undefined) {
      sets.push("content = @content");
      req.input("content", sql.NVarChar(sql.MAX), updates.content);
    }
    if (updates.is_approved !== undefined) {
      sets.push("is_approved = @is_approved");
      req.input("is_approved", sql.Bit, updates.is_approved ? 1 : 0);
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

  async deleteArticle(id: number): Promise<void> {
    const pool = await getPool();
    await pool.request().input("id", sql.Int, id).query(`DELETE FROM ${TABLE} WHERE id = @id`);
  },
};
