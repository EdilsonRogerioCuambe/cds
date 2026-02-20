# Database Schema

The platform uses **Prisma** with **MongoDB**. Below is the core object model.

## Core Models

### User
Stores account details, role (STUDENT, TEACHER, ADMIN), points, and streaks.

### Course, Module & Lesson
The hierarchical content structure. Lessons contain `videoId` references for the Video Service.

### Enrollment
Join table between `User` and `Course`, including `startDate`, `endDate`, and `status`.

### Progress
Tracks lesson completion and watch time (`watchTime`, `lastPosition`).

### Quiz & QuizAttempt
Multiple Question types stored as JSON for flexibility. Attempts track student scores and pass/fail status.

### Payment
Tracks transaction status (PENDING, APPROVED, REJECTED) and includes the `mercadoPagoId` for synchronization.

### Certificate
Stores unique `verificationCode`, `pdfUrl`, and issue date.

## Prisma Schema Snippet (Conceptual)
```prisma
model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  email String @unique
  role  Role   @default(STUDENT)
  points Int   @default(0)
  // ...
}

model Enrollment {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  userId   String @db.ObjectId
  courseId String @db.ObjectId
  status   EnrollmentStatus
  // ...
}
```
*For the full schema, refer to the `prisma/schema.prisma` file in the project root.*
