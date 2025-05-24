import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middlewares.js";
import { gamesController } from "../controllers/games.controller.js";

export const gamesRoutes = Router();

gamesRoutes.post("/player-token", verifyToken, gamesController.getPlayerAccessToken);
gamesRoutes.post("/player-token/verify", gamesController.verifyPlayerAccessToken);
gamesRoutes.post("/player-token/refresh", gamesController.refreshPlayerAccessToken);
