import { getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../../testimonials/testimonial.service.js";

export const getAdminTestimonialsController = async (req, res) => {
  try {
    const data = await getAdminTestimonials();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const createTestimonialController = async (req, res) => {
  try {
    const data = await createTestimonial(req.body);
    return res.status(201).json({ success: true, data, message: "Testimonial created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateTestimonialController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await updateTestimonial(id, req.body);
    return res.status(200).json({ success: true, data, message: "Testimonial updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deleteTestimonialController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTestimonial(id);
    return res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
