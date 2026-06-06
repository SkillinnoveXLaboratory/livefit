import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Crown, LockKeyhole, Sparkles } from 'lucide-react';

type PremiumAccessGateProps = {
  title: string;
  description: string;
  features: string[];
  productLabel?: string;
};

const PremiumAccessGate: React.FC<PremiumAccessGateProps> = ({
  title,
  description,
  features,
  productLabel = 'Premium',
}) => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-orange-100 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-6rem] h-56 w-56 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="absolute bottom-[-5rem] right-[-4rem] h-56 w-56 rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-orange-600">
            <LockKeyhole className="h-4 w-4" />
            {productLabel} access required
          </div>
          <h2 className="max-w-2xl text-3xl font-black tracking-tight text-sky-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-900/60 sm:text-base">
            {description}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-sky-950">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-slate-100 bg-slate-50 p-6 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200">
            <Crown className="h-7 w-7" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-orange-500">Unlock the full library</p>
          <h3 className="mt-3 text-2xl font-black text-sky-950">Please get premium</h3>
          <p className="mt-3 text-sm leading-6 text-sky-900/60">
            Once your plan is active, the playlist and gallery sections open automatically.
          </p>
          <Link
            to="/pricing#plans"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-950 px-6 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white shadow-xl transition-transform hover:scale-[1.02]"
          >
            View Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-sky-500 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Tick the premium features to continue
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAccessGate;
