import { Router } from "express";
import { getAdminStatsController, createStatController, updateStatController, deleteStatController } from "./stats.controller.js";

const router = Router();

router.get("/", getAdminStatsController);
router.post("/", createStatController);
router.put("/:id", updateStatController);
router.delete("/:id", deleteStatController);

export default router;
