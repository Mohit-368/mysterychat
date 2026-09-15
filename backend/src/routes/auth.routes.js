import express from "express";

import authenticateUser from "../middlewares/auth.middleware.js";
import authController from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginController);
authRouter.post("/logout", authController.logoutController);
authRouter.get("/me", authenticateUser, authController.meController);

export default authRouter;