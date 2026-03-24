
import { Express } from "express";
import { ProfileController } from "../controllers/profile.controller";

export const profileRoutes = (app: Express) => {
  app.get("/profile/:user_id", ProfileController.getProfile);
};