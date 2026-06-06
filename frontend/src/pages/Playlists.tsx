import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Film, PlayCircle } from 'lucide-react';
import { apiClient } from '../lib/api';
import { resolveYogaImageUrl } from '../lib/yogaPrograms';
import PremiumAccessGate from '../components/PremiumAccessGate';
import { usePaidAccess } from '../hooks/usePaidAccess';

type Playlist = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  displayOrder: number;
};

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasAccess, loading: accessLoading } = usePaidAccess('livefit');

  useEffect(() => {
    let active = true;

    apiClient.get<Playlist[]>('/api/playlists')
      .then((response) => {
        if (active) setPlaylists(response.data);
      })
      .catch((error) => console.error('Unable to load playlists:', error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f4ee] pt-32 pb-24 text-sky-950">
      <section className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-14 overflow-hidden rounded-[3rem] bg-[#0a1128] px-8 py-14 text-white shadow-2xl md:px-14 md:py-20"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-orange-300">
            <Film className="h-4 w-4" /> Playlist Library
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Guided wellness videos, lessons, and playlists in one calm place.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
            Browse playlists added from the admin panel. New thumbnails and video links appear here automatically.
          </p>
        </motion.div>

        {loading || accessLoading ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-96 animate-pulse rounded-[2rem] bg-white/70" />
            ))}
          </div>
        ) : hasAccess === false ? (
          <PremiumAccessGate
            title="Playlists are unlocked for premium LiveFit members"
            description="Unlock the playlist library to watch the videos published from the admin dashboard."
            features={[
              'Video playlists',
              'Admin-managed thumbnails',
              'Always current uploads',
              'Full LiveFit library access',
            ]}
          />
        ) : playlists.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-orange-200 bg-white px-8 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-black">No playlists published yet</h2>
            <p className="mt-3 text-sm font-medium text-slate-500">Add one from the admin dashboard and it will show here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist, idx) => (
              <motion.a
                key={playlist.id}
                href={playlist.videoUrl}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.04, duration: 0.45 }}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)]"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={resolveYogaImageUrl(playlist.thumbnail)} alt={playlist.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-sky-950/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-xl">
                    <PlayCircle className="h-7 w-7" />
                  </div>
                </div>
                <div className="p-7">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">{playlist.category}</p>
                  <h2 className="text-2xl font-black leading-tight text-sky-950">{playlist.title}</h2>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">{playlist.description}</p>
                  <div className="mt-7 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                    Watch Playlist <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Playlists;
