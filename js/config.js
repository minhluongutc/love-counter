/* =====================================================================
   ❤️  CẤU HÌNH TRANG WEB TÌNH YÊU  ❤️
   ---------------------------------------------------------------------
   Đây là file DUY NHẤT bạn cần sửa. Mọi thứ khác cứ để yên.
   Sửa xong thì lưu lại (Ctrl+S) và mở lại index.html là thấy thay đổi.
   ===================================================================== */

const CONFIG = {

  /* ---- NGÀY BẮT ĐẦU YÊU NHAU (đã hardcode theo yêu cầu) ---- */
  startDate: "2024-11-30T00:00:00",

  /* ---- THÔNG TIN HAI NGƯỜI ---- */
  girl: {
    name: "Nguyễn Thanh Nga",
    nickname: "Nga Xinh",          // tên gọi thân mật (tuỳ chỉnh)
    birthday: "2002-02-25",
    photo: "https://drive.google.com/file/d/16sw9860a6zpJf2kDQGRGLeJGb6aLKFzq/view?usp=sharing",                // <-- DÁN LINK ẢNH BẠN GÁI VÀO ĐÂY
  },

  boy: {
    name: "Nguyễn Minh Lượng",
    nickname: "Anh Lượng",        // tên gọi thân mật (tuỳ chỉnh)
    birthday: "2002-11-30",
    photo: "https://drive.google.com/file/d/1Fj9F9be5cGfcwlmvDwFtPYFSKfa1cgay/view?usp=share_link",                // <-- DÁN LINK ẢNH BẠN TRAI VÀO ĐÂY
  },

  /* ---- ẢNH CẢ HAI NGƯỜI (album kỷ niệm) ----
     Cứ thêm bao nhiêu link ảnh tuỳ thích, cách nhau bởi dấu phẩy. */
  couplePhotos: [
     "https://drive.google.com/file/d/19M4l9EmAX7SAijJnSUHuwqiPreV0_5l1/view?usp=share_link",
     "https://drive.google.com/file/d/1uLkSw9JnIW8TwxfxQHDom7PpvdiTK8_n/view?usp=share_link",
     "https://drive.google.com/file/d/16AAd10fgQBNC0jQcvp_-h_l0M3WQ7DGb/view?usp=share_link"
  ],

  /* =====================================================================
     CÁCH LẤY LINK ẢNH TỪ GOOGLE DRIVE (rất dễ):
     1. Upload ảnh lên Google Drive.
     2. Chuột phải vào ảnh -> "Chia sẻ" -> đổi quyền thành
        "Bất kỳ ai có đường liên kết" (Anyone with the link).
     3. Bấm "Sao chép liên kết" và dán nguyên cái link đó vào đây.
        (Trang web sẽ tự động chuyển đổi để hiển thị được ảnh.)
     Bạn cũng có thể dán link ảnh thường (https://...jpg) hoặc
     để ảnh vào thư mục /img rồi ghi "img/ten-anh.jpg".
     ===================================================================== */

  /* ---- 📨 GỬI TIN NHẮN VỀ TELEGRAM (qua Cloudflare Worker — AN TOÀN) ----
     Để host public mà KHÔNG lộ token: token được giấu trong Cloudflare,
     ở đây chỉ cần dán URL Worker. Hướng dẫn ở file HUONG-DAN-CLOUDFLARE.md */
  telegram: {
    // ✅ CÁCH AN TOÀN: dán URL Worker của bạn vào đây
    // ví dụ: "https://love-telegram.tenban.workers.dev"
    workerUrl: "",

    /* ⚠️ (Không khuyến nghị) Cách cũ gọi thẳng Telegram — token SẼ BỊ LỘ
       khi host public. Token/chatId đã được chuyển sang Cloudflare nên để trống. */
    botToken: "",
    chatId:   "",
  },

  /* ---- NHỮNG LỜI YÊU THƯƠNG (bấm nút sẽ hiện ngẫu nhiên 1 câu) ----
     Bạn có thể thêm / sửa thoải mái cho hợp với hai đứa. */
  loveQuotes: [
    "Gặp được em là điều may mắn nhất đời anh 🥰",
    "Nga ơi, anh yêu em nhiều lắm đó! 💗",
    "Mỗi ngày bên em đều là ngày đặc biệt 🌸",
    "Anh muốn nắm tay em đi hết quãng đường còn lại 👫",
    "Em là lý do anh cười mỗi sáng thức dậy ☀️",
    "Cảm ơn em vì đã xuất hiện trong cuộc đời anh 💕",
    "Dù bao lâu đi nữa, anh vẫn chọn em 💍",
    "Em cứ là em, anh sẽ yêu cả những điều nhỏ nhặt nhất 🐻",
    "Trái tim anh chỉ có một chỗ, và nó dành cho Nga 💞",
    "Hẹn em ở tất cả những mùa yêu sau nữa nhé 🍂",
    "Yêu em hôm qua, hôm nay và mãi mãi ♾️",
    "Em là nhà của anh đó, Nga à 🏠❤️",
  ],

  /* ---- NHỮNG LÝ DO ANH YÊU EM (chạy chữ tự động) ---- */
  reasons: [
    "Vì nụ cười của em làm ngày của anh tươi sáng hơn",
    "Vì em luôn ở bên anh những lúc khó khăn",
    "Vì cách em quan tâm những điều nhỏ nhất",
    "Vì giọng nói của em là âm thanh anh muốn nghe mỗi ngày",
    "Vì em làm cho cuộc sống của anh có ý nghĩa",
    "Vì chỉ cần có em, ở đâu cũng là hạnh phúc",
  ],

  /* ---- 💌 THƯ TÌNH (mở phong bì ra xem) ----
     - photos: dán link ẢNH THƯ THẬT (chụp lá thư tay). Nhiều trang thì
       thêm nhiều link, cách nhau dấu phẩy. (Hỗ trợ link Google Drive.)
     - text: nếu muốn, gõ thêm lời nhắn ở đây (xuống dòng bằng cách
       bấm Enter trong dấu nháy `...`). Để trống cũng được. */
  loveLetter: {
    photos: [
      // "https://drive.google.com/file/d/XXXX/view?usp=sharing",  // trang 1
      // "https://drive.google.com/file/d/YYYY/view?usp=sharing",  // trang 2
    ],
    text: `Gửi Nga của anh,

Cảm ơn em đã luôn ở bên anh suốt quãng thời gian qua.
Mỗi ngày được yêu em là một ngày anh thấy mình may mắn.
Anh hứa sẽ luôn trân trọng và yêu thương em thật nhiều.

Yêu em,
Lượng ❤️`,
  },

  /* ---- 📖 TIMELINE CHUYỆN TÌNH ----
     Mỗi mốc gồm: ngày (date), tiêu đề (title), mô tả (desc), ảnh (photo).
     Cứ thêm / sửa thoải mái cho đúng kỷ niệm của hai đứa. */
  timeline: [
   {date: "2024-09-27", title: "Tạm biệt học viện, Xin chào Thanh Nga", desc: "", photo: "https://drive.google.com/file/d/1blSuHQRxTIBIVSGnWeclTCIWPX7LKANj/view?usp=share_link"},
    { date: "2024-10-05", title: "Lần hẹn hò đầu tiên ☕", desc: "", photo: "https://drive.google.com/file/d/19M4l9EmAX7SAijJnSUHuwqiPreV0_5l1/view?usp=share_link" },
    { date: "2024-11-30", title: "Ngày đầu yêu nhau 💑", desc: "Em nhận lời yêuuuuuu 💗", photo: "https://drive.google.com/file/d/1blSuHQRxTIBIVSGnWeclTCIWPX7LKANj/view?usp=share_link" },
   //  { date: "",           title: "Chuyến đi đầu tiên ✈️", desc: "Cùng nhau đi đâu, làm gì...", photo: "" },
   //  { date: "",           title: "Kỷ niệm khó quên 🌟", desc: "Một khoảnh khắc đặc biệt của hai đứa...", photo: "" },
  ],

  /* ---- 🎉 LỜI CHÚC NGÀY ĐẶC BIỆT (tự hiện kèm pháo hoa) ----
     {n} sẽ được thay bằng số tháng yêu nhau. */
  specialMessages: {
    anniversary:  "Chúc mừng {n} tháng yêu nhau! 💞 Cảm ơn em vì mọi điều ngọt ngào. Yêu em nhiều!",
    girlBirthday: "🎂 Chúc mừng sinh nhật Nga! Chúc công chúa của anh tuổi mới thật nhiều niềm vui, mãi xinh đẹp và luôn được yêu thương 💗",
    boyBirthday:  "🎂 Chúc mừng sinh nhật Lượng! Chúc anh tuổi mới nhiều sức khỏe, thành công và luôn hạnh phúc bên em 💙",
  },

  /* ---- NHẠC NỀN (tuỳ chọn) ----
     Để link file .mp3 vào đây nếu muốn có nhạc. Để trống thì tắt nhạc. */
  bgMusic: "", // ví dụ: "img/song.mp3"
};

/* =====================================================================
   📲  CÀI TELEGRAM + CLOUDFLARE (làm 1 lần, ~10 phút)
   ---------------------------------------------------------------------
   1. Lấy BOT TOKEN: mở Telegram, tìm "@BotFather", bấm /newbot, đặt tên.
      BotFather đưa cho bạn "BOT TOKEN" (dạng 123456:ABC-xyz...).
   2. Lấy CHAT ID: tìm "@userinfobot", bấm Start -> nó trả về số "Id".
   3. Mở bot vừa tạo, bấm /start một lần (để bot được phép nhắn cho bạn).
   4. Tạo Cloudflare Worker và đặt BOT_TOKEN + CHAT_ID vào đó, rồi dán
      URL Worker vào mục telegram.workerUrl ở trên.

   👉 Hướng dẫn Cloudflare chi tiết từng bước: xem file
      HUONG-DAN-CLOUDFLARE.md (cùng thư mục).

   Lưu ý bảo mật: ĐỪNG để BOT TOKEN trong file này khi host public —
   token chỉ nên nằm trong Cloudflare. Nếu lỡ đẩy token lên GitHub rồi,
   hãy vào @BotFather bấm /revoke để huỷ token cũ và tạo token mới.
   ===================================================================== */
