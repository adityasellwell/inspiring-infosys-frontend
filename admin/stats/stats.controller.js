import { getAdminStats, createStat, updateStat, deleteStat } from "../../stats/stats.service.js";

export const getAdminStatsController = async (req, res) => {
  try {
    const data = await getAdminStats();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const createStatController = async (req, res) => {
  try {
    const data = await createStat(req.body);
    return res.status(201).json({ success: true, data, message: "Stat created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateStatController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await updateStat(id, req.body);
    return res.status(200).json({ success: true, data, message: "Stat updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const deleteStatController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteStat(id);
    return res.status(200).json({ success: true, message: "Stat deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
