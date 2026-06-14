# ☁️ Hướng dẫn cấu hình Cloudflare Worker để gửi tin nhắn Telegram an toàn

Mục tiêu: giấu **BOT TOKEN** trong Cloudflare để khi host web public (GitHub Pages)
token **không bị lộ**. Web chỉ gọi tới Worker, Worker mới gọi Telegram.

> 💳 Cloudflare Workers gói **Free** miễn phí (100.000 lượt/ngày) và **không cần nhập thẻ**.
> Khi đăng ký/chọn gói, cứ chọn **Free** là được.

---

## 0. Chuẩn bị (Telegram)
Bạn cần 2 thứ này:
- **BOT_TOKEN**: nhắn `@BotFather` → `/newbot` → đặt tên → nhận token dạng `123456:ABC...`
- **CHAT_ID**: nhắn `@userinfobot` → bấm Start → lấy số `Id`
- Mở bot vừa tạo, bấm **/start** một lần (để bot được phép nhắn cho bạn).

---

## 1. Tạo tài khoản Cloudflare
1. Vào https://dash.cloudflare.com/sign-up
2. Đăng ký bằng email + mật khẩu, xác nhận email. (Không cần thẻ.)

## 2. Tạo Worker
1. Menu trái chọn **Workers & Pages**.
2. Bấm **Create application** → **Create Worker**.
3. ⚠️ Ở bước **"Select a method"**: chọn **"Start with Hello World"**
   (hoặc "Start from scratch" / "Hello World").
   **KHÔNG chọn "Import a repository" / kết nối GitHub** — đường đó dành cho
   repo đã là dự án Worker, sẽ báo lỗi với repo trang web tĩnh của bạn.
   (Nếu lỡ chọn nhầm: bấm **Back** quay về "Select a method" rồi chọn lại.)
4. Đặt tên, ví dụ `love-telegram`.
   → Tên này tạo ra URL dạng `https://love-telegram.<tên-bạn>.workers.dev`
   (lần đầu Cloudflare sẽ cho bạn chọn `<tên-bạn>` — đặt gì cũng được).
5. Bấm **Deploy** để tạo (lúc này là code mẫu mặc định).

## 3. Dán code Worker
1. Sau khi Deploy, bấm **Edit code** (hoặc **Continue to project** → **Edit code**).
2. **Xoá hết** code mẫu trong trình soạn thảo.
3. Mở file `cloudflare-worker.js` (cùng thư mục web này), **copy toàn bộ**, dán vào.
4. Bấm **Deploy** (hoặc **Save and deploy**).

## 4. Đặt biến môi trường (QUAN TRỌNG — chỗ giấu token)
1. Vào Worker → tab **Settings** → mục **Variables and Secrets**
   (có thể tên là "Variables" tuỳ phiên bản).
2. Thêm các biến sau (bấm **Add**):

   | Tên (Name)       | Giá trị (Value)                 | Kiểu        |
   |------------------|---------------------------------|-------------|
   | `BOT_TOKEN`      | token từ @BotFather             | **Secret** 🔒 |
   | `CHAT_ID`        | chat id từ @userinfobot         | Text        |
   | `ALLOWED_ORIGIN` | `https://<tên-github>.github.io`| Text (tuỳ chọn) |

   - `ALLOWED_ORIGIN` là địa chỉ trang web của bạn (chỉ phần gốc, không có đường dẫn
     phía sau). Để hạn chế web khác gọi nhờ Worker. Nếu chưa rõ, có thể bỏ qua,
     mặc định cho phép tất cả.
3. Bấm **Save / Deploy** lại để biến có hiệu lực.

## 5. Lấy URL Worker và dán vào web
1. Vào tab **Settings** (hoặc trang chính của Worker), copy URL dạng:
   `https://love-telegram.<tên-bạn>.workers.dev`
2. Mở file `js/config.js`, dán vào:
   ```js
   telegram: {
     workerUrl: "https://love-telegram.<tên-bạn>.workers.dev",
     botToken: "",
     chatId:   "",
   },
   ```
3. Lưu lại, đẩy code lên GitHub. Xong!

---

## 6. Kiểm tra
- Mở trang web → phần "Gửi lời nhắn" → gõ thử → bấm **Gửi đi**.
- Nếu Telegram nhận được tin → thành công 🎉
- Nếu báo lỗi: kiểm tra lại `BOT_TOKEN`/`CHAT_ID` trong Cloudflare, và đã bấm
  **/start** với bot chưa.

## ⚠️ Nếu token cũ đã từng nằm trong code và đẩy lên GitHub
Token đó coi như đã lộ. Hãy vào `@BotFather` → `/revoke` (hoặc `/token`) để
**huỷ token cũ và tạo token mới**, rồi chỉ đặt token mới trong Cloudflare
(không bao giờ để trong file công khai nữa).
