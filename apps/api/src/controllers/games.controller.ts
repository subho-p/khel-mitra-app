import express from "express";
import { logger } from "@khel-mitra/logger";

import { BadRequestError } from "../utils/error-response.js";
import { jwtService } from "../services/jwt.service.js";
import { ApiEmptyResponse, ApiSuccessResponse } from "../utils/api-response.js";

class GamesController {
	constructor() {
		logger.info("Games controller initialized");

		this.getPlayerAccessToken = this.getPlayerAccessToken.bind(this);
		this.verifyPlayerAccessToken = this.verifyPlayerAccessToken.bind(this);
		this.refreshPlayerAccessToken = this.refreshPlayerAccessToken.bind(this);
	}

	public async getPlayerAccessToken(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		try {
			const user = req.currentUser;
			if (!user) {
				throw new BadRequestError("You not authenticated");
			}

			const playerAccessToken = jwtService.getPlayerJwtToken(user);
			if (!playerAccessToken) throw new BadRequestError("Somthing went wrong");

			return res
				.cookie("_km_player_token", playerAccessToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
				})
				.status(200)
				.json(new ApiSuccessResponse({ playerAccessToken }));
		} catch (error) {
			next(error);
		}
	}

	public async verifyPlayerAccessToken(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		try {
			const playerToken = req.cookies["_km_player_token"] || req.headers["_km_player_token"];
			if (!playerToken) throw new BadRequestError("Player token not found");

			const decodedData = jwtService.verifyPlayerJwt(playerToken);
			if (!decodedData) throw new BadRequestError("Somthing went wrong");

			return res.status(200).json(new ApiEmptyResponse("Player token verified"));
		} catch (error) {
			next(error);
		}
	}

	public async refreshPlayerAccessToken(
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) {
		try {
			const playerToken = req.cookies["_km_player_token"] || req.headers["_km_player_token"];
			if (!playerToken) throw new BadRequestError("Player token not found");

			const decodedData = jwtService.verifyPlayerJwt(playerToken);
			if (!decodedData) throw new BadRequestError("Somthing went wrong");

			const playerAccessToken = jwtService.getPlayerJwtToken(decodedData);
			if (!playerAccessToken) throw new BadRequestError("Somthing went wrong");

			return res
				.cookie("_km_player_token", playerAccessToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
				})
				.status(200)
				.json(new ApiSuccessResponse({ playerAccessToken }));
		} catch (error) {
			next(error);
		}
	}
}

export const gamesController = new GamesController();

export default GamesController;
