import { Request, Response } from "express";
import {
  createEaterySchema,
  getEateriesSchema,
  getEateryByIdSchema,
  getEateryByUserSchema,
} from "../../validation/eatery";
import { prisma } from "../../db";
import { uploadToAppwrite } from "../../utils/appwrite-upload";

export const createEateryHanlder = async (req: Request, res: Response) => {
  const parseRes = createEaterySchema.safeParse(req.body);
  const user = req.user;
  const images = req.files;

  if (!images || images.length === 0) {
    return res.status(400).json({ message: "No images uploaded." });
  }

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  if (!user) {
    res.status(400).json({
      error: "User not found, please sign in.",
    });
    return;
  }

  if (user.role === "CUSTOMER") {
    res.status(400).json({
      error:
        "Please sign in as EATERY. Accounts with ROLE: CUSTOMER cannot create Eateries.",
    });
    return;
  }

  const reqData = parseRes.data;
  const filepath = Array.isArray(images)
    ? images.map((item) => ({ path: item.path, name: item.filename }))
    : images.eateryImgs?.map((item) => ({
        path: item.path,
        name: item.filename,
      })) || [];
  console.log(filepath);

  try {
    const imgURLPromise = filepath.map((item) =>
      uploadToAppwrite(item.path, item.name, "EATERY_COVER"),
    );
    const imgURLs = await Promise.all(imgURLPromise);

    const eatery = await prisma.eateries.create({
      data: {
        name: reqData.name,
        email: reqData.email,
        phone: reqData.phone,
        description: reqData.description,
        services: ["TAKEAWAY"],
        addressLineOne: reqData.addressLineOne,
        addressLineTwo: reqData.addressLineTwo,
        city: reqData.city,
        state: reqData.state,
        pincode: reqData.pincode,
        cusineType: reqData.cusineType,
        userId: user?.id,
        images: imgURLs,
        operatingHours: reqData.operatingTime,
      },
    });

    res.status(201).json({
      success: true,
      eatery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to create eatery",
    });
  }
};

export const getEateryById = async (req: Request, res: Response) => {
  const parseRes = getEateryByIdSchema.safeParse(req.params);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  try {
    const eatery = await prisma.eateries.findUnique({
      where: {
        id: reqData.id,
      },
      include: {
        user: {
          omit: {
            password: true,
            refreshToken: true,
            otp: true,
            otpExpiry: true,
          },
        },
      },
    });

    res.status(200).json({
      eatery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to fetch eatery with the provided ID",
    });
  }
};

export const getEateryByUserHandler = async (req: Request, res: Response) => {
  console.log("helloo..");

  const user = req?.user;
  console.log(user);

  const parseRes = getEateryByUserSchema.safeParse(req.query);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  if (!user) {
    res.status(400).json({
      error: "User not found, please sign in.",
    });
    return;
  }

  console.log(user.id);

  try {
    const eatery = await prisma.eateries.findMany({
      take: parseInt(reqData.take),
      where: {
        userId: user.id,
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

    // If user has queried for 'n' entries and the database returns 'n' rows
    // It means we have more data...
    // Therefore return the id of the last row as cursor
    const cursor =
      parseInt(reqData.take) === eatery.length
        ? eatery[eatery.length - 1].id
        : null;

    res.status(200).json({
      cursor,
      eatery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to fetch eateries of the following user",
    });
  }
};

export const getEateries = async (req: Request, res: Response) => {
  const parseRes = getEateriesSchema.safeParse(req.query);

  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
    return;
  }

  const reqData = parseRes.data;

  const { city, cusineType, name, isOpen } = reqData;
  try {
    const eatery = await prisma.eateries.findMany({
      take: parseInt(reqData.take),
      where: {
        ...(city && { city: { equals: city } }),
        ...(cusineType && { cusineType }),
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(isOpen && { isOpen: { equals: isOpen } }),
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(reqData.cursor && {
        skip: 1,
        cursor: { id: reqData.cursor },
      }),
    });

    const cursor =
      parseInt(reqData.take) === eatery.length
        ? eatery[eatery.length - 1].id
        : null;

    res.status(200).json({
      eatery,
      cursor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to fetch eateries.",
    });
  }
};
