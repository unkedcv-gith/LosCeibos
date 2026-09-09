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

export function buildWhatsAppConsultationUrl(phone: string, title?: string): string {
  if (!title) {
    const defaultMsg = "Hola! Me gustaría consultar sobre las novedades del colegio.";
    return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;
  }

  // 1. Remove HTML tags if present
  let cleanTitle = title.replace(/<[^>]*>/g, " ");

  // 2. Remove UTF-8 replacement characters (U+FFFD), BOM, and invisible control characters
  cleanTitle = cleanTitle.replace(/[\uFFFD\uFEFF\u0000-\u001F\u007F-\u009F]/g, "");

  // 3. Remove smart quotes, curly quotes, guillemets, asterisks, bullet points, and decorators
  cleanTitle = cleanTitle.replace(/[“”«»""''`*•·_~#]/g, "");

  // 4. Remove emojis or non-standard symbols that can break or cause black diamond replacement characters in WhatsApp URL parsers
  // Retains letters (including accents like á, é, í, ó, ú, ñ, ü), numbers, spaces and standard punctuation
  cleanTitle = cleanTitle.replace(/[^\p{L}\p{N}\s,.:;()\-–—_?!]/gu, "");

  // 5. Clean leading and trailing punctuation or non-alphanumeric clutter and excess whitespace
  cleanTitle = cleanTitle
    .replace(/^[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+/g, "")
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ.,!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const message = cleanTitle
    ? `Hola! Me gustaría consultar sobre: ${cleanTitle}`
    : "Hola! Me gustaría consultar sobre las novedades del colegio.";

  // 6. Uniformly encode the ENTIRE message with encodeURIComponent so no raw unencoded UTF-8 breaks the query parameter
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
