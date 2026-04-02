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
      const concern = await ConcernService.getByIdWithDetails(id); // now includes ratings + comments
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
      return res.status(201).json(response);
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
      return res.json(response);
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
      return res.json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },


  async rate(req: Request, res: Response) {
    try {
      const { concern_id, user_id, rating } = req.body;
      if (!concern_id || !user_id || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await ConcernService.rateConcern(concern_id, user_id, rating);
      res.json({ message: "Rating added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding rating" });
    }
  },

  async ratings(req: Request, res: Response) {
    try {
      const data = await ConcernService.getRatings();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching ratings" });
    }
  },


  async addComment(req: Request, res: Response) {
    try {
      const { concern_id, user_id, comment } = req.body;
      if (!concern_id || !user_id || !comment) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newComment = await ConcernService.addComment({ concern_id, user_id, comment });
      res.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding comment" });
    }
  },

  async getComments(req: Request, res: Response) {
    try {
      const concernId = Number(req.params.id);
      if (!concernId) return res.status(400).json({ message: "Invalid concern id" });

      const comments = await ConcernService.getComments(concernId);
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching comments" });
    }
  }
};