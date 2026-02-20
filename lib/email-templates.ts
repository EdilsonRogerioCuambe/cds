/**
 * Branded HTML Email Templates for Connect Digital School
 */

const APP_NAME = "Connect Digital School";
const BRAND_COLOR = "#10D79E";
const DARK_BASE = "#132747";

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: 800; color: ${DARK_BASE}; text-decoration: none; }
    .logo span { color: ${BRAND_COLOR}; }
    .content { background: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #eef2f6; }
    .button { display: inline-block; padding: 14px 30px; background-color: ${BRAND_COLOR}; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="#" class="logo">C<span>o</span>nnect Digital School</a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${APP_NAME}. Todos os direitos reservados.<br>
      Angola, Moçambique e além.
    </div>
  </div>
</body>
</html>
`;

export const getVerificationEmail = (url: string) => baseTemplate(`
  <h2 style="color: ${DARK_BASE}; margin-top: 0;">Bem-vindo ao Futuro!</h2>
  <p>Estamos muito felizes em ter você conosco. Para começar sua jornada de fluência no inglês, precisamos apenas que confirme seu e-mail.</p>
  <a href="${url}" class="button">Verificar minha conta</a>
  <p style="font-size: 14px; color: #64748b; margin-top: 30px;">Se o botão não funcionar, copie e cole este link no seu navegador:<br> ${url}</p>
`);

export const getResetPasswordEmail = (url: string) => baseTemplate(`
  <h2 style="color: ${DARK_BASE}; margin-top: 0;">Redefinição de Senha</h2>
  <p>Recebemos uma solicitação para redefinir a senha da sua conta na CDS. Se você não solicitou isso, pode ignorar este e-mail.</p>
  <a href="${url}" class="button">Redefinir minha senha</a>
  <p style="font-size: 14px; color: #64748b; margin-top: 30px;">Este link expirará em breve por motivos de segurança.</p>
`);

export const getWelcomeEmail = (name: string) => baseTemplate(`
  <h2 style="color: ${DARK_BASE}; margin-top: 0;">Olá, ${name}!</h2>
  <p>Sua conta foi verificada com sucesso. Agora você tem acesso total à plataforma de inglês mais inovadora do mercado.</p>
  <p>O que você pode fazer agora?</p>
  <ul style="padding-left: 20px; color: #475569;">
    <li>Completar seu perfil de aluno.</li>
    <li>Fazer seu teste de nivelamento.</li>
    <li>Explorar nossos cursos e módulos.</li>
  </ul>
  <a href="#" class="button">Acessar meu Dashboard</a>
`);
export const getOTPEmailTemplate = (code: string, typeLabel: string) => baseTemplate(`
  <h2 style="color: ${DARK_BASE}; margin-top: 0;">${typeLabel}</h2>
  <p>Seu código de 6 dígitos é:</p>
  <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
    <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: ${BRAND_COLOR};">${code}</span>
  </div>
  <p style="font-size: 14px; color: #64748b;">Este código expirará em 5 minutos por motivos de segurança.</p>
`);
