import { Express } from "express";
import { ConcernsController } from "../controllers/Concerns.controller";

const registerConcernsRoutes = (app: Express) => {
  app.get("/concerns", ConcernsController.list);
  app.get("/concerns/:id", ConcernsController.get);
  app.post("/concerns", ConcernsController.create);
  app.put("/concerns/:id", ConcernsController.update);
  app.delete("/concerns/:id", ConcernsController.delete);
  app.post("/concerns/rate", ConcernsController.rate);
  app.get("/concerns/ratings", ConcernsController.ratings);
  app.post("/concerns/comments", ConcernsController.addComment);
  app.get("/concerns/:id/comments", ConcernsController.getComments);
};

export default registerConcernsRoutes;