// Package imports
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import startServer from "./lib/start-server.js";

import globalErrorHandler from "./controllers/error-controller.js";
import AppError from "./lib/app-error.js";

import quotesRoutes from "./routes/tours-routes.js";
import authRoutes from "./routes/auth-routes.js";

const app = express();
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://192.168.29.203:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new AppError(401, "Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(helmet());

// Getting log for upcoming request in terminal
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "dev"));

// For Limiting request per each IP
// const RateLimiter = rateLimit({
//    max: 300,
//    windowMs: 60 * 60 * 1000,
//    message: 'Too many request from this IP, please try again in 1 hour!',
// })

// app.use('/api', RateLimiter)

// Body Parser, reading json data from body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Tool sanitization against NoSql query injections
app.use(mongoSanitize());

// Tool sanitization again XSS (Cors Site Scripting Attacks).
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp());

app.use(cors(corsOptions));
app.use("/api/auth", authRoutes);
app.use("/api/tours", quotesRoutes);

// Throw error for Unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

// Global Error handler (Every failed req comes in this Middleware)
app.use(globalErrorHandler);

// Starting the server
const port = process.env.PORT || 4101;
startServer(app, port);
