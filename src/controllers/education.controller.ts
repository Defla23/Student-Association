import { Request, Response } from "express";
import * as EducationService from "../services/education.service";

export const list = async (_req: Request, res: Response) => {
  const data = await EducationService.getAllEducation();
  res.json(data);
};

export const get = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const education = await EducationService.getEducationById(id);

  if (!education) {
    return res.status(404).json({ message: "Education not found" });
  }

  res.json(education);
};

export const create = async (req: Request, res: Response) => {
  const newEducation = await EducationService.createEducation(req.body);
  res.status(201).json(newEducation);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const updated = await EducationService.updateEducation(id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Education not found" });
  }

  res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await EducationService.deleteEducation(id);

  res.json({ message: "Education deleted successfully" });
};