import { ConcernRepository } from "../repository/concerns.repository";
import { NewConcern, UpdateConcern, Concern, NewConcernComment, ConcernComment } from "../types/concerns.types";

export const ConcernService = {
  async list(): Promise<Concern[]> {
    return ConcernRepository.getAll();
  },

  async get(id: number): Promise<Concern | null> {
    return ConcernRepository.getById(id);
  },

  async getByIdWithDetails(id: number): Promise<Concern | null> {
    const concern = await ConcernRepository.getById(id);
    if (!concern) return null;

    
    const ratings = await ConcernRepository.getRatings();
    const ratingData = ratings.find(r => r.concern_id === id) || { rating_percent: 0, total_ratings: 0 };

    const comments = await ConcernRepository.getAllCommentsForConcern(id);

    return {
      ...concern,
      rating_percent: ratingData.rating_percent,
      total_ratings: ratingData.total_ratings,
      comments
    };
  },

  async create(data: NewConcern): Promise<{ message: string }> {
    await ConcernRepository.create(data);
    return { message: "Concern created successfully" };
  },

  async update(id: number, data: UpdateConcern): Promise<{ message: string } | null> {
    const updated = await ConcernRepository.update(id, data);
    if (!updated) return null;
    return { message: "Concern updated successfully" };
  },

  async delete(id: number): Promise<{ message: string }> {
    await ConcernRepository.deleteConcern(id);
    return { message: "Concern deleted successfully" };
  },

  
  async rateConcern(concern_id: number, user_id: number, rating: number) {
    return ConcernRepository.createRating(concern_id, user_id, rating);
  },

  async getRatings() {
    return ConcernRepository.getRatings();
  },

  async addComment(comment: NewConcernComment): Promise<ConcernComment> {
    return ConcernRepository.addComment(comment);
  },

  async getComments(concernId: number): Promise<ConcernComment[]> {
    return ConcernRepository.getAllCommentsForConcern(concernId);
  }
};