import { Express } from "express";
import BursaryController from "../controllers/bursary.controller";
import multer from "multer";
import path from "path";

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "downloads/"); // folder to save files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default function bursaryRoutes(app: Express) {
  app.get("/bursary", BursaryController.list);
  app.get("/bursary/:id", BursaryController.get);

  
  app.post(
    "/bursary",
    upload.single("supporting_document"), 
    BursaryController.create
  );

  app.put("/bursary/:id", BursaryController.update);
  app.delete("/bursary/:id", BursaryController.delete);
}