# Non-Functional Requirements

This document lists the non-functional requirements (NFR) ensuring the technical quality of the platform.

## 1. Performance (NFR-001)
- **Page Load:** < 2 seconds for the initial shell using Server Components.
- **Video Playback:** < 2 seconds start time using CDN optimization.
- **Responsiveness:** Server Action interactions < 300ms.
- **Capacity:** Support 1,000+ concurrent active students.

## 2. Security (NFR-002)
- **Encryption:** HTTPS for all traffic; Bcrypt for passwords.
- **Protection:** Automatic CSRF (Next.js), SQL Injection prevention (Prisma), Rate Limiting.
- **Payments:** PCI compliance via Mercado Pago; Webhook signature verification.
- **Content:** Signed URLs for video delivery to prevent unauthorized downloads.

## 3. Scalability (NFR-003)
- **Infrastructure:** Horizontal scaling on Vercel/VPS.
- **Abstraction:** Video service layer allows easy migration from VPS to Bunny.net/S3.
- **Database:** MongoDB indexing for high-frequency progress updates.

## 4. Usability & Accessibility (NFR-004)
- **Mobile First:** Fully responsive UI using Tailwind CSS.
- **WCAG 2.1 AA:** Minimum compliance for colors and labels.
- **Multi-language:** i18n support for PT-BR and EN.

## 5. Maintainability & Reliability (NFR-005, NFR-006)
- **Testing:** 80%+ unit test coverage; E2E tests for payment flows.
- **Monitoring:** Error logging via Sentry.
- **Backups:** Daily automated database backups.
- **Retries:** Exponential backoff for webhooks and email delivery failures.
