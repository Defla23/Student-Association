import { Express } from "express";
import BursaryController from "../controllers/bursary.controller";

export default function bursaryRoutes(app: Express) {
	app.get("/bursary", BursaryController.list);
	app.get("/bursary/:id", BursaryController.get);
	app.post("/bursary", BursaryController.create);
	app.put("/bursary/:id", BursaryController.update);
	app.delete("/bursary/:id", BursaryController.delete);
}
