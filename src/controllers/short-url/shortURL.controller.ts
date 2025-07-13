import { Request, response, Response } from "express";
import { prisma } from "../../db";
import axios from "axios";

export const handleShortURLRedirect = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const retrievedData = await prisma.shortURL.findUnique({
      where: {
        id,
      },
    });

    if (!retrievedData) {
      // instead of this redirect to a placeholder image
      res.json({
        message: "Cannot find URL",
      });
      return;
    }

    // res.redirect(retrievedData.url)

    const image = await axios.get(retrievedData.url, {
      responseType: "stream",
    });
    res.setHeader("Content-Type", image.headers["content-type"]);
    res.setHeader("Cache-Control", "public, max-age=86400");

    image.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      data: error,
      message: "Failed to upload to storage",
    });
  }
};
