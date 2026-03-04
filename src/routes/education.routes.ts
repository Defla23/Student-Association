import { Express } from "express";
import * as EducationController from "../controllers/education.controller";

const registerEducationRoutes = (app: Express) => {
  app.get("/education", EducationController.list);
  app.get("/education/:id", EducationController.get);
  app.post("/education", EducationController.create);
  app.put("/education/:id", EducationController.update);
  app.delete("/education/:id", EducationController.remove);
};

export default registerEducationRoutes;