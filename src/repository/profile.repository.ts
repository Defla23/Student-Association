import { getPool } from "../db/config";
import sql from "mssql";
import { UserProfile, School } from "../types/profile.types";

export const ProfileRepository = {
  async getProfile(user_id: number): Promise<UserProfile | null> {
    const pool = await getPool();
    const userResult = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .query(`
        SELECT first_name, last_name, email
        FROM Users
        WHERE id = @user_id
      `);
    if (userResult.recordset.length === 0) return null;
    const user = userResult.recordset[0];
    const full_name = `${user.first_name} ${user.last_name}`;
    const schoolsResult = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .query(`
        SELECT school_name, registration_number, course, year_of_study, academic_status
        FROM Education
        WHERE user_id = @user_id
        ORDER BY year_of_study DESC
      `);
    const profile: UserProfile = {
      first_name: user.first_name,
      last_name: user.last_name,
      full_name,
      email: user.email,
      schools: schoolsResult.recordset as School[],
    };
    return profile;
  },
};