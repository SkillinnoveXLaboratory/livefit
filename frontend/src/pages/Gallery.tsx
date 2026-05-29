import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../lib/api';
import { resolveYogaImageUrl } from '../lib/yogaPrograms';

type GalleryImage = {
  id: string;
  title: string;
  image: string;
  alt: string;
  displayOrder: number;
};

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiClient.get<GalleryImage[]>('/api/gallery')
      .then((response) => {
        if (active) setImages(response.data);
      })
      .catch((error) => console.error('Unable to load gallery:', error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f4ee] px-4 pb-24 pt-32 text-sky-950 sm:px-6">
      <section className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-12 overflow-hidden rounded-[3rem] bg-[#0a1128] px-8 py-14 text-white shadow-2xl md:px-14 md:py-20"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-orange-300">
            <ImageIcon className="h-4 w-4" /> Picture Gallery
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Wellness moments, postures, and community stories in one gallery.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
            Photos uploaded from the admin panel appear here automatically.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-[2rem] bg-white/80" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-orange-200 bg-white px-8 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-black">No gallery photos published yet</h2>
            <p className="mt-3 text-sm font-medium text-slate-500">Upload photos from the admin dashboard and they will show here.</p>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {images.map((item, index) => (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.03, duration: 0.45 }}
                className="group mb-5 break-inside-avoid overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
              >
                <img src={resolveYogaImageUrl(item.image)} alt={item.alt || item.title} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <figcaption className="p-5">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">{item.title}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Gallery;
