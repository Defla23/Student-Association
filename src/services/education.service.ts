import * as EducationRepo from "../repository/education.repository";
import { Education, NewEducation } from "../types/education.types";

export const getAllEducation = async (): Promise<Education[]> => {
  return EducationRepo.findAll();
};

export const getEducationById = async (id: number) => {
  return EducationRepo.findById(id);
};

export const createEducation = async (data: NewEducation) => {
  return EducationRepo.create(data);
};

export const updateEducation = async (
  id: number,
  data: Partial<Education>
) => {
  return EducationRepo.update(id, data);
};

export const deleteEducation = async (id: number) => {
  return EducationRepo.remove(id);
};