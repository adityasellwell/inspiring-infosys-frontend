import { Router } from "express";
import { getAdminQuotesController, updateQuoteStatusController, deleteQuoteController } from "./quotes.controller.js";

const router = Router();

router.get("/", getAdminQuotesController);
router.put("/:id/status", updateQuoteStatusController);
router.delete("/:id", deleteQuoteController);

export default router;
