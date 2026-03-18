import { MercadoPagoConfig, Preference, Payment, PreApproval } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN is not configured");
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { timeout: 5000, idempotencyKey: undefined },
});

export const preference = new Preference(client);
export const payment = new Payment(client);
export const preApproval = new PreApproval(client);
