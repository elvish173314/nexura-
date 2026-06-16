'use client';
import Image from 'next/image';
import { useState } from 'react';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  return (
    <div>
      <div
        className="relative aspect-square overflow-hidden rounded-2xl border border-white/10"
        onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}
      >
        <Image
          src={images[active]} alt={name} fill
          className={`object-cover transition duration-300 ${zoom ? 'scale-125' : 'scale-100'}`}
        />
      </div>
      <div className="mt-3 flex gap-3">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)} className={`relative h-20 w-20 overflow-hidden rounded-lg border ${active === i ? 'border-nexora-500' : 'border-white/10'}`}>
            <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-neutral-500">Hover image to zoom · 360° viewer (TODO: react-three-fiber model)</p>
    </div>
  );
}
