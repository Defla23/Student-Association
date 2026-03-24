export interface School {
  school_name: string;
  registration_number: string;
  course: string;
  year_of_study: number;
  academic_status: string;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  schools: School[];
}