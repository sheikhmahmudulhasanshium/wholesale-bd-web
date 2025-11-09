import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const slugify = (prefix: string, text: string) => {
  const a = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const b = a.replace(/(^-|-$)+/g, '');
  return `${prefix}-${b}`;
};