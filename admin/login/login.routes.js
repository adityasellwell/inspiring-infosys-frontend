import { Router } from "express";
import { adminLoginController } from "./login.controller.js";
const router = Router();

router.post("/login",adminLoginController);

export default router;