import express from "express";
import { getPool } from "./db/config";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import articlesRoutes from "./routes/articles.routes";
import registerConcernsRoutes from "./routes/concerns.routes";
import bursaryRoutes from "./routes/bursary.routes";
import registerEducationRoutes from "./routes/education.routes";




dotenv.config();

const app = express();
app.use(express.json());

//register routes
userRoutes(app);
articlesRoutes(app);
registerConcernsRoutes(app);
bursaryRoutes(app);
registerEducationRoutes(app);



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: http://localhost:${port}`);
});



app.get('/',  (_, res) => {
res.send('Welcome to the Student Association API');
});

getPool()
  .then(() => console.log("Database connection pool created successfully"))
  .catch((err: any) => console.error("Error creating database connection pool:", err));
