import "server-only";

// Sends a Telegram message when a new order arrives. No-ops safely if the
// bot isn't configured yet, and never throws (an alert failure must never
// break a customer's checkout).
export async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      // Don't let a slow alert hold up the checkout response.
      signal: AbortSignal.timeout(6000),
    });
  } catch (e) {
    console.error("Telegram notify failed (order is still saved):", e);
  }
}
