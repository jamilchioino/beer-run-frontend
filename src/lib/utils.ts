import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncate(str: string, maxlength: number) {
  return str.length > maxlength ? str.slice(0, maxlength - 1) + "…" : str;
}
