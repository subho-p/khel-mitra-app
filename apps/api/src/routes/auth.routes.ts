import { Router } from "express";

export const authRoutes = Router();

authRoutes.post("/sign-in", (req, res) => {
	try {
		res.status(200).json({ message: "sign-in" });
	} catch (error) {
		console.error(`[ERROR] (authRoutes/sign-in) ${error}`);
	}
});

authRoutes.post("/sign-up", (req, res) => {
	try {
		res.status(200).json({ message: "sign-up" });
	} catch (error) {
		console.error(`[ERROR] (authRoutes/sign-up) ${error}`);
	}
});

authRoutes.post("/sign-out", (req, res) => {
	try {
		res.status(200).json({ message: "sign-out" });
	} catch (error) {
		console.error(`[ERROR] (authRoutes/sign-out) ${error}`);
	}
});

authRoutes.post("/refresh-token", (req, res) => {
	try {
		res.status(200).json({ message: "refresh-token" });
	} catch (error) {
		console.error(`[ERROR] (authRoutes/refresh-token) ${error}`);
	}
});
