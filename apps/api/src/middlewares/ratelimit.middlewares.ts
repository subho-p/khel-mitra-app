import rateLimit from "express-rate-limit";
import { LimitExceededError } from "../utils/error-response.js";

const appRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	statusCode: 429,
	message: "Too many requests, please try again later",
	handler: (req, res) => {
		throw new LimitExceededError("Too many requests, please try again later");
	},
});

const authRateLimit = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	statusCode: 429,
	message: "Too many requests, please try again later",
	handler: (req, res) => {
		new LimitExceededError("Too many requests, please try again later");
	},
});

export { appRateLimit, authRateLimit };
