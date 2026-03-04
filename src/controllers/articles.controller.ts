import { Request, Response } from "express";
import { ArticleService } from "../services/articles.services";

export const ArticlesController = {
  async list(_: Request, res: Response) {
    try {
      const articles = await ArticleService.list();
      return res.json(articles);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async get(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    try {
      const article = await ArticleService.get(id);
      if (!article) return res.status(404).json({ message: "Article not found" });
      return res.json(article);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async create(req: Request, res: Response) {
    const { user_id, title, content } = req.body;
    if (!user_id || !title || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const article = await ArticleService.create({ user_id, title, content });
      return res.status(201).json({message: "Article created successfully", article});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async update(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid id" });

  const { title, content, is_approved } = req.body;

  try {
    const updated = await ArticleService.update(id, { title, content, is_approved });
    if (!updated) return res.status(404).json({ message: "Article not found" });

    return res.status(200).json({ message: "Article updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
},

  async delete(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid id" });

  try {
    await ArticleService.delete(id);
    return res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
};

export default ArticlesController;
