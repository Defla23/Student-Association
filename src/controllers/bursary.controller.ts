import { Request, Response } from "express";
import BursaryService from "../services/bursary.services";

export const BursaryController = {
  async list(_: Request, res: Response) {
    try {
      const apps = await BursaryService.list();
      return res.json(apps);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async get(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    try {
      const app = await BursaryService.get(id);
      if (!app) return res.status(404).json({ message: "Application not found" });
      return res.json(app);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async create(req: Request, res: Response) {
    const { user_id, reason, supporting_document } = req.body;
    if (!user_id || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const app = await BursaryService.create({ user_id, reason, supporting_document });
      return res.status(201).json({ message: "Application submitted", app });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const { reason, supporting_document, status, admin_comment } = req.body;
    try {
      const updated = await BursaryService.update(id, { reason, supporting_document, status, admin_comment });
      if (!updated) return res.status(404).json({ message: "Application not found" });
      return res.json({ message: "Application updated" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    try {
      await BursaryService.delete(id);
      return res.json({ message: "Application deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default BursaryController;
