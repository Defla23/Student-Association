export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string | null;
  verification_code?: string | null;
  verification_code_expiry?: Date | null;
  role?: string;
  is_verified?: boolean;
  is_profile_complete?: boolean;
  is_active?: boolean;
  created_at?: Date;
}

export type NewUser = Omit<User, 'id' | 'created_at' | 'is_verified' | 'is_profile_complete' | 'is_active'>;


export interface UpdateUser {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone_number?: string | null;
  role?: string;
  is_active?: boolean;
}