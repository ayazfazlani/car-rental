import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Configuration for file uploads
 */
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "cars");
const BRAND_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "brands");
const ASSET_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "assets");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/tiff",
  "image/bmp",
];

/**
 * Ensure upload directory exists
 */
export async function ensureUploadDir(): Promise<void> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop() || "jpg";
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Validate file
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024
        }MB`,
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(
        ", "
      )}`,
    };
  }

  return { valid: true };
}

/**
 * Save uploaded file to disk
 */
export async function saveFile(
  file: File,
  carId: string
): Promise<{ fileName: string; filePath: string; url: string }> {
  await ensureUploadDir();

  // Create car-specific directory
  const carDir = join(UPLOAD_DIR, carId);
  if (!existsSync(carDir)) {
    await mkdir(carDir, { recursive: true });
  }

  // Generate unique filename
  const fileName = generateFileName(file.name);
  const filePath = join(carDir, fileName);

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);

  // Generate public URL
  const url = `/uploads/cars/${carId}/${fileName}`;

  return {
    fileName,
    filePath,
    url,
  };
}

/**
 * Delete file from disk
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    // Extract path from URL
    // URL format: /uploads/cars/{carId}/{fileName}
    const urlPath = url.replace("/uploads/", "");
    const filePath = join(process.cwd(), "public", "uploads", urlPath);

    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw - file might already be deleted
  }
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return mimeToExt[mimeType] || "jpg";
}

/**
 * Save brand logo file to disk
 */
export async function saveBrandLogo(
  file: File,
  brandId?: string
): Promise<{ fileName: string; filePath: string; url: string }> {
  // Ensure brand upload directory exists
  if (!existsSync(BRAND_UPLOAD_DIR)) {
    await mkdir(BRAND_UPLOAD_DIR, { recursive: true });
  }

  // Generate unique filename
  const fileName = generateFileName(file.name);
  const filePath = join(BRAND_UPLOAD_DIR, fileName);

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);

  // Generate public URL
  const url = `/uploads/brands/${fileName}`;

  return {
    fileName,
    filePath,
    url,
  };
}

/**
 * Delete brand logo file from disk
 */
export async function deleteBrandLogo(url: string): Promise<void> {
  try {
    // Extract path from URL
    // URL format: /uploads/brands/{fileName}
    const urlPath = url.replace("/uploads/brands/", "");
    const filePath = join(BRAND_UPLOAD_DIR, urlPath);

    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error("Error deleting brand logo:", error);
    // Don't throw - file might already be deleted
  }
}

/**
 * Save asset logo file to disk
 */
export async function saveAsset(
  file: File,
): Promise<{ fileName: string; filePath: string; url: string }> {
  // Ensure asset upload directory exists
  if (!existsSync(ASSET_UPLOAD_DIR)) {
    await mkdir(ASSET_UPLOAD_DIR, { recursive: true });
  }

  // Generate unique filename
  const fileName = generateFileName(file.name);
  const filePath = join(ASSET_UPLOAD_DIR, fileName);

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);

  const url = `/uploads/assets/${fileName}`;

  return {
    fileName,
    filePath,
    url,
  };
}

/**
 * Delete asset logo file from disk
 */
export async function deleteAsset(url: string): Promise<void> {
  try {
    const urlPath = url.replace("/uploads/assets/", "");
    const filePath = join(ASSET_UPLOAD_DIR, urlPath);

    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error("Error deleting brand logo:", error);
  }
}
