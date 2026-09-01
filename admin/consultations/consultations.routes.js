import { Router } from "express";
import { getAdminConsultationsController, updateConsultationStatusController, deleteConsultationController } from "./consultations.controller.js";

const router = Router();

router.get("/", getAdminConsultationsController);
router.put("/:id/status", updateConsultationStatusController);
router.delete("/:id", deleteConsultationController);

export default router;
