import { getPool } from "../db/config";
import { Education, NewEducation } from "../types/education.types";

export const findAll = async (): Promise<Education[]> => {
  const pool = await getPool();
  const result = await pool.request().query("SELECT * FROM Education");
  return result.recordset;
};

export const findById = async (id: number): Promise<Education | null> => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM Education WHERE id = @id");

  return result.recordset[0] || null;
};

export const create = async (data: NewEducation): Promise<Education> => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("user_id", data.user_id)
    .input("school_name", data.school_name)
    .input("registration_number", data.registration_number)
    .input("course", data.course)
    .input("year_of_study", data.year_of_study)
    .input("academic_status", data.academic_status)
    .query(`
      INSERT INTO Education
      (user_id, school_name, registration_number, course, year_of_study, academic_status)
      OUTPUT INSERTED.*
      VALUES
      (@user_id,@school_name,@registration_number,@course,@year_of_study,@academic_status)
    `);

  return result.recordset[0];
};

export const update = async (
  id: number,
  data: Partial<Education>
): Promise<Education | null> => {
  const pool = await getPool();

  const result = await pool.request()
    .input("id", id)
    .input("school_name", data.school_name ?? null)
    .input("course", data.course ?? null)
    .input("year_of_study", data.year_of_study ?? null)
    .input("academic_status", data.academic_status ?? null)
    .query(`
      UPDATE Education
      SET
        school_name = COALESCE(@school_name, school_name),
        course = COALESCE(@course, course),
        year_of_study = COALESCE(@year_of_study, year_of_study),
        academic_status = COALESCE(@academic_status, academic_status)
      OUTPUT INSERTED.*
      WHERE id = @id
    `);

  return result.recordset[0] || null;
};
export const remove = async (id: number): Promise<void> => {
  const pool = await getPool();

  await pool
    .request()
    .input("id", id)
    .query("DELETE FROM Education WHERE id = @id");
};