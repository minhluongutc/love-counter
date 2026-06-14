/* =====================================================================
   ☁️  CLOUDFLARE WORKER — Trạm trung chuyển gửi tin nhắn về Telegram
   ---------------------------------------------------------------------
   Mục đích: GIẤU bot token. Trang web public chỉ gọi tới Worker này,
   token nằm an toàn trong Cloudflare (không bao giờ lộ ra code).

   👉 Cách dùng: copy TOÀN BỘ file này, dán vào trình soạn code của
      Cloudflare Worker, rồi đặt 2 biến môi trường:
        - BOT_TOKEN  (kiểu Secret)  = token từ @BotFather
        - CHAT_ID    (kiểu Text)    = chat id từ @userinfobot
      (Tùy chọn) ALLOWED_ORIGIN = https://<tên-github>.github.io
      Chi tiết xem file HUONG-DAN-CLOUDFLARE.md
   ===================================================================== */

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const corsOrigin = allowed === "*" ? (origin || "*") : allowed;

    const cors = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Trình duyệt gửi "preflight" trước -> trả về cho qua
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405, cors);

    // Đọc dữ liệu gửi lên
    let body;
    try { body = await request.json(); }
    catch { return json({ ok: false, error: "Dữ liệu không hợp lệ" }, 400, cors); }

    const from = String(body.from || "").slice(0, 100).trim();
    const text = String(body.text || "").slice(0, 2000).trim();
    if (!text) return json({ ok: false, error: "Lời nhắn đang trống" }, 400, cors);

    if (!env.BOT_TOKEN || !env.CHAT_ID)
      return json({ ok: false, error: "Worker chưa đặt BOT_TOKEN / CHAT_ID" }, 500, cors);

    // Giờ Việt Nam
    let time;
    try { time = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }); }
    catch { time = new Date().toISOString(); }

    const message =
      "💌 Tin nhắn mới từ trang web tình yêu\n" +
      "──────────────\n" +
      "Từ: " + (from || "Người bí ẩn 🥰") + "\n\n" +
      text + "\n\n" +
      "🕒 " + time;

    // Gọi Telegram (token nằm ở phía Worker, không lộ ra ngoài)
    let data;
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.CHAT_ID, text: message }),
      });
      data = await tgRes.json();
    } catch (e) {
      return json({ ok: false, error: "Không gọi được Telegram" }, 502, cors);
    }

    if (!data.ok) return json({ ok: false, error: data.description || "Telegram báo lỗi" }, 502, cors);
    return json({ ok: true }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
