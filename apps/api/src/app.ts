import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));

// ROUTES
app.use("/health", (req, res) => {
	res.status(200).json({ message: "hey boy, I am healthy and tasty" });
});

export default app;
