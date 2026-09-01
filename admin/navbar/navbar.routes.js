import { Router } from "express";
import { getNavbarAdminController } from "./navbar.controller.js";

const router = Router();

router.get("/", getNavbarAdminController);

export default router;