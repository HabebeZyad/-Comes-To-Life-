import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetUrl(path?: string) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  if (path.startsWith('/')) {
    return `${base}${path.slice(1)}`.replace(/\/\//g, '/');
  }
  return `${base}${path}`.replace(/\/\//g, '/');
}
