import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";

export const app: Application = express();
dotenv.config();

const port = process.env.PORT ?? 3001;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(routes);

app.get("/", (req: Request, res: Response) => {
  res.send({ name: "John Doe" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
