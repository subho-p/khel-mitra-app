import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

export const authRoutes = Router();

authRoutes.post("/sign-up", authController.signUp);
authRoutes.post("/sign-in", authController.signIn);
authRoutes.post("/sign-out", verifyToken, authController.signOut);
authRoutes.post("/refresh-token", authController.refresh);
