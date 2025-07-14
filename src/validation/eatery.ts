import z from "zod";

export const createEaterySchema = z.object({
  name: z.string(),
  cusineType: z.enum([
    "NORTH_INDIAN",
    "SOUTH_INDIAN",
    "CHINESE",
    "ITALIAN",
    "MEXICAN",
    "CONTINENTAL",
    "THAI",
    "JAPANESE",
    "MEDITERRANEAN",
    "STREET_FOOD",
    "LOCAL_DELICACY",
  ]),
  email: z.string().email(),
  phone: z.string().length(10),
  description: z.string().min(20),
  addressLineOne: z.string(),
  addressLineTwo: z.string().optional(),
  city: z.string(),
  state: z.enum([
    "ANDHRA_PRADESH",
    "ARUNACHAL_PRADESH",
    "ASSAM",
    "BIHAR",
    "CHHATTISGARH",
    "GOA",
    "GUJARAT",
    "HARYANA",
    "HIMACHAL_PRADESH",
    "JHARKHAND",
    "KARNATAKA",
    "KERALA",
    "MADHYA_PRADESH",
    "MAHARASHTRA",
    "MANIPUR",
    "MEGHALAYA",
    "MIZORAM",
    "NAGALAND",
    "ODISHA",
    "PUNJAB",
    "RAJASTHAN",
    "SIKKIM",
    "TAMIL_NADU",
    "TELANGANA",
    "TRIPURA",
    "UTTAR_PRADESH",
    "UTTARAKHAND",
    "WEST_BENGAL",
    "ANDAMAN_AND_NICOBAR_ISLANDS",
    "CHANDIGARH",
    "DADRA_AND_NAGAR_HAVELI_AND_DAMAN_AND_DIU",
    "DELHI",
    "JAMMU_AND_KASHMIR",
    "LADAKH",
    "LAKSHADWEEP",
    "PUDUCHERRY",
  ]),
  pincode: z.string().length(6),
  operatingTime: z
    .object({
      day: z.enum([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]),
      open: z.boolean(),
      from: z.string(),
      to: z.string(),
    })
    .array()
    .optional(),
});

export const getEateryByIdSchema = z.object({
  id: z.string(),
});

export const getEateryByUserSchema = z.object({
  take: z.string(),
  cursor: z.string().optional(),
});

export const getEateriesSchema = z.object({
  name: z.string().optional(),
  cusineType: z
    .enum([
      "NORTH_INDIAN",
      "SOUTH_INDIAN",
      "CHINESE",
      "ITALIAN",
      "MEXICAN",
      "CONTINENTAL",
      "THAI",
      "JAPANESE",
      "MEDITERRANEAN",
      "STREET_FOOD",
      "LOCAL_DELICACY",
    ])
    .optional(),
  city: z.string().optional(),
  operatingTime: z
    .object({
      day: z
        .enum([
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ])
        .optional(),
      open: z.boolean().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .array()
    .optional(),
  isOpen: z.boolean().optional(),
  take: z.string(),
  cursor: z.string().optional(),
  // add Rating and other attributes later...
});
