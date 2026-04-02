export interface Concern {
  id?: number;
  user_id: number;
  title: string;
  description: string;
  created_at?: Date;
  rating_percent?: number;   
  total_ratings?: number;
  comments?: ConcernComment[];
}

export type NewConcern = Omit<Concern, 'id' | 'created_at' | 'rating_percent' | 'total_ratings' | 'comments'>;

export type UpdateConcern = Partial<Omit<Concern, 'id' | 'user_id' | 'created_at' | 'rating_percent' | 'total_ratings' | 'comments'>>;

export interface ConcernComment {
  id?: number;
  concern_id: number;
  user_id: number;
  user_name?: string;
  comment: string;
  created_at?: Date;
}

export type NewConcernComment = Omit<ConcernComment, 'id' | 'created_at' | 'user_name'>;