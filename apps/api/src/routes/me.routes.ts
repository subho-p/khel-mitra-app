import { Router } from "express";

import { meController } from "../controllers/me.controller";
import { verifyToken } from "../middlewares/auth.middlewares.js";

export const meRoutes = Router();

meRoutes.get("/", verifyToken, meController.getMe);
