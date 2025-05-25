import { Router } from "express";

import { authRateLimit } from "../middlewares/ratelimit.middlewares.js";

import { authController } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

export const authRoutes = Router();

authRoutes.post("/sign-up", authRateLimit, authController.signUp);
authRoutes.post("/sign-in", authRateLimit, authController.signIn);
authRoutes.post("/sign-out", verifyToken, authController.signOut);
authRoutes.post("/refresh-token", authController.refresh);
