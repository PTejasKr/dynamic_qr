<div align="center">

# 🔗 Dynamic QR
### Real-Time QR Code Generator & Redirection Analytics

<p align="center">
  <a href="https://dynamic-qr-opal.vercel.app"><img src="https://img.shields.io/badge/Live-Production%20Site-0070F3?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Site" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

```
  Full-stack Next.js App Router platform for generating editable dynamic QR codes,
  managing shortlinks, and tracking scan analytics.
```

---

</div>

## 📑 Table of Contents

- [Overview](#-overview)
- [API Routes](#-api-routes)
- [Quick Start](#-quick-start)
- [Security Audit](#-security-audit)

---

## 🌟 Overview

**Dynamic QR** decouples printed QR codes from their destination URLs, allowing instant target updates and scan telemetry without reprinting.

---

## 🔌 API Routes

* `POST /api/generate` — Generates dynamic QR payloads.
* `GET / POST /api/qr` — Lists or creates QR records.
* `GET / PATCH / DELETE /api/qr/[id]` — Manages individual QR targets.
* `GET /r/[id]` — High-speed redirection endpoint.

---

## 💻 Quick Start

```bash
git clone https://github.com/PTejasKr/dynamic_qr.git
cd dynamic_qr

npm install
npm run dev
```

---

## 🛡️ Security Audit

* Configure Firebase Admin / NextAuth secrets strictly via server-side environment variables (never expose service account keys in `NEXT_PUBLIC_*`).
* Validate and sanitize destination URLs on `/r/[id]` to prevent open-redirect phishing (`http://` / `https://` allowlist).
