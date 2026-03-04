export interface Article {
  id?: number;
  user_id: number;
  title: string;
  content: string;
  is_approved?: boolean;
  created_at?: Date;
}

export type NewArticle = Omit<Article, 'id' | 'created_at'>;
export type UpdateArticle = Partial<Omit<Article, 'id' | 'user_id' | 'created_at'>>;