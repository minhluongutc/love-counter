/* =====================================================================
   ❤️  LOGIC & TƯƠNG TÁC  ❤️
   (Bạn không cần sửa file này — chỉ sửa config.js là đủ)
   ===================================================================== */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------------------------------------------------------------
     Chuyển link Google Drive / link ảnh thường thành URL hiển thị được
  ---------------------------------------------------------------- */
  function resolveImg(src) {
    if (!src) return "";
    src = src.trim();
    if (src.includes("drive.google.com")) {
      // bắt id từ .../d/<ID>/...  hoặc  ...?id=<ID>
      const m = src.match(/\/d\/([a-zA-Z0-9_-]+)/) || src.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (m) return "https://lh3.googleusercontent.com/d/" + m[1] + "=w1200";
    }
    return src; // link thường hoặc đường dẫn nội bộ
  }

  function setPhoto(container, src, placeholderHTML) {
    const url = resolveImg(src);
    if (!url) return; // giữ nguyên placeholder
    const img = new Image();
    img.alt = "";
    img.onload = () => { container.innerHTML = ""; container.appendChild(img); };
    img.onerror = () => { /* lỗi link -> giữ placeholder */ };
    img.src = url;
  }

  /* =================================================================
     1. ĐỒNG HỒ ĐẾM NGÀY YÊU
  ================================================================= */
  const start = new Date(CONFIG.startDate);

  function updateCounter() {
    const now = new Date();
    let diff = Math.max(0, now - start);
    const totalDays = Math.floor(diff / 86400000);

    const days = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);

    $("#total-days").textContent = totalDays.toLocaleString("vi-VN");
    $("#t-days").textContent = days;
    $("#t-hours").textContent = pad(hours);
    $("#t-mins").textContent = pad(mins);
    $("#t-secs").textContent = pad(secs);
  }
  updateCounter();
  setInterval(updateCounter, 1000);

  /* =================================================================
     2. THÔNG TIN HAI NGƯỜI + TUỔI + ĐẾM NGƯỢC SINH NHẬT
  ================================================================= */
  function ageFrom(bdStr) {
    const bd = new Date(bdStr), now = new Date();
    let age = now.getFullYear() - bd.getFullYear();
    const m = now.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) age--;
    return age;
  }

  function daysToBirthday(bdStr) {
    const bd = new Date(bdStr), now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let next = new Date(now.getFullYear(), bd.getMonth(), bd.getDate());
    if (next < today) next = new Date(now.getFullYear() + 1, bd.getMonth(), bd.getDate());
    return Math.round((next - today) / 86400000);
  }

  function setupPerson(key, nameId, ageId, bdId) {
    const p = CONFIG[key];
    $(nameId).textContent = p.name;
    $(ageId).textContent = ageFrom(p.birthday) + " tuổi";
    const d = daysToBirthday(p.birthday);
    const nick = p.nickname || p.name;
    $(bdId).textContent = d === 0
      ? `🎉 Hôm nay là sinh nhật ${nick}! Chúc mừng nha!`
      : `🎈 Còn ${d} ngày nữa tới sinh nhật ${nick}`;
  }
  setupPerson("girl", "#girl-name", "#girl-age", "#girl-bd-countdown");
  setupPerson("boy", "#boy-name", "#boy-age", "#boy-bd-countdown");

  setPhoto($("#avatar-girl"), CONFIG.girl.photo);
  setPhoto($("#avatar-boy"), CONFIG.boy.photo);

  /* =================================================================
     3. CỘT MỐC KỶ NIỆM
  ================================================================= */
  const daysSinceStart = Math.floor((new Date() - start) / 86400000);

  const MILES = [
    { d: 1,    emoji: "🌱", label: "Ngày đầu tiên" },
    { d: 30,   emoji: "🌸", label: "1 tháng" },
    { d: 100,  emoji: "💯", label: "100 ngày" },
    { d: 200,  emoji: "✨", label: "200 ngày" },
    { d: 300,  emoji: "🌻", label: "300 ngày" },
    { d: 365,  emoji: "🎂", label: "1 năm" },
    { d: 500,  emoji: "💖", label: "500 ngày" },
    { d: 730,  emoji: "🥂", label: "2 năm" },
    { d: 1000, emoji: "👑", label: "1000 ngày" },
    { d: 1095, emoji: "🏆", label: "3 năm" },
    { d: 1825, emoji: "💍", label: "5 năm" },
    { d: 3650, emoji: "♾️", label: "10 năm" },
  ];

  function fmtDate(d) {
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  const milesWrap = $("#milestones");
  MILES.forEach((m) => {
    const date = new Date(start.getTime() + m.d * 86400000);
    const done = daysSinceStart >= m.d;
    const el = document.createElement("div");
    el.className = "ms-card reveal" + (done ? " done" : "");
    el.innerHTML = `
      <div class="ms-emoji">${m.emoji}</div>
      <div class="ms-num">${m.d.toLocaleString("vi-VN")}</div>
      <div class="ms-label">${m.label}</div>
      <div class="ms-date">${done ? "🎉 đã qua · " : "⏳ "}${fmtDate(date)}</div>`;
    milesWrap.appendChild(el);
  });

  // cột mốc kế tiếp + thanh tiến trình
  const next = MILES.find((m) => m.d > daysSinceStart);
  const prevD = [...MILES].reverse().find((m) => m.d <= daysSinceStart)?.d || 0;
  const mnBox = $("#milestone-next");
  if (next) {
    const remain = next.d - daysSinceStart;
    const pct = Math.round(((daysSinceStart - prevD) / (next.d - prevD)) * 100);
    const nextDate = new Date(start.getTime() + next.d * 86400000);
    mnBox.innerHTML = `
      <div class="mn-title">Cột mốc tiếp theo</div>
      <div class="mn-main">${next.emoji} ${next.label} — còn ${remain} ngày nữa (${fmtDate(nextDate)})</div>
      <div class="mn-bar"><i style="width:0"></i></div>`;
    requestAnimationFrame(() => { mnBox.querySelector("i").style.width = pct + "%"; });
  } else {
    mnBox.innerHTML = `<div class="mn-main">♾️ Hai đứa đã vượt qua mọi cột mốc rồi đó!</div>`;
  }

  /* =================================================================
     4. LOVE METER
  ================================================================= */
  $("#lovemeter-btn").addEventListener("click", () => {
    // tỉ lệ "ngẫu nhiên" nhưng luôn cao và ổn định theo ngày (cho vui)
    const seed = daysSinceStart;
    const val = 95 + (seed * 7) % 6; // 95–100
    const fill = $("#lovemeter-fill");
    const out = $("#lovemeter-value");
    fill.style.width = "0";
    out.textContent = "...";
    requestAnimationFrame(() => { fill.style.width = val + "%"; });
    let cur = 0;
    const t = setInterval(() => {
      cur += 3;
      if (cur >= val) { cur = val; clearInterval(t);
        out.textContent = val + "% 💞";
        burstConfetti();
      } else out.textContent = cur + "%";
    }, 40);
  });

  /* =================================================================
     5. ALBUM ẢNH
  ================================================================= */
  const grid = $("#gallery-grid");
  const caps = ["Khoảnh khắc đáng yêu", "Mãi bên nhau", "Yêu em", "Hạnh phúc", "Kỷ niệm", "Cùng nhau"];
  const photos = (CONFIG.couplePhotos || []).filter(Boolean);

  if (photos.length === 0) {
    // hiện 3 ô mẫu để biết chỗ thêm ảnh
    for (let i = 0; i < 3; i++) addPhotoCard("", caps[i]);
    $("#gallery-hint").textContent = "💡 Mở file js/config.js và dán link ảnh Google Drive vào mục couplePhotos để hiện ảnh ở đây nhé!";
  } else {
    photos.forEach((src, i) => addPhotoCard(src, caps[i % caps.length]));
  }

  function addPhotoCard(src, cap) {
    const rot = (Math.random() * 6 - 3).toFixed(1);
    const card = document.createElement("div");
    card.className = "photo reveal";
    card.style.setProperty("--rot", rot + "deg");
    card.innerHTML = `<div class="ph-img"><span>📷</span></div><div class="ph-cap">${cap}</div>`;
    grid.appendChild(card);
    if (src) setPhoto(card.querySelector(".ph-img"), src);
  }

  /* =================================================================
     6. HỘP LỜI YÊU NGẪU NHIÊN
  ================================================================= */
  let lastQuote = -1;
  $("#quote-btn").addEventListener("click", () => {
    const q = CONFIG.loveQuotes;
    let i; do { i = Math.floor(Math.random() * q.length); } while (i === lastQuote && q.length > 1);
    lastQuote = i;
    const el = $("#quote-text");
    el.style.opacity = "0";
    setTimeout(() => { el.textContent = q[i]; el.style.opacity = "1"; }, 220);
    spawnHearts(window.innerWidth / 2, window.innerHeight / 2, 6);
  });

  /* =================================================================
     7. GỬI TIN NHẮN QUA TELEGRAM
  ================================================================= */
  $("#msg-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const from = $("#msg-from").value.trim();
    const text = $("#msg-text").value.trim();
    const status = $("#msg-status");
    const btn = $("#msg-send");
    if (!text) return;

    const tg = CONFIG.telegram || {};
    const useWorker = !!tg.workerUrl;
    if (!useWorker && (!tg.botToken || !tg.chatId)) {
      status.className = "msg-status err";
      status.textContent = "⚠️ Chưa cấu hình gửi tin. Hãy điền workerUrl (khuyên dùng) trong js/config.js.";
      return;
    }

    status.className = "msg-status loading";
    status.textContent = "Đang gửi... 💌";
    btn.disabled = true;

    // Cách AN TOÀN: gửi qua Cloudflare Worker (token nằm phía Worker).
    // Cách cũ: gọi thẳng Telegram (chỉ để chạy thử ở máy, sẽ lộ token).
    let endpoint, payload;
    if (useWorker) {
      endpoint = tg.workerUrl;
      payload = { from, text };
    } else {
      const message =
        "💌 Tin nhắn mới từ trang web tình yêu\n" +
        "──────────────\n" +
        "Từ: " + (from || "Người bí ẩn 🥰") + "\n\n" +
        text + "\n\n" +
        "🕒 " + new Date().toLocaleString("vi-VN");
      endpoint = `https://api.telegram.org/bot${tg.botToken}/sendMessage`;
      payload = { chat_id: tg.chatId, text: message };
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        status.className = "msg-status ok";
        status.textContent = "✅ Đã gửi thành công! Kiểm tra Telegram nhé 💕";
        $("#msg-text").value = "";
        burstConfetti();
        spawnHearts(window.innerWidth / 2, window.innerHeight / 2, 10);
      } else {
        throw new Error(data.error || data.description || "Gửi thất bại");
      }
    } catch (err) {
      status.className = "msg-status err";
      status.textContent = "❌ Lỗi: " + err.message + ". Kiểm tra lại token/chat id giúp mình nha.";
    } finally {
      btn.disabled = false;
    }
  });

  /* =================================================================
     7b. TIMELINE CHUYỆN TÌNH
  ================================================================= */
  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  const tlList = $("#timeline-list");
  (CONFIG.timeline || []).forEach((item) => {
    const el = document.createElement("div");
    el.className = "tl-item reveal";
    let dateStr = "";
    if (item.date) { const d = new Date(item.date); dateStr = fmtDate(d); }
    el.innerHTML =
      `<div class="tl-dot"></div>
       <div class="tl-card">
         ${dateStr ? `<div class="tl-date">📅 ${dateStr}</div>` : ""}
         <div class="tl-title">${escapeHtml(item.title || "")}</div>
         <div class="tl-desc">${escapeHtml(item.desc || "")}</div>
       </div>`;
    tlList.appendChild(el);
    if (item.photo) {
      const ph = document.createElement("div");
      ph.className = "tl-photo";
      el.querySelector(".tl-card").appendChild(ph);
      setPhoto(ph, item.photo);
    }
  });

  /* =================================================================
     7c. THƯ TÌNH (PHONG BÌ + LIGHTBOX)
  ================================================================= */
  const envelope = $("#envelope");
  const letterModal = $("#letter-modal");
  const lmBody = $("#lm-body");
  const lmNav = $("#lm-nav");
  const envHint = $("#env-hint");
  const letterPhotos = ((CONFIG.loveLetter && CONFIG.loveLetter.photos) || []).filter(Boolean);
  const letterText = ((CONFIG.loveLetter && CONFIG.loveLetter.text) || "").trim();
  let lpIndex = 0;

  function renderLetter() {
    let html = "";
    if (letterText) html += `<div class="lm-letter-text">${escapeHtml(letterText)}</div>`;
    if (letterPhotos.length) html += `<div class="lm-photo" id="lm-photo"></div>`;
    if (!letterText && !letterPhotos.length)
      html = `<div class="lm-letter-text">💌 Chưa có nội dung thư.\nHãy thêm ảnh thư thật hoặc lời nhắn trong file js/config.js (mục loveLetter) nhé!</div>`;
    lmBody.innerHTML = html;

    if (letterPhotos.length) setPhoto($("#lm-photo"), letterPhotos[lpIndex]);

    if (letterPhotos.length > 1) {
      lmNav.innerHTML =
        `<button id="lp-prev">‹ Trước</button>
         <span class="lp-count">${lpIndex + 1}/${letterPhotos.length}</span>
         <button id="lp-next">Sau ›</button>`;
      $("#lp-prev").onclick = () => { lpIndex = (lpIndex - 1 + letterPhotos.length) % letterPhotos.length; renderLetter(); };
      $("#lp-next").onclick = () => { lpIndex = (lpIndex + 1) % letterPhotos.length; renderLetter(); };
    } else lmNav.innerHTML = "";
  }

  function openEnvelope() {
    if (envelope.classList.contains("open")) { renderLetter(); letterModal.hidden = false; return; }
    envelope.classList.add("open");
    envHint.textContent = "Đang mở thư... 💗";
    spawnHearts(window.innerWidth / 2, window.innerHeight / 2, 8);
    setTimeout(() => { renderLetter(); letterModal.hidden = false; }, 650);
  }
  function closeLetter() {
    letterModal.hidden = true;
    envHint.textContent = "Nhấn để đọc lại 💌";
  }
  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
  });
  $("#lm-close").addEventListener("click", closeLetter);
  letterModal.addEventListener("click", (e) => { if (e.target === letterModal) closeLetter(); });

  /* =================================================================
     7d. EM CÓ YÊU ANH KHÔNG? (nút Không chạy trốn)
  ================================================================= */
  const btnNo = $("#btn-no");
  const btnYes = $("#btn-yes");
  const loveqBtns = $("#loveq-btns");
  let dodge = 0;
  const noTexts = ["Không 😜", "Chắc không 🙈", "Hông đâu 😝", "Nghĩ lại đi 🥺", "Thật hả 😢", "Đừng mà 😭", "Bấm Có đi 🥹"];

  function runAway() {
    dodge++;
    btnNo.classList.add("runaway");
    const bw = btnNo.offsetWidth, bh = btnNo.offsetHeight;
    const x = Math.max(16, Math.random() * (window.innerWidth - bw - 32));
    const y = Math.max(80, Math.random() * (window.innerHeight - bh - 100));
    btnNo.style.left = x + "px";
    btnNo.style.top = y + "px";
    btnNo.textContent = noTexts[Math.min(dodge, noTexts.length - 1)];
    btnYes.style.transform = `scale(${Math.min(1 + dodge * 0.12, 2.1)})`;
  }
  btnNo.addEventListener("mouseover", runAway);
  btnNo.addEventListener("click", (e) => { e.preventDefault(); runAway(); });
  btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); runAway(); }, { passive: false });

  btnYes.addEventListener("click", () => {
    $("#loveq-emoji").textContent = "🥰";
    $("#loveq-title").textContent = "Yeahhh! Em cũng yêu anh nhiều lắm! 💗";
    btnNo.classList.remove("runaway");
    loveqBtns.innerHTML =
      `<p style="font-size:1.4rem;color:var(--rose);font-family:'Dancing Script',cursive;margin:0">Mãi mãi bên nhau nhé 💞</p>`;
    burstConfetti();
    for (let i = 0; i < 5; i++)
      setTimeout(() => spawnHearts(Math.random() * window.innerWidth, window.innerHeight * 0.55, 8), i * 200);
  });

  /* =================================================================
     7e. NGÀY ĐẶC BIỆT (pháo hoa + lời chúc)
  ================================================================= */
  const specialModal = $("#special-modal");
  const fwCanvas = $("#fireworks");
  const fwCtx = fwCanvas.getContext("2d");
  let fwParticles = [], fwRAF = null, fwTimer = null;

  function fwResize() { fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; }
  function launchFirework() {
    const x = Math.random() * fwCanvas.width;
    const y = fwCanvas.height * (0.2 + Math.random() * 0.4);
    const hue = 315 + Math.random() * 60; // sắc hồng
    const n = 42;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 / n) * i, sp = 2 + Math.random() * 4.5;
      fwParticles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, col: `hsl(${hue},90%,${62 + Math.random() * 14}%)` });
    }
  }
  function fwLoop() {
    fwCtx.fillStyle = "rgba(90,20,55,0.20)";
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
    fwParticles.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.045; p.life -= 0.012;
      fwCtx.globalAlpha = Math.max(0, p.life);
      fwCtx.fillStyle = p.col;
      fwCtx.beginPath(); fwCtx.arc(p.x, p.y, 2.6, 0, Math.PI * 2); fwCtx.fill();
    });
    fwCtx.globalAlpha = 1;
    fwParticles = fwParticles.filter((p) => p.life > 0);
    fwRAF = requestAnimationFrame(fwLoop);
  }
  function startFireworks() { fwResize(); fwParticles = []; launchFirework(); fwTimer = setInterval(launchFirework, 650); fwLoop(); }
  function stopFireworks() { clearInterval(fwTimer); cancelAnimationFrame(fwRAF); fwParticles = []; fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height); }

  function showSpecial(emoji, title, text) {
    $("#special-emoji").textContent = emoji;
    $("#special-title").textContent = title;
    $("#special-text").textContent = text;
    specialModal.hidden = false;
    startFireworks();
    burstConfetti();
  }
  $("#special-close").addEventListener("click", () => { specialModal.hidden = true; stopFireworks(); });
  window.addEventListener("resize", () => { if (!specialModal.hidden) fwResize(); });

  function checkSpecialDay() {
    const now = new Date();
    const sm = CONFIG.specialMessages || {};
    let emoji = "🎉", title = "Chúc mừng!", msg = null;

    // kỷ niệm hằng tháng (cùng ngày trong tháng với ngày bắt đầu)
    if (now.getDate() === start.getDate() &&
        !(now.getFullYear() === start.getFullYear() && now.getMonth() === start.getMonth())) {
      const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
      if (months > 0 && sm.anniversary) { emoji = "💞"; title = `Kỷ niệm ${months} tháng`; msg = sm.anniversary.replace("{n}", months); }
    }
    // sinh nhật (ưu tiên hiển thị nếu trùng ngày)
    const g = new Date(CONFIG.girl.birthday), b = new Date(CONFIG.boy.birthday);
    if (now.getDate() === g.getDate() && now.getMonth() === g.getMonth() && sm.girlBirthday) { emoji = "🎂"; title = "Happy Birthday Nga!"; msg = sm.girlBirthday; }
    if (now.getDate() === b.getDate() && now.getMonth() === b.getMonth() && sm.boyBirthday) { emoji = "🎂"; title = "Happy Birthday Lượng!"; msg = sm.boyBirthday; }

    // cho phép xem thử bằng cách thêm #celebrate vào cuối link
    if (location.hash === "#celebrate" && !msg) { msg = "Đây là bản xem thử hiệu ứng ngày đặc biệt 💗 (mở vào đúng ngày kỷ niệm/sinh nhật sẽ tự hiện)"; emoji = "🎆"; title = "Xem thử nè!"; }

    if (!msg) return;
    try {
      const key = "lovesite_special_" + now.toDateString();
      if (localStorage.getItem(key) === title) return; // mỗi ngày chỉ hiện 1 lần
      localStorage.setItem(key, title);
    } catch (e) { /* localStorage không khả dụng -> cứ hiện */ }
    setTimeout(() => showSpecial(emoji, title, msg), 800);
  }
  checkSpecialDay();

  /* =================================================================
     8. HIỆU ỨNG VUI: tim bay nền, cánh hoa, click ra tim, typewriter
  ================================================================= */

  // --- typewriter câu chào ---
  const lines = [
    "Cảm ơn vì đã đến bên nhau 💞",
    "Mỗi giây trôi qua là một giây hạnh phúc ✨",
    "Anh yêu em, Nga à ❤️",
    "Mãi mãi là của nhau nhé 🌹",
  ];
  let li = 0, ci = 0, deleting = false;
  const tw = $("#typewriter");
  function type() {
    const cur = lines[li];
    tw.textContent = deleting ? cur.slice(0, ci--) : cur.slice(0, ci++);
    if (!deleting && ci > cur.length) { deleting = true; setTimeout(type, 1600); return; }
    if (deleting && ci < 0) { deleting = false; li = (li + 1) % lines.length; ci = 0; }
    setTimeout(type, deleting ? 35 : 75);
  }
  type();

  // --- tim bay từ dưới lên (nền) ---
  const heartsBg = $("#hearts-bg");
  const emojis = ["💗", "💕", "💖", "🌸", "💓", "🩷", "💘"];
  function spawnBgHeart() {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 14 + Math.random() * 22 + "px";
    h.style.animationDuration = 7 + Math.random() * 8 + "s";
    heartsBg.appendChild(h);
    setTimeout(() => h.remove(), 16000);
  }
  setInterval(spawnBgHeart, 900);
  for (let i = 0; i < 6; i++) setTimeout(spawnBgHeart, i * 300);

  // --- click bất kỳ đâu -> bung tim ---
  function spawnHearts(x, y, n = 8) {
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      h.className = "click-heart";
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const ox = (Math.random() - 0.5) * 80;
      h.style.left = x + ox + "px";
      h.style.top = y + "px";
      h.style.fontSize = 16 + Math.random() * 18 + "px";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 900);
    }
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button, input, textarea, label")) return;
    spawnHearts(e.clientX, e.clientY, 5);
  });

  // --- confetti khi có sự kiện vui ---
  function burstConfetti() {
    const colors = ["#ff5599", "#ff7eb0", "#d6336c", "#ffc9dd", "#ff4d6d", "#ffd1e3"];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = 2 + Math.random() * 2 + "s";
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      if (Math.random() > 0.6) c.style.borderRadius = "50%";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4200);
    }
  }

  // --- cánh hoa rơi (canvas) ---
  const canvas = $("#petals");
  const ctx = canvas.getContext("2d");
  let W, H, petals = [];
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize(); addEventListener("resize", resize);
  function makePetal() {
    return { x: Math.random() * W, y: -20, r: 6 + Math.random() * 8,
      sp: 1 + Math.random() * 1.6, sw: Math.random() * 2 - 1, ang: Math.random() * Math.PI * 2,
      col: ["#ff9ec4", "#ffc1d8", "#ff7eb0", "#ffd6e8"][Math.floor(Math.random() * 4)] };
  }
  for (let i = 0; i < 22; i++) { const p = makePetal(); p.y = Math.random() * H; petals.push(p); }
  function drawPetals() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach((p) => {
      p.y += p.sp; p.x += p.sw + Math.sin(p.ang) * 0.6; p.ang += 0.02;
      if (p.y > H + 20) { Object.assign(p, makePetal()); }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.ang);
      ctx.fillStyle = p.col; ctx.globalAlpha = 0.55;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r / 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(drawPetals);
  }
  drawPetals();

  // --- reveal khi cuộn ---
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* =================================================================
     9. NHẠC NỀN (tuỳ chọn)
  ================================================================= */
  const musicBtn = $("#music-toggle");
  let audio = null;
  if (CONFIG.bgMusic) {
    audio = new Audio(CONFIG.bgMusic);
    audio.loop = true; audio.volume = 0.5;
  }
  musicBtn.addEventListener("click", () => {
    if (!audio) { alert("Chưa có nhạc nền 🎵\nThêm link file .mp3 vào mục bgMusic trong js/config.js nhé!"); return; }
    if (audio.paused) { audio.play(); musicBtn.classList.add("playing"); musicBtn.textContent = "🎶"; }
    else { audio.pause(); musicBtn.classList.remove("playing"); musicBtn.textContent = "🎵"; }
  });

  // Lời chào trong console (easter egg nhỏ)
  console.log("%c❤️ Nga & Lượng — 30/11/2024 ❤️", "color:#d6336c;font-size:20px;font-weight:bold");
})();
