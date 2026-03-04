import { getPool } from "../db/config";
import sql from "mssql";
import { BursaryApplication, NewBursaryApplication, UpdateBursaryApplication } from "../types/bursary.types";

const TABLE = "BursaryApplications";

export const BursaryRepository = {
	async getAll(): Promise<BursaryApplication[]> {
		const pool = await getPool();
		const result = await pool.request().query(`SELECT * FROM ${TABLE}`);
		return result.recordset;
	},

	async getById(id: number): Promise<BursaryApplication | null> {
		const pool = await getPool();
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.query(`SELECT * FROM ${TABLE} WHERE id = @id`);
		return result.recordset[0] ?? null;
	},

	async create(app: NewBursaryApplication): Promise<BursaryApplication> {
		const pool = await getPool();
		const result = await pool
			.request()
			.input("user_id", sql.Int, app.user_id)
			.input("reason", sql.NVarChar(sql.MAX), app.reason)
			.input("supporting_document", sql.NVarChar(255), app.supporting_document ?? null)
			.query(`
				INSERT INTO ${TABLE} (user_id, reason, supporting_document)
				OUTPUT INSERTED.*
				VALUES (@user_id, @reason, @supporting_document)
			`);
		return result.recordset[0];
	},

	async update(id: number, updates: UpdateBursaryApplication): Promise<BursaryApplication | null> {
		const pool = await getPool();
		const sets: string[] = [];
		const req = pool.request();

		if (updates.reason !== undefined) {
			sets.push("reason = @reason");
			req.input("reason", sql.NVarChar(sql.MAX), updates.reason);
		}
		if (updates.supporting_document !== undefined) {
			sets.push("supporting_document = @supporting_document");
			req.input("supporting_document", sql.NVarChar(255), updates.supporting_document);
		}
		if (updates.status !== undefined) {
			sets.push("status = @status");
			req.input("status", sql.NVarChar(20), updates.status);
		}
		if (updates.admin_comment !== undefined) {
			sets.push("admin_comment = @admin_comment");
			req.input("admin_comment", sql.NVarChar(sql.MAX), updates.admin_comment);
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

	async deleteBursary(id: number): Promise<void> {
		const pool = await getPool();
		await pool.request().input("id", sql.Int, id).query(`DELETE FROM ${TABLE} WHERE id = @id`);
	},
};

export default BursaryRepository;
