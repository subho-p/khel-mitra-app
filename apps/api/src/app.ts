import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.config.js";
import { notFoundMiddleware } from "middlewares/notFound.middleware.js";
import { globalErrorMiddleware } from "middlewares/globalError.middleware.js";

const app = express();

// Middlewares
app.use(cors());
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

// ROUTES
app.use("/health", (req, res) => {
	res.status(200).json({ message: "hey boy, I am healthy and tasty" });
});

app.use("/api/auth", authRoutes);

// ERROR HANDLERS
app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

export default app;
