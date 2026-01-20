// Modules
import express from "express";
import cors from "cors";
import pino from "pino-http";
import cookieParser from "cookie-parser";

// Utils
import { env } from "./utils/env.js";

// Middlewares
import { notRouteFound } from "./middlewares/notRouteFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

// Routers
import indexRoute from "./routers/index.js";

const startServer = () => {
  const app = express();

  app.use(
    cors({
      origin: [
        "https://task-pro-frontend-eight.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
      ],
      credentials: true,
    }),
  );

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    }),
  );
  app.use(express.json());

  app.use(indexRoute);
  app.use("/api-docs", swaggerDocs());
  app.use(notRouteFound);
  app.use(errorHandler);

  const PORT = Number(env("PORT", 3000));

  app.listen(PORT, () => {
    console.log(`The server is running ${PORT} port`);
  });
};

export default startServer;
