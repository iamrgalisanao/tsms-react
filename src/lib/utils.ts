import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date according to TSMS standards
 * @param date The date to format
 * @returns Formatted date string in YYYY-MM-DDThh:mm:ssZ format
 */
export function formatTSMSDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Format a date for display in the UI
 * @param date The date to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDisplayDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Format currency according to TSMS standards
 * @param amount The amount to format
 * @returns Formatted currency string with 2 decimal places
 */
export function formatTSMSCurrency(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Format currency for display in the UI
 * @param amount The amount to format
 * @param currencyCode The currency code (default: PHP)
 * @returns Formatted currency string
 */
export function formatDisplayCurrency(
  amount: number,
  currencyCode: string = "PHP",
): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
