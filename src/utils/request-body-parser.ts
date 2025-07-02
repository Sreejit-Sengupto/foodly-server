import { Request, Response } from "express";
import { z, ZodSchema, ZodTypeAny } from "zod";

export const reqBodyParser = <T extends ZodTypeAny>(
  body: Request["body"],
  res: Response,
  schema: ZodSchema,
): z.infer<T> => {
  const parseRes = schema.safeParse(body);
  if (!parseRes.success) {
    res.status(400).json({
      errors: parseRes.error.flatten(),
    });
  }
  return parseRes.data;
};
