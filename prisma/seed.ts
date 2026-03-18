import { PrismaClient, Role, UserStatus } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import { getAdminInviteEmail } from "../lib/email-templates";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
});

async function main() {
  console.log('🌱 Starting Clean Database Seed with Email Notification...\n');

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
    // 2. Create via Better Auth API
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: tempPassword,
        name: "Edilson Cuambe",
      },
    });

    // 3. Elevate to ADMIN and set PENDING status
    const user = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: "ADMIN" as Role,
        status: "PENDING" as UserStatus,
        registrationNumber: "CDS000001",
        emailVerified: true
      }
    });

    console.log('📧 Sending Invitation Email via Resend...');
    
    // 4. Send Email Notification
    const { data, error } = await resend.emails.send({
      from: "CDS <contato@ubuntuweblab.site>",
      to: adminEmail,
      subject: "Seu Acesso Administrativo - Connect Digital School",
      html: getAdminInviteEmail("Edilson Cuambe", tempPassword)
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

  } catch (err) {
    console.error('❌ Error creating admin:', err);
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
