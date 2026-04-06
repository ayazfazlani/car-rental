
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { G_EVENTS } from './g-events';
import { APP } from './constants';
import { Contact, ContactType, Metadata, Prisma } from "@prisma/client";

type NumericLike =
  | Prisma.Decimal
  | string
  | number
  | bigint
  | null
  | undefined;


/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for the backend

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toISOString().split("T")[0];
}

/**
 * Create slug from string
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

/**
 * Pagination helper
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function getPaginationParams(searchParams: {
  page?: string;
  limit?: string;
}): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.limit || "20", 10))
  );
  return { page, limit };
}

export function getPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationResult {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages: Number.isNaN(totalPages) ? 1 : totalPages,
  };
}

/**
 * API Response helpers
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string, message?: string): ApiResponse {
  return {
    success: false,
    error,
    message,
  };
}


export function praseDecimal(value: any, defaultValue: number = 0): number {
  return parseFloat(value.toString().replace(/[^0-9.]/g, '')) || defaultValue
}


export const removeAllDecimal = <T>(value: any): T => {
  if (value === null || value === undefined) {
    return value
  }

  // Handle Date objects -> convert to ISO string for JSON safety
  if (value instanceof Date) {
    return value.toISOString() as unknown as T
  }

  // Prisma Decimal → number
  if (value && typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
    return value.toNumber() as unknown as T
  }

  // Array
  if (Array.isArray(value)) {
    return value.map(item => removeAllDecimal(item)) as unknown as T
  }

  // Object
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      result[key] = removeAllDecimal(val)
    }
    return result as T
  }

  // Primitive
  return value
}


export function parseFloatFromString(value: string | undefined | number): number {
  if (!value) return 0
  if (typeof value === 'string') {
    if (Number.isNaN(parseFloat(value))) {
      return 0
    }
    return parseFloat(value)
  }

  return value || 0
}

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export function trackCarView(car: { id: string, name: string, brandId: string, categoryId: string, model: string }) {
  if (!window.gtag) return

  window.gtag('event', G_EVENTS.CAR_VIEW, {
    title: car.name,
    car_id: car.id,
    brandId: car.brandId,
    categoryId: car.categoryId,
    model: car.model,
  })
}

export function trackBrandView(brand: { id: string, name: string }) {
  if (!window.gtag) return

  window.gtag('event', G_EVENTS.BRAND_VIEW, {
    title: brand.name,
    brandId: brand.id,
  })
}

export function trackCategoryView(category: { id: string, name: string }) {
  if (!window.gtag) return

  window.gtag('event', G_EVENTS.CATEGORY_VIEW, {
    title: category.name,
    categoryId: category.id,
  })
}

export function trackCallNow(car: { id: string, name: string }) {
  if (!window.gtag) return

  window.gtag('event', G_EVENTS.CALL_NOW, {
    title: car.name,
    car_id: car.id,
  })
}

export function trackWhatsapp(car: { id: string, name: string }) {
  if (!window.gtag) return

  window.gtag('event', G_EVENTS.WHATSAPP, {
    title: car.name,
    car_id: car.id,
  })
}

const MAP: Record<'luxus' | 'oneclick', { name: string, url: string }> = {
  luxus: {
    name: 'Luxus Car Rental',
    url: 'https://luxuscarrental.com'
  },
  oneclick: {
    name: 'One Click Car Rental',
    url: 'https://oneclickrentcar.com'
  }
}
export function whatsAppMessage(
  phone: string,
  car: {
    id: string
    name: string
    slug: string
    baseDailyPrice?: number | Prisma.Decimal | null
    baseWeeklyPrice?: number | Prisma.Decimal | null
    baseMonthlyPrice?: number | Prisma.Decimal | null
  } & { brand?: { name: string } },
): string {
  const hostInfo = MAP[APP]
  let url = `https://api.whatsapp.com/send?phone=${phone}&text=`

  url += `Hi, I'm contacting from ${hostInfo.url} for the  for following car %0A%0A`
  url += `*${car.name}* %0A`
  let price = 'Price: '
  if (car.baseDailyPrice) {
    price += `AED ${toNumberSafe(car.baseDailyPrice)}/day`
  }
  if (car.baseWeeklyPrice) {
    price += ` | AED ${toNumberSafe(car.baseWeeklyPrice)}/week`
  }
  if (car.baseMonthlyPrice) {
    price += ` | AED ${toNumberSafe(car.baseMonthlyPrice)}/month`
  }
  url += `${price} %0A`

  url += `Listing Link: ${hostInfo.url}/cars/${car.slug} %0A`

  return url
}

export const METADATA_BASE_URL = MAP[APP].url

export const getImageUrl = (image: string | null | undefined) => {
  if (!image) return null
  if (image.includes('http')) return image
  
  // Always return relative path for local images to fix next/image 403 errors
  return image.startsWith('/') ? image : `/${image}`
}

export const getAbsoluteImageUrl = (image: string | null | undefined) => {
  if (!image) return null
  if (image.includes('http')) return image
  const hostInfo = MAP[APP]
  const rel = image.startsWith('/') ? image : `/${image}`
  return `${hostInfo.url}${rel}`
}


export function toNumberSafe(
  value: NumericLike,
  options?: {
    defaultValue?: number;
    throwOnInvalid?: boolean;
  }
): number {
  const { defaultValue = 0, throwOnInvalid = false } = options || {};

  if (value === null || value === undefined) return defaultValue;

  // Prisma Decimal
  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  // BigInt
  if (typeof value === "bigint") {
    return Number(value);
  }

  // Number
  if (typeof value === "number") {
    if (Number.isFinite(value)) return value;
  }

  // String
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!isNaN(parsed)) return parsed;
  }

  if (throwOnInvalid) {
    throw new Error(`Cannot convert value to number: ${value}`);
  }

  return defaultValue;
}

export const getContactLink = (contact: Contact) => {
  if (contact.type === ContactType.PHONE) {
    return `tel:${contact.value}`
  }
  if (contact.type === ContactType.EMAIL) {
    return `mailto:${contact.value}`
  }
  if (contact.type === ContactType.WHATSAPP) {
    return `https://wa.me/${contact.value}`
  }
}

export const querify = (params: Record<string, any>) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value.toString());
    }
  }
  return '?' + query.toString();
};


export const sentanceCase = (str: string) => {
  const sanatized = str.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().replace(/\s+/g, ' ').toLowerCase();
  return sanatized.charAt(0).toUpperCase() + sanatized.slice(1);
}

export const formatMetadata = (meta?: Metadata | null) => {
  if (!meta) {
    return {
      title: "luxus Car Rental",
      description: 'Luxus Car Rental is the ultimate car rental platform for luxury cars.',
      applicationName: "Luxus Car Rental",
      keywords: 'Car Rental, Luxury Car Rental, Luxus Car Rental, Luxus Car Rental',
      assets: ['/images/luxuslogo.png'],
      openGraph: {
        title: 'luxus Car Rental - Luxury Car Rental',
        description: 'Luxus Car Rental is the ultimate car rental platform for luxury cars.',
        siteName: "Luxus Car Rental",
        locale: 'en_US, ar',
        images: ['/images/luxuslogo.png'],
        type: 'website'
      },
    }
  }

  return {
    title: meta.title + ' | Luxus Car Rental',
    description: meta.description,
    keywords: meta.keywords,
    assets: ['/images/luxuslogo.png'],
    applicationName: "Luxus Car Rental",
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: "Luxus Car Rental",
      locale: 'en_US, ar',
      images: ['/images/luxuslogo.png'],
      type: 'website'
    },
  }
}