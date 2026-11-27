/** Descarga e impresión de tablas del panel (reservas, movimientos). */

const SEP = ';'; // Excel en español (Argentina) separa columnas con punto y coma

function csvCell(v: unknown): string {
  const s = String(v ?? '').replace(/\r?\n/g, ' ');
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Baja un .csv que abre directo en Excel (con tildes y ñ bien). */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const body = [headers, ...rows].map((r) => r.map(csvCell).join(SEP)).join('\r\n');
  const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/**
 * Abre el cuadro de impresión (se puede imprimir en papel o "Guardar como PDF")
 * con la tabla en una hoja A4 prolija. Usa un iframe oculto: no lo frenan los bloqueadores de ventanas.
 */
export function printTable(opts: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  /** Líneas de resumen al final (ej: "Total: $ 100.000"). */
  summary?: string[];
  /** Índices de columnas que se alinean a la derecha (montos). */
  rightCols?: number[];
}) {
  const { title, subtitle, headers, rows, summary = [], rightCols = [] } = opts;
  const printed = new Date().toLocaleString('es-AR');
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
  @page { size: A4 landscape; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font: 12px/1.35 'Segoe UI', Arial, sans-serif; color: #111; margin: 0; }
  h1 { font-size: 20px; margin: 0; letter-spacing: .02em; }
  .brand { font-size: 11px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: #fb950e; }
  .sub { margin: 2px 0 14px; color: #555; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #555; border-bottom: 2px solid #111; padding: 6px 8px; }
  td { padding: 6px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
  tr { break-inside: avoid; }
  .r { text-align: right; white-space: nowrap; }
  .sum { margin-top: 14px; font-weight: 700; font-size: 13px; }
  .foot { margin-top: 18px; color: #888; font-size: 10px; }
</style></head><body>
<p class="brand">Norte Aventura</p>
<h1>${esc(title)}</h1>
${subtitle ? `<p class="sub">${esc(subtitle)}</p>` : '<p class="sub"></p>'}
<table><thead><tr>${headers.map((h, i) => `<th class="${rightCols.includes(i) ? 'r' : ''}">${esc(h)}</th>`).join('')}</tr></thead>
<tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="${rightCols.includes(i) ? 'r' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
${summary.map((s) => `<p class="sum">${esc(s)}</p>`).join('')}
<p class="foot">Impreso el ${esc(printed)} · ${rows.length} registro${rows.length === 1 ? '' : 's'}</p>
</body></html>`;

  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(frame);
  frame.srcdoc = html;
  frame.onload = () => {
    const w = frame.contentWindow;
    if (!w) return;
    w.focus();
    w.print();
    setTimeout(() => frame.remove(), 2000);
  };
}

export const todayStamp = () => new Date().toISOString().slice(0, 10);
