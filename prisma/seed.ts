import { webcrypto } from "node:crypto";
if (!globalThis.crypto) {
    (globalThis as any).crypto = webcrypto;
}
import { PrismaClient, Role, UserStatus } from "@prisma/client";
import { auth } from "../lib/auth-server";
import { Resend } from "resend";
import { getAdminInviteEmail } from "../lib/email-templates";

// comando para remover todos os dados do banco de dados
// npx prisma db push --force-reset
// npx prisma db seed

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  console.log('🌱 Starting Clean Database Seed with REAL Auth Config...\n');

  // 1. Define Admin Data
  const adminEmail = "edicuambe@gmail.com";
  const tempPassword = "ConnectTemp2026!"; // The temporary password

  console.log(`👤 Checking for Admin: ${adminEmail}`);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('⚠️ Admin already exists. Removing to ensure fresh start...');
    await prisma.account.deleteMany({ where: { userId: existingAdmin.id } });
    await prisma.session.deleteMany({ where: { userId: existingAdmin.id } });
    await prisma.user.delete({ where: { id: existingAdmin.id } });
  }

  console.log('✨ Creating Fresh Admin Account...');

  try {
    // 2. Create via REAL Better Auth API (this handles hashing and additionalFields)
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: tempPassword,
        name: "Edilson Cuambe",
        // Pass essential fields directly
        role: "ADMIN",
        status: "PENDING",
        registrationNumber: "CDS000001",
      },
    });

    if (!result) {
      throw new Error("Failed to create admin via Better Auth API");
    }

    // 3. Ensure email is verified in DB directly for admin
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        emailVerified: true
      }
    });

    console.log('📧 Sending Invitation Email via Resend...');

    // 4. Send Email Notification
    const { data, error } = await resend.emails.send({
      from: "CDS <contato@ubuntuweblab.site>",
      to: adminEmail,
      subject: "Seu Acesso Administrativo - CDS",
      html: getAdminInviteEmail(
        "Edilson Rogério Cuambe",
        tempPassword,
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?email=${encodeURIComponent(adminEmail)}&callbackUrl=/auth/onboarding`
      )
    });

    if (error) {
      console.error('❌ Resend Error:', error);
    } else {
      console.log('✅ Email sent successfully!', data?.id);
    }

    console.log('\n--------------------------------------------------');
    console.log('✅ ADMIN CREATED SUCCESSFULLY');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${tempPassword}`);
    console.log('📝 Status: PENDING (Redirected to password change on login)');
    console.log('--------------------------------------------------\n');

  } catch (err: any) {
    console.error('❌ Error creating admin:', err.message || err);
    if (err.body) console.error('📦 Error Body:', JSON.stringify(err.body, null, 2));
  }

  console.log('✨ Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
