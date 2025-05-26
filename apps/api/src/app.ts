import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport.config.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { globalErrorMiddleware } from "./middlewares/globalError.middleware.js";
import { appRateLimit } from "./middlewares/ratelimit.middlewares.js";

import { authRoutes } from "./routes/auth.routes.js";
import { meRoutes } from "./routes/me.routes.js";
import { gamesRoutes } from "./routes/game.routes.js";

const app = express();

// Middlewares
app.use(
	cors({
		origin: process.env.CORS_ORIGIN?.split(","),
		credentials: true,
	})
);
app.use(cookieParser());

// Express Session
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			sameSite: "lax",
		},
	})
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Body Parser
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));

// Rate Limiter
app.use(appRateLimit);

// ROUTES
app.use("/health", (req, res) => {
	res.status(200).json({ message: "hey boy, I am healthy and tasty" });
});

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/games", gamesRoutes);

// ERROR HANDLERS
app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

export default app;
