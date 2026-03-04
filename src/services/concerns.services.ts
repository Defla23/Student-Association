import { ConcernRepository } from "../repository/concerns.repository";
import { NewConcern, UpdateConcern, Concern } from "../types/concerns.types";

export const ConcernService = {
  async list(): Promise<Concern[]> {
    return ConcernRepository.getAll();
  },

  async get(id: number): Promise<Concern | null> {
    return ConcernRepository.getById(id);
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
};