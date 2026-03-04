import { Request, Response } from "express";
import { ConcernService } from "../services/concerns.services";

export const ConcernsController = {
  async list(_: Request, res: Response) {
    try {
      const concerns = await ConcernService.list();
      return res.json(concerns);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async get(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    try {
      const concern = await ConcernService.get(id);
      if (!concern) return res.status(404).json({ message: "Concern not found" });
      return res.json(concern);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async create(req: Request, res: Response) {
    const { user_id, title, description } = req.body;
    if (!user_id || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const response = await ConcernService.create({ user_id, title, description });
      return res.status(201).json({ message: "Concern created successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { title, description } = req.body;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    try {
      const response = await ConcernService.update(id, { title, description });
      if (!response) return res.status(404).json({ message: "Concern not found" });
      return res.json({ message: "Concern updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    try {
      const response = await ConcernService.delete(id);
      return res.json({ message: "Concern deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};





