import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import crypto from 'node:crypto';

let preferenceClient: Preference | null = null;
let paymentClient: Payment | null = null;

/**
 * Cliente Mercado Pago (solo server-side).
 * Devuelve null si falta MP_ACCESS_TOKEN: el sitio sigue funcionando con WhatsApp.
 */
export function mpEnabled(): boolean {
  return !!process.env.MP_ACCESS_TOKEN;
}

function clients() {
  if (!preferenceClient || !paymentClient) {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return null;
    const config = new MercadoPagoConfig({ accessToken });
    preferenceClient = new Preference(config);
    paymentClient = new Payment(config);
  }
  return { preference: preferenceClient, payment: paymentClient };
}

export interface PreferenceInput {
  reservationId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  customerEmail?: string;
}

/**
 * Crea una preferencia de Checkout Pro y devuelve la URL de pago (init_point).
 */
export async function createPreference(input: PreferenceInput): Promise<string | null> {
  const mp = clients();
  if (!mp) return null;

  const clientUrl = (process.env.CLIENT_URL ?? '').replace(/\/+$/, '');
  const apiUrl = (process.env.PUBLIC_URL ?? '').replace(/\/+$/, '');

  const { init_point: initPoint } = await mp.preference.create({
    body: {
      items: [
        {
          id: input.reservationId,
          title: input.title,
          quantity: input.quantity,
          unit_price: input.unitPrice,
          currency_id: 'ARS',
        },
      ],
      payer: input.customerEmail ? { email: input.customerEmail } : undefined,
      external_reference: input.reservationId,
      auto_return: 'approved',
      back_urls: clientUrl
        ? {
            success: `${clientUrl}/pago`,
            pending: `${clientUrl}/pago`,
            failure: `${clientUrl}/pago`,
          }
        : undefined,
      notification_url: apiUrl ? `${apiUrl}/api/payments/webhook` : undefined,
    },
  });

  return initPoint ?? null;
}

/** Trae un pago por id (usado por el webhook). */
export async function getPayment(id: string | number) {
  const mp = clients();
  if (!mp) return null;
  return mp.payment.get({ id: String(id) });
}

/**
 * Verifica la firma del webhook de Mercado Pago (x-signature + x-request-id).
 * Si MP_WEBHOOK_SECRET no está configurado, se omite la verificación.
 */
export function verifyWebhookSignature(
  xSignature: string | undefined,
  xRequestId: string | undefined,
  dataId: string | undefined,
): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // sin secreto configurado, aceptar (modo dev)
  if (!xSignature || !xRequestId || !dataId) return false;

  const parts = Object.fromEntries(
    xSignature.split(',').map((p) => p.split('=').map((s) => s.trim()) as [string, string]),
  );
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${parts.ts};`;
  const hmac = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  return hmac === parts.v1;
}
