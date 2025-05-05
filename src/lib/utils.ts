import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { fileExtensionsCategories } from "./consts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DateTimeOffsets = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

/**
 * Add years, months, days, hours, minutes, and/or seconds to a Date.
 * @param baseDate - The initial Date to adjust.
 * @param offsets - Object specifying how much to add to each part.
 * @returns A new Date object, adjusted by the specified offsets.
 */
export function addDateTime(baseDate: Date, offsets: DateTimeOffsets = {}): Date {
  const { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = offsets;

  const newDate = new Date(baseDate.getTime());

  newDate.setFullYear(newDate.getFullYear() + years);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setDate(newDate.getDate() + days);

  newDate.setHours(newDate.getHours() + hours);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  newDate.setSeconds(newDate.getSeconds() + seconds);

  return newDate;
}

export function getAbbreviatedName(str?: string) {
  if (!str) return;

  return str
    .split(" ")
    .map((w) => w[0])
    .join("");
}

export function camelToCapitalized(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (char) => char.toUpperCase()) // Capitalize first letter
    .trim();
}

export const DEFAULT_BACKUP_CODE_SEGMENT_LENGTH = 3;
export function generateBackupCode(segmentLength?: number) {
  const segments = new Uint16Array(segmentLength || DEFAULT_BACKUP_CODE_SEGMENT_LENGTH);
  crypto.getRandomValues(segments);

  const backupCode = Array.from(segments)
    .map((num) => num.toString(16).padStart(4, "0"))
    .join("")
    .toUpperCase();

  return backupCode;
}

export async function copyToClipboard(textToCopy: string) {
  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (error) {
    throw error;
  }
}

export function groupFileTypesToChart(files: string[]): {
  chartConfig: { [key: string]: { label: string; color: string } };
  chartData: { [key: string]: number }[];
} {
  // Build extension-to-category lookup
  const extToCategory: Record<string, string> = {};
  for (const cat of fileExtensionsCategories) {
    for (const ext of cat.extensions) {
      extToCategory[ext] = cat.category;
    }
  }

  // Prepare an array with all known categories (from fileExtensionsCategories) plus "Others"
  const allCategories = fileExtensionsCategories.map((cat) => cat.category);
  allCategories.push("Others");

  // Initialize groups for each category
  const groups: {
    [key: string]: { category: string; files: string[]; count: number };
  } = {};
  for (const category of allCategories) {
    groups[category] = { category, files: [], count: 0 };
  }

  // Process each file once
  for (const file of files) {
    const fileName = file.split("/").pop();
    const ext = fileName?.split(".").pop()?.toLowerCase();
    // Determine category using the extension lookup; default to "Others"
    const category = ext && extToCategory[ext] ? extToCategory[ext] : "Others";
    groups[category].files.push(file);
    groups[category].count++;
  }

  // Create chartData: an array with a single object mapping category names to their counts
  const chartDataObject: { [key: string]: number } = {};
  for (const category of allCategories) {
    chartDataObject[category] = groups[category].count;
  }
  const chartData = [chartDataObject];

  // Create chartConfig: an object mapping category names to {label, color} pairs.
  // Colors are assigned sequentially using CSS variables: var(--chart-1), var(--chart-2), etc.
  const chartConfig: { [key: string]: { label: string; color: string } } = {};
  allCategories.forEach((category, index) => {
    chartConfig[category] = {
      label: category,
      color: `var(--chart-${index + 1})`,
    };
  });

  return { chartConfig, chartData };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const clamp = (x: number, min: number, max: number) => {
  return Math.min(Math.max(x, min), max);
};
