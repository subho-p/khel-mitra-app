import { Request, Response, NextFunction } from "express"
import { logger } from "@khel-mitra/logger";
import { NotFoundError } from "../utils/error-response";
import { UserService } from "../services/user.service";

class MeController {
    private userService = new UserService();

    constructor() {
        logger.info("MeController initialized");

        this.getMe = this.getMe.bind(this);
    }


    getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.currentUser;
            if (!user) {
                throw new NotFoundError("User not found");
            }
            logger.info("User fetched successfully", { id: user.id });
            return res.status(200).json({
                data: { user },
                message: "User fetched successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

export const meController = new MeController();

export default MeController;