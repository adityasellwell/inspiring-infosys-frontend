import { getAdminQuotes, updateQuoteStatus, deleteQuoteRequest } from "../../quotes/quotes.service.js";

export const getAdminQuotesController = async (req, res) => {
  try {
    const data = await getAdminQuotes();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateQuoteStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await updateQuoteStatus(id, status);
    return res.status(200).json({ success: true, data, message: "Quote status updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deleteQuoteController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteQuoteRequest(id);
    return res.status(200).json({ success: true, message: "Quote deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
