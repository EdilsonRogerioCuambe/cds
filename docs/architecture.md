# System Architecture

Connect Digital School is built with a modern, high-performance architecture leveraging Next.js features.

## 1. Tech Stack
- **Framework:** Next.js 15+ (App Router).
- **Runtime:** Node.js with TypeScript.
- **Database:** MongoDB with Prisma ORM.
- **Auth:** Better Auth (Social + Email/Password).
- **Payments:** Mercado Pago SDK + Webhooks.
- **Email:** Resend.

## 2. Route Groups & Organization
The application uses Next.js Route Groups to organize layouts and access levels:
- `(auth)`: Login, Register, Forgot Password.
- `(landing)`: Public site (Home, Pricing, About).
- `(dashboard)`: Student-specific views (Courses, Progress, Certificates).
- `(admin)`: Management dashboard for owners.
- `(teacher)`: Content creation and grading tools.

## 3. Server Actions & Mutations
All data mutations are handled via **Server Actions** located in the `@/actions` directory.
- `auth.actions.ts`: Registration and session management.
- `course.actions.ts`: Enrollment and content creation.
- `progress.actions.ts`: Heartbeat tracking and completion logic.
- `payment.actions.ts`: Mercado Pago preference creation.

## 4. Video Service Abstraction
To avoid vendor lock-in, the video system uses an interface-based abstraction.

### Interface Definition
```typescript
export interface VideoService {
  upload(file: File): Promise<VideoUploadResult>;
  getStreamUrl(videoId: string): Promise<string>;
  getSignedUrl(videoId: string): Promise<string>;
}
```

### Initial Implementation (VPS)
Initially, videos are hosted on a dedicated VPS and processed via FFmpeg into HLS streams for adaptive playback.

### Future Implementation (Bunny.net/S3)
The system is designed to switch to services like Bunny Stream or AWS S3 + CloudFront simply by changing the `VIDEO_PROVIDER` environment variable and implementing the `VideoService` interface.
