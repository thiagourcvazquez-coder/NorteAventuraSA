import { WhatsAppIcon } from './Icons';

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/5493874039502?text=Hola%20Norte%20Aventura!%20Quiero%20consultar%20por%20una%20excursi%C3%B3n."
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-norte-whatsapp text-white shadow-lg transition hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
