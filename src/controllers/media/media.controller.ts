import { Request, Response } from "express";
import { uploadToAppwrite } from "../../utils/appwrite-upload";
import { prisma } from "../../db";

export const uploadProfilePictureHandler = async (
  req: Request,
  res: Response,
) => {
  const file = req.file;
  const user = req.user;

  if (!file) {
    res.status(500).json({
      message: "Failed to read file",
    });
  }

  try {
    if (req.file?.path) {
      const fileURL = await uploadToAppwrite(req.file.path, req.file.filename);

      await prisma.user.update({
        data: {
          profilePicture: fileURL,
        },
        where: {
          id: user?.id,
        },
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile picture uploaded",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to upload to storage",
    });
  }
};
