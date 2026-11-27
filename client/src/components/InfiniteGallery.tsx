import InfiniteStrip from './InfiniteStrip';

const photoWidth = () => Math.min(window.innerWidth * 0.72, 440);

/** Galería de fotos: carrusel infinito automático que se desliza con mouse o dedo. */
export default function InfiniteGallery({ images, name }: { images: string[]; name: string }) {
  const list = images.filter(Boolean);
  return (
    <InfiniteStrip
      itemWidth={photoWidth}
      items={list.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${name} — foto ${i + 1}`}
          loading={i < 3 ? undefined : 'lazy'}
          draggable={false}
          className="h-[260px] w-[72vw] rounded-[28px] object-cover sm:h-[340px] sm:w-[440px]"
        />
      ))}
    />
  );
}
