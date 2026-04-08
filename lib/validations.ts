import { ContactType, FuelType, TransmissionType, HomePageSectionType } from "@prisma/client";
import { z } from "zod";
import { PAGE_METATAGS } from "./constants";

/**
 * Home Page Section validation schemas
 */
export const homePageSectionConfigSchema = z.record(z.any()).optional();

export const homePageSectionSchema = z.object({
  type: z.enum([
    "HERO",
    "AFFORDABLE_CARS",
    "RECOMMENDED_CARS",
    "BRANDS",
    "CATEGORIES",
    "FAQ",
    "TESTIMONIALS",
    "CUSTOM",
  ] as const),
  name: z.string().min(1, "Section name is required"),
  order: z.number().int().min(0, "Order must be a positive number"),
  isVisible: z.boolean().default(true),
  config: homePageSectionConfigSchema,
});

export type THomePageSection = z.infer<typeof homePageSectionSchema>;

export const updateHomePageSectionSchema = homePageSectionSchema.partial().extend({
  type: z.enum([
    "HERO",
    "AFFORDABLE_CARS",
    "RECOMMENDED_CARS",
    "BRANDS",
    "CATEGORIES",
    "FAQ",
    "TESTIMONIALS",
    "CUSTOM",
  ] as const).optional(),
});

export type TUpdateHomePageSection = z.infer<typeof updateHomePageSectionSchema>;

export const reorderSectionsSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int().min(0),
    })
  ).min(1),
});

export type TReorderSections = z.infer<typeof reorderSectionsSchema>;

/**
 * Auth validation schemas
 */
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z.object({
  oldpassword: z.string().min(1, "Old password is required"),
  password: z.string().min(1, "New password is required"),
});

export type TChangePassword = z.infer<typeof changePasswordSchema>

export const carFeaturesSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
})

export const carFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
})

export const rentalTermSchema = z.object({
  title: z.string().min(1, "Title is required"),
  title_ar: z.string().min(1, "Title is required"),
  description: z.string(),
  description_ar: z.string(),
});

export type TRentalTerm = z.infer<typeof rentalTermSchema>

/**
 * Car validation schemas
 */
export const createCarSchema = z.object({
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Car name is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]),
  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC"]),
  seats: z.number().int().min(1).max(20),
  doors: z.number().int().min(1).max(6),
  bags: z.number().int().min(1).max(6),
  engineSize: z.string().optional(),
  horsepower: z.number().int().positive().optional(),
  topSpeed: z.number().int().positive().optional(),
  acceleration: z.number().positive().optional(),
  hasChauffeur: z.boolean().default(false),
  hasSelfDrive: z.boolean().default(true),
  hasGPS: z.boolean().default(true),
  hasBluetooth: z.boolean().default(true),
  hasSunroof: z.boolean().default(false),
  hasLeatherSeats: z.boolean().default(true),
  hasBackupCamera: z.boolean().default(true),
  recommended: z.boolean().default(false),
  affordable: z.boolean().default(false),
  oneDayRental: z.boolean().default(false),
  insurance: z.boolean().default(false),
  baseDailyPrice: z.number().positive("Daily price must be positive"),
  baseWeeklyPrice: z.number().positive().optional(),
  baseMonthlyPrice: z.number().positive().optional(),
  chauffeurDailyPrice: z.number().positive().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  color: z.string().optional(),
  licensePlate: z.string().optional(),
  vin: z.string().optional(),
  carFeatures: z.array(carFeaturesSchema),
  carFaqs: z.array(carFaqSchema),
  requirments: z.array(z.string()),
  mileageLimit: z.number().positive().optional(),
  additionalMileage: z.number().positive().optional(),
  rentalTerms: z.array(rentalTermSchema),

  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  canonical: z.string().optional(),
});

export type TCreateCar = z.infer<typeof createCarSchema>

export const updateCarSchema = createCarSchema.partial().extend({
  status: z.enum(["ACTIVE", "HIDDEN", "MAINTENANCE", "DELETED"]).optional(),
});


/**
 * Review validation schemas
 */
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  title: z.string().optional(),
  comment: z.string().optional(),
});

/**
 * Car availability validation schemas
 */
export const setAvailabilitySchema = z
  .object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    isAvailable: z.boolean(),
    reason: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

/**
 * Rental pricing validation schemas
 */
export const createPricingSchema = z.object({
  period: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  price: z.number().positive("Price must be positive"),
  isChauffeur: z.boolean().default(false),
  minDays: z.number().int().positive().optional(),
  maxDays: z.number().int().positive().optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
});

/**
 * Brand validation schemas
 */
