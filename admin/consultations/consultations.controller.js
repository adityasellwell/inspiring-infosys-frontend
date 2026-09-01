import { getAdminConsultations, updateConsultationStatus, deleteConsultationRequest } from "../../consultations/consultations.service.js";

export const getAdminConsultationsController = async (req, res) => {
  try {
    const data = await getAdminConsultations();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateConsultationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await updateConsultationStatus(id, status);
    return res.status(200).json({ success: true, data, message: "Status updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deleteConsultationController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteConsultationRequest(id);
    return res.status(200).json({ success: true, message: "Consultation deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
