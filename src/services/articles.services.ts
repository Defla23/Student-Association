import { ArticleRepository } from "../repository/articles.repository";
import { Article, NewArticle, UpdateArticle } from "../types/articles.types";

export const ArticleService = {
  async list(): Promise<Article[]> {
    return ArticleRepository.getAll();
  },

  async get(id: number): Promise<Article | null> {
    return ArticleRepository.getById(id);
  },

  async create(data: NewArticle): Promise<Article> {
    // in the future we could check whether the user exists
    return ArticleRepository.create(data);
  },

  async update(id: number, data: UpdateArticle): Promise<Article | null> {
    return ArticleRepository.update(id, data);
  },

  async delete(id: number): Promise<void> {
    return ArticleRepository.deleteArticle(id);
  },
};
