import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirectImageUrl(url: string | undefined): string {
  if (!url) return "";
  
  // Format Google Drive links to direct image links using the thumbnail API
  // This bypasses the recent restrictions on uc?export=view
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (url.includes('drive.google.com') && fileIdMatch) {
    return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1200`;
  }
  
  return url;
}
