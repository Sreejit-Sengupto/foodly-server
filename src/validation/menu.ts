import z from "zod";

export const createMenuItemSchema = z.object({
  eateryId: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  prepTimeMin: z.string(),
  isFeatured: z.boolean(),
  tags: z
    .enum([
      "VEG",
      "NON_VEG",
      "VEGAN",
      "GLUTEN_FREE",
      "DAIRY_FREE",
      "SPICY",
      "SWEET",
      "HEALTHY",
      "HIGH_PROTEIN",
      "LOW_CALORIE",
      "CHEF_SPECIAL",
      "SEASONAL",
      "KIDS_FRIENDLY",
      "QUICK_BITE",
    ])
    .array(),
});

export const createManyMenuItemsSchema = createMenuItemSchema.array();

export const updateMenuItemSchema = z.object({
  id: z.string(),
  eateryId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  discount: z.string().optional(),
  availability: z.enum([
    "AVAILABLE",
    "UNAVAILABLE",
    "LIMITED",
    "OUT_OF_STOCK",
    "COMING_SOON",
  ]),
  prepTimeMin: z.string().optional(),
  isFeatured: z.boolean().optional(),
  tags: z
    .enum([
      "VEG",
      "NON_VEG",
      "VEGAN",
      "GLUTEN_FREE",
      "DAIRY_FREE",
      "SPICY",
      "SWEET",
      "HEALTHY",
      "HIGH_PROTEIN",
      "LOW_CALORIE",
      "CHEF_SPECIAL",
      "SEASONAL",
      "KIDS_FRIENDLY",
      "QUICK_BITE",
    ])
    .array()
    .optional(),
});

export const deleteMenuItemSchema = z.object({
  id: z.string(),
  eateryId: z.string(),
});

export const getMenuSchema = z.object({
  eateryId: z.string(),
  take: z.string(),
  cursor: z.string().optional(),
});

export const getMenuItemSchema = z.object({
  id: z.string(),
  eateryId: z.string(),
});
