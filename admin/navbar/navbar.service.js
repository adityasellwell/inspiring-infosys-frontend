import prisma from "../../../config/prisma.js";

export const getNavbarTree = async () => {
  return await prisma.navbarItem.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};

export const createNavbarItem = async (payload) => {
  return await prisma.navbarItem.create({
    data: {
      title: payload.title,
      slug: payload.slug,
      url: payload.url || null,
      parentId: payload.parentId || null,
      sortOrder: payload.sortOrder || 1,
      isActive: true,
    },
  });
};