import { Express } from "express";
import {UserController} from "../controllers/user.controller";
// import { isAuthenticated } from "../middleware/bear.Auth";

export default function userRoutes(app: Express) {

 
  app.get("/users", UserController.list);
  app.get("/users/:id", UserController.get);
  app.post("/users", UserController.create);
  app.put("/users/:id", UserController.update);
  app.delete("/users/:id", UserController.delete);
  app.post("/users/login", UserController.login);
  app.post("/users/verify", UserController.verifyCode);
  app.post("/users/resend-code", UserController.resendCode);
}