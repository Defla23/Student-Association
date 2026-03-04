export interface Education {
  id?: number;
  user_id: number;
  school_name: string;
  registration_number: string;
  course: string;
  year_of_study: number;
  academic_status: string;
  created_at?: Date;
}

export type NewEducation = Omit<Education, "id" | "created_at">;