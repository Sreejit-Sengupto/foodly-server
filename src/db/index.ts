import { Prisma, PrismaClient } from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient();
