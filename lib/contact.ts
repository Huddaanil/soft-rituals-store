// Order/contact details shown on the site. Digits only for the wa.me link
// (country code first, no + or spaces); the display form is what visitors see.
export const WHATSAPP_NUMBER = "258847786762";
export const WHATSAPP_DISPLAY = "+258 84 778 6762";

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
