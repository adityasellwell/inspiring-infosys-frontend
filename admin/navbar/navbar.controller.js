import { getNavbarTree,createNavbarItem } from "./navbar.service.js";

export const getNavbarAdminController = async (req, res) => {
  try {
    const data = await getNavbarTree();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const createNavbarController = async (req, res) => {
  try {
    const data = await createNavbarItem(req.body);

    return res.status(201).json({
      success: true,
      message: "Navbar item created successfully",
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
