import { Express } from "express";
import ArticlesController from "../controllers/articles.controller";

export default function articlesRoutes(app: Express) {
  app.get("/articles", ArticlesController.list);
  app.get("/articles/:id", ArticlesController.get);
  app.post("/articles", ArticlesController.create);
  app.put("/articles/:id", ArticlesController.update);
  app.delete("/articles/:id", ArticlesController.delete);
}