import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { resolveYogaImageUrl } from '../lib/yogaPrograms';
import PremiumAccessGate from '../components/PremiumAccessGate';
import { usePaidAccess } from '../hooks/usePaidAccess';

type GalleryImage = {
  id: string;
  title: string;
  image: string;
  alt: string;
  category: string;
  displayOrder: number;
};

const categories = ['All', 'Meditation Library', 'Practice Library', 'Picture Gallery'];

const Gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category') || 'All';
  const activeCategory = categories.includes(requestedCategory) ? requestedCategory : 'All';
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasAccess, loading: accessLoading } = usePaidAccess('livefit');

  useEffect(() => {
    let active = true;
    setLoading(true);

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

  const filteredImages = useMemo(
    () => activeCategory === 'All'
      ? images
      : images.filter((image) => (image.category || 'Picture Gallery') === activeCategory),
    [activeCategory, images]
  );

  const selectCategory = (category: string) => {
    setSearchParams(category === 'All' ? {} : { category });
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-24 pt-32 text-sky-950 sm:px-6">
      <section className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10 overflow-hidden rounded-[2rem] bg-[#0a1128] px-6 py-12 text-white shadow-2xl sm:rounded-[3rem] sm:px-8 md:px-14 md:py-20"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-orange-300">
            <ImageIcon className="h-4 w-4" /> Gallery & Practice Library
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Wellness inspiration, mindful practice, and community moments.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
            Browse every photo uploaded from the admin panel, organized by library category.
          </p>
        </motion.div>

        <div className="mb-10 flex gap-3 overflow-x-auto pb-3 sm:flex-wrap sm:justify-center">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => selectCategory(category)}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-colors ${
                activeCategory === category
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading || accessLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-[2rem] bg-slate-100" />
            ))}
          </div>
        ) : hasAccess === false ? (
          <PremiumAccessGate
            title="This gallery is part of the premium LiveFit library"
            description="The gallery and practice pages are unlocked for paid members only. Upgrade once and access every categorized photo collection from the admin panel."
            features={[
              'Meditation Library',
              'Practice Library',
              'Picture Gallery',
              'Fresh uploads from admin',
            ]}
          />
        ) : filteredImages.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-orange-200 bg-white px-8 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-black">No photos published in {activeCategory}</h2>
            <p className="mt-3 text-sm font-medium text-slate-500">Choose another category or upload photos from the admin dashboard.</p>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filteredImages.map((item, index) => (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: Math.min(index * 0.025, 0.2), duration: 0.4 }}
                className="mb-5 break-inside-avoid overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
              >
                <img src={resolveYogaImageUrl(item.image)} alt={item.alt || item.title} className="w-full object-cover" loading="lazy" />
                <figcaption className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">{item.category || 'Picture Gallery'}</p>
                  <p className="mt-2 text-base font-bold text-sky-950">{item.title}</p>
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
