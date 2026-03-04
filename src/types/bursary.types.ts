export interface BursaryApplication {
  id?: number;
  user_id: number;
  reason: string;
  supporting_document?: string | null;
  status?: string;
  admin_comment?: string | null;
  created_at?: Date;
}

export type NewBursaryApplication = Omit<BursaryApplication, 'id' | 'status' | 'admin_comment' | 'created_at'>;
export type UpdateBursaryApplication = Partial<Omit<BursaryApplication, 'id' | 'user_id' | 'created_at'>>;
