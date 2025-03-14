import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
export function addDateTime(
  baseDate: Date,
  offsets: DateTimeOffsets = {}
): Date {
  const {
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = offsets;

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
