import BursaryRepository from "../repository/bursary.repository";
import { BursaryApplication, NewBursaryApplication, UpdateBursaryApplication } from "../types/bursary.types";

export const BursaryService = {
  async list(): Promise<BursaryApplication[]> {
    return BursaryRepository.getAll();
  },

  async get(id: number): Promise<BursaryApplication | null> {
    return BursaryRepository.getById(id);
  },

  async create(data: NewBursaryApplication): Promise<BursaryApplication> {
    return BursaryRepository.create(data);
  },

  async update(id: number, data: UpdateBursaryApplication): Promise<BursaryApplication | null> {
    return BursaryRepository.update(id, data);
  },

  async delete(id: number): Promise<void> {
    return BursaryRepository.deleteBursary(id);
  },
};

export default BursaryService;
