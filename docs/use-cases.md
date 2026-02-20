# Use Cases

Detailed interaction flows for key platform features.

## UC-001: Student Registration
1. User clicks "Sign Up" on landing page.
2. Fills form; Server Action creates student record.
3. User receives email via Resend; clicks verification link.
4. User takes Placement Test (20 questions).
5. Level (A1-C2) assigned automatically based on score.

## UC-002: Course Purchase (Webhooks)
1. Student selects "Buy Now" on a course.
2. Server Action generates Mercado Pago Checkout URL.
3. Student pays via PIX/Credit Card.
4. **Mercado Pago** sends Webhook to `/api/webhooks/mercadopago`.
5. Platform verifies signature and updates enrollment status.
6. Confirmation email sent via Resend.

## UC-003: Completing a Lesson
1. Student watches video lesson.
2. Client-side player sends progress heartbeat every 30s via Server Action.
3. At 90% completion, Server Action marks lesson as `COMPLETED`.
4. Student awarded 50 points; streak updated.
5. Next lesson unlocked.

## UC-005: Level Progression Exam
1. Student completes all modules in a level.
2. Final Exam unlocks; random questions pulled from pool.
3. Student completes Exam; Server Action auto-grades objective parts.
4. If score ≥ 70%, next level contents are unlocked.
5. If failed < 70%, cooldown (24h) applied before retake.

## UC-006: Certificate Generation
1. Completion criteria met (100% modules + 80% Final Exam).
2. Background job generates PDF with unique verification ID.
3. PDF stored; link sent to user via email.
4. Certificate appears in "My Certificates" dashboard section.
