import { Express } from "express";
import { ConcernsController } from "../controllers/Concerns.controller";

const registerConcernsRoutes = (app: Express) => {
    app.get("/concerns", ConcernsController.list);
    app.get("/concerns/:id", ConcernsController.get);
    app.post("/concerns", ConcernsController.create);
    app.put("/concerns/:id", ConcernsController.update);
    app.delete("/concerns/:id", ConcernsController.delete);
}

export default registerConcernsRoutes;