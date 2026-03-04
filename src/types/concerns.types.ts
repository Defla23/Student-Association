export interface Concern {
  id?: number;
  user_id: number;
  title: string;
  description: string;
  created_at?: Date;
}

export type NewConcern = Omit<Concern, 'id' | 'created_at'>;
export type UpdateConcern = Partial<Omit<Concern, 'id' | 'user_id' | 'created_at'>>;