import { Request, Response } from "express";
import {
  createManyMenuItemsSchema,
  createMenuItemSchema,
  deleteMenuItemSchema,
  getMenuItemSchema,
  getMenuSchema,
  updateMenuItemSchema,
} from "../../validation/menu";
import { prisma } from "../../db";

export const createMenuItemHandler = async (req: Request, res: Response) => {
  const parseRes = createMenuItemSchema.safeParse(req.body);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;
  const price = parseFloat(reqData.price);
  const prepTimeMin = parseInt(reqData.prepTimeMin);

  try {
    const menuItem = await prisma.menuItems.create({
      data: {
        name: reqData.name,
        description: reqData.description,
        prepTimeMin,
        price,
        eateryId: reqData.eateryId,
        tags: reqData.tags,
        isFeatured: reqData.isFeatured,
      },
    });
    res.status(201).json({
      success: true,
      item: menuItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to create menu item",
    });
  }
};

export const createManyMenuItemsHandler = async (
  req: Request,
  res: Response,
) => {
  const parseRes = createManyMenuItemsSchema.safeParse(req.body);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  const dbCompatibleData = reqData.map((item) => {
    return {
      eateryId: item.eateryId,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      prepTimeMin: parseInt(item.prepTimeMin),
      isFeatured: item.isFeatured,
      tags: item.tags,
    };
  });

  try {
    const menuItems = await prisma.menuItems.createMany({
      data: dbCompatibleData,
    });

    res.status(201).json({
      success: true,
      items: menuItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to create menu items",
    });
  }
};

export const updateMenuItemHandler = async (req: Request, res: Response) => {
  const parseRes = updateMenuItemSchema.safeParse(req.params);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    const updatedMenuItem = await prisma.menuItems.update({
      where: {
        id: reqData.id,
        eateryId: reqData.eateryId,
      },
      data: {
        ...(reqData.name && { name: reqData.name }),
        ...(reqData.description && { description: reqData.description }),
        ...(reqData.price && { price: parseFloat(reqData.price) }),
        ...(reqData.prepTimeMin && {
          prepTimeMin: parseInt(reqData.prepTimeMin),
        }),
        ...(reqData.isFeatured !== undefined && {
          isFeatured: reqData.isFeatured,
        }),
        ...(reqData.tags && { tags: reqData.tags }),
        ...(reqData.discount && { discount: parseFloat(reqData.discount) }),
        ...(reqData.availability && { availability: reqData.availability }),
      },
    });

    res.status(201).json({
      item: updatedMenuItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to update menu item",
    });
  }
};

export const deleteMenuItemHandler = async (req: Request, res: Response) => {
  const parseRes = deleteMenuItemSchema.safeParse(req.params);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    await prisma.menuItems.delete({
      where: {
        id: reqData.id,
        eateryId: reqData.eateryId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to delete menu item",
    });
  }
};

export const getMenuHandler = async (req: Request, res: Response) => {
  const parseRes = getMenuSchema.safeParse(req.query);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    await prisma.menuItems.findMany({
      where: {
        eateryId: reqData.eateryId,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(reqData.cursor && {
        skip: 1,
        cursor: {
          id: reqData.cursor,
        },
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to fetch menu items",
    });
  }
};

export const getMenuItemHandler = async (req: Request, res: Response) => {
  const parseRes = getMenuItemSchema.safeParse(req.params);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    const menuItem = await prisma.menuItems.findUnique({
      where: {
        id: reqData.id,
        eateryId: reqData.eateryId,
      },
    });

    res.status(200).json({
      item: menuItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to fetch menu item",
    });
  }
};
