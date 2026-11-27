import { adminFetch } from './api';

const MAX_SIDE = 2200;
const MAX_BYTES = 3 * 1024 * 1024; // el server acepta hasta 4 MB (y Vercel 4,5 MB por pedido)

function canvasToBlob(c: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((r) => c.toBlob(r, type, quality));
}

/** Achica y comprime la foto en el navegador para que suba rápido y no pese de más. */
async function shrink(file: File): Promise<Blob> {
  if (file.type === 'image/gif') return file;
  const bmp = await createImageBitmap(file);
  let side = MAX_SIDE;
  let quality = 0.85;
  for (let i = 0; i < 5; i++) {
    const k = Math.min(1, side / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = (await canvasToBlob(c, 'image/webp', quality)) ?? (await canvasToBlob(c, 'image/jpeg', quality));
    if (blob && blob.size <= MAX_BYTES) {
      bmp.close();
      return blob;
    }
    side *= 0.8;
    quality = Math.max(0.6, quality - 0.08);
  }
  bmp.close();
  throw new Error('No se pudo achicar la foto lo suficiente. Probá con una más liviana.');
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = () => reject(new Error('No se pudo leer la foto'));
    r.readAsDataURL(blob);
  });
}

/** Sube una foto al bucket público "media" y devuelve su URL. */
export async function uploadImage(file: File, folder = 'general'): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen');
  const blob = await shrink(file);
  const data = await toBase64(blob);
  const res = await adminFetch<{ url: string }>('/uploads', {
    method: 'POST',
    body: JSON.stringify({ data, contentType: blob.type, folder }),
  });
  return res.url;
}
