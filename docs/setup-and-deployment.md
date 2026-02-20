# Setup & Deployment

This document guide provides instructions for setting up the environment and deploying the platform.

## 1. Environment Variables
Create a `.env` file in the root directory based on the following template (see `.env.example` for full list):

```env
DATABASE_URL="mongodb+srv://..."
BETTER_AUTH_SECRET="your_secret"
MERCADO_PAGO_ACCESS_TOKEN="your_token"
RESEND_API_KEY="your_key"
VIDEO_PROVIDER="vps"
```

## 2. Installation
1. Clone the repository.
2. Run `npm install`.
3. Run `npx prisma generate` to create the client.
4. Run `npm run dev` for local development.

## 3. Testing Strategy
- **Unit Tests:** Located in `__tests__/`, covering Server Actions and utility functions.
- **Integration Tests:** Focused on Mercado Pago Webhook handling and Auth flows.
- **E2E Tests:** Using Playwright to verify "Critical Paths" (Register → Buy Course → Watch Lesson).

## 4. Deployment Checklist
- [ ] **Database:** Setup MongoDB Atlas cluster.
- [ ] **Hosting:** Deploy Next.js to **Vercel**.
- [ ] **Videos:** Setup VPS with FFmpeg or Bunny.net Library.
- [ ] **Payments:** Configure Webhook URL in Mercado Pago Dashboard: `https://your-domain.com/api/webhooks/mercadopago`.
- [ ] **Emails:** Verify sender domain in Resend.
- [ ] **CDN:** (Optional) Setup Cloudflare for static assets and video delivery.
