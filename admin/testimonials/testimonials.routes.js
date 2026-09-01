import { Router } from "express";
import { getAdminTestimonialsController, createTestimonialController, updateTestimonialController, deleteTestimonialController } from "./testimonials.controller.js";

const router = Router();

router.get("/", getAdminTestimonialsController);
router.post("/", createTestimonialController);
router.put("/:id", updateTestimonialController);
router.delete("/:id", deleteTestimonialController);

export default router;