const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.undefined()])
  .transform((val) => (val === "" ? undefined : val));

const optionalString = z
  .union([z.string(), z.literal(""), z.undefined()])
  .transform((val) => (val === "" ? undefined : val));

export const createBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().min(1, "Slug is required"),
  logoUrl: optionalUrl.optional(),
  description: optionalString.optional(),

  seo_title: optionalString.optional(),
  seo_description: optionalString.optional(),
  seo_keywords: optionalString.optional(),
  canonical: optionalString.optional(),
});

export const updateBrandSchema = createBrandSchema.partial().extend({
  isActive: z.boolean().optional(),
});

/**
 * Category validation schemas
 */
export const createCategorySchema = z.object({
  type: z.enum(["SEDAN", "SUV", "SPORTS", "LUXURY", "COUPE", "CONVERTIBLE"]),
  name: z.string().min(1, "Category name is required"),
  discription: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  iconUrl: z.string().url().optional(),
  description: z.string().optional(),
  showOnHome: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  canonical: z.string().optional(),
});

/**
 * Car image validation schemas
 */
export const updateImageSchema = z.object({
  altText: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
});

export const carFiltersSchema = z.object({
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().default(0).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  transmission: z.enum([TransmissionType.AUTOMATIC, TransmissionType.MANUAL]).optional(),
  fuelType: z.enum([FuelType.DIESEL, FuelType.ELECTRIC, FuelType.HYBRID, FuelType.PETROL]).optional(),
  seats: z.coerce.number().int().positive().optional(),
  hasChauffeur: z.coerce.boolean().optional(),
  hasSelfDrive: z.coerce.boolean().optional(),
  hasGPS: z.coerce.boolean().optional(),
  hasBluetooth: z.coerce.boolean().optional(),
  hasSunroof: z.coerce.boolean().optional(),
  hasLeatherSeats: z.coerce.boolean().optional(),
  hasBackupCamera: z.coerce.boolean().optional(),
  afforable: z.coerce.boolean().optional(),
  recommended: z.coerce.boolean().optional(),
  search: z.string().optional(),
  period: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
  start: z.coerce.number().default(0).optional(),
  limit: z.coerce.number().positive().optional(),
});

export type TCarFilter = z.infer<typeof carFiltersSchema>

export const homeHeroSchema = z.object({
  tagline: z.string().optional().nullable(),
  tagline_ar: z.string().optional().nullable(),
  heading: z.string().optional().nullable(),
  heading_ar: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  description_ar: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imageSrc: z.string().optional().nullable(),
});

export type THomeHero = z.infer<typeof homeHeroSchema>

export const contactSchema = z.object({
  title: z.string().min(1, "Title is required"),
  value: z.string().min(1, "Phone number is required"),
  type: z.enum([ContactType.PHONE, ContactType.EMAIL, ContactType.WHATSAPP]).default(ContactType.PHONE),
  enabled: z.boolean().default(false),
});

export type TContact = z.infer<typeof contactSchema>

export const enableContactSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type TEnableContact = z.infer<typeof enableContactSchema>

export const FaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  question_ar: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  answer_ar: z.string().min(1, "Answer is required"),
  isEnabled: z.boolean().default(true),
});

export type TFaq = z.infer<typeof FaqSchema>

export const CreateBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be in lowercase and hyphen separated'),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  cover: z.string(),
  info: z.string(),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  content: z.any(),
  draft: z.boolean(),
  canonical: z.string().optional(),
});

export type TCreateBlog = z.infer<typeof CreateBlogSchema>

/**
 * Admin User Management validation schemas
 */

export const createAdminUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional().nullable(),
});

export type TCreateAdminUser = z.infer<typeof createAdminUserSchema>;

export const updateAdminUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  phone: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type TUpdateAdminUser = z.infer<typeof updateAdminUserSchema>;

export const metaDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  keywords: z.string().min(1, "Keywords is required"),
  page: z.enum(
    [
      PAGE_METATAGS.HOME,
      PAGE_METATAGS.CARS,
      PAGE_METATAGS.BLOGS,
      PAGE_METATAGS.CONTACT,
      PAGE_METATAGS.ABOUT,
      PAGE_METATAGS.PRIVACY_POLICY,
      PAGE_METATAGS.TERMS_CONDITIONS,
      PAGE_METATAGS.TERMS_OF_USE,
      PAGE_METATAGS.BRANDS,
      PAGE_METATAGS.CATEGORIES,
    ]
  ),
  canonical: z.string().optional(),
})

export type TMetaData = z.infer<typeof metaDataSchema>;