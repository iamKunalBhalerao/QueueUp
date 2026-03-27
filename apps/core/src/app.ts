import express, {
  urlencoded,
  type Express,
  type Request,
  type Response,
} from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.send(`Hello from the QueueUp server!`);
});

app.get("/hello", (_req: Request, res: Response) => {
  res.send(
    "Hello Endpoint. This is a simple route to test the server's functionality.",
  );
});

// Importing Routes
import authRouter from "./routes/auth.routes";
import linkedInRouter from "./routes/linkedIn.routes";

// Using Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/linkedin", linkedInRouter);

app.use(globalErrorHandler);

export default app;
