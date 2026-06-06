import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Mail, CheckCircle2, ArrowRight, Globe2, MessageSquare, Target, Phone, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../lib/env';

type InquiryVisual = {
  image: string;
  position: string;
  label: string;
  note: string;
};

const defaultInquiryVisual: InquiryVisual = {
  image: '/images/globall-lite.webp',
  position: 'center center',
  label: 'Choose Your Experience',
  note: 'Select an option to preview the atmosphere for that type of session before you book.',
};

const inquiryVisuals: Record<string, InquiryVisual> = {
  'LiveFit (Yoga & Wellness)': {
    image: '/images/hero-lite.webp',
    position: 'center center',
    label: 'LiveFit Personal Wellness',
    note: 'Private, restorative and energizing sessions designed around your body, mobility and routine.',
  },
  'WorkFit (Corporate Wellness)': {
    image: '/images/team_discussion.webp',
    position: 'center center',
    label: 'WorkFit Corporate Wellness',
    note: 'Wellness experiences for teams that need better focus, posture, resilience and culture.',
  },
  'One-on-One Sessions': {
    image: '/images/oneonone.webp',
    position: 'center center',
    label: 'Dedicated 1:1 Guidance',
    note: 'A more personal setup for technique refinement, deeper support and tailored progression.',
  },
  'Group Classes': {
    image: '/images/zoom.webp',
    position: 'center center',
    label: 'Shared Group Energy',
    note: 'Join a guided class format built around momentum, accountability and collective motivation.',
  },
  'Custom Challenges': {
    image: '/images/Hab6.webp',
    position: 'center center',
    label: 'Custom Challenge Tracks',
    note: 'Create a structured experience with clear goals, stronger engagement and themed progress.',
  },
  Other: {
    image: '/images/globalnetwork.webp',
    position: 'center center',
    label: 'Flexible Wellness Inquiry',
    note: 'If your request is unique, we can shape a format that fits your timing, audience and goals.',
  },
};

const Schedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  
  const timings = Array.from({ length: 8 }).map((_, i) => {
    const startHour = i * 3;
    const endHour = (i * 3 + 3) % 24;
    const formatHour = (h: number) => {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formatted = h % 12 === 0 ? 12 : h % 12;
      return `${formatted}:00 ${ampm}`;
    };
    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
  });

  const timezones = [
    "UTC-12:00 Baker Island", "UTC-11:00 Niue, Samoa", "UTC-10:00 Hawaii-Aleutian Time",
    "UTC-09:00 Alaska Standard Time", "UTC-08:00 Pacific Time (US & Canada)",
    "UTC-07:00 Mountain Time (US & Canada)", "UTC-06:00 Central Time (US & Canada)",
    "UTC-05:00 Eastern Time (US & Canada)", "UTC-04:00 Atlantic Time (Canada)",
    "UTC-03:00 Argentina, Brazil", "UTC-02:00 South Georgia", "UTC-01:00 Azores, Cape Verde",
    "UTC+00:00 Greenwich Mean Time", "UTC+01:00 Central European Time",
    "UTC+02:00 Eastern European Time", "UTC+03:00 Moscow Time", "UTC+03:30 Iran Standard Time",
    "UTC+04:00 Gulf Standard Time", "UTC+04:30 Afghanistan Time", "UTC+05:00 Pakistan Standard Time",
    "UTC+05:30 Indian Standard Time", "UTC+05:45 Nepal Time", "UTC+06:00 Bangladesh Standard Time",
    "UTC+06:30 Myanmar", "UTC+07:00 Indochina Time", "UTC+08:00 China Standard Time",
    "UTC+08:45 Southeastern Western Australia", "UTC+09:00 Japan Standard Time",
    "UTC+09:30 Australian Central Standard Time", "UTC+10:00 Australian Eastern Standard Time",
    "UTC+11:00 Solomon Islands", "UTC+12:00 New Zealand Standard Time", "UTC+13:00 Tonga", "UTC+14:00 Line Islands"
  ];

  const inquiryOptions = [
    "LiveFit (Yoga & Wellness)",
    "WorkFit (Corporate Wellness)",
    "One-on-One Sessions",
    "Group Classes",
    "Custom Challenges",
    "Other"
  ];

  const [formData, setFormData] = useState({ inquiryFor: '', timezone: '', time: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const selectedInquiryVisual = inquiryVisuals[formData.inquiryFor] || defaultInquiryVisual;

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate((location.state as { from?: string } | null)?.from || '/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    try {
      const apiUrl = API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contact/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Unable to send schedule request right now.');
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err instanceof Error ? err.message : 'Unable to send schedule request right now.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl text-center border border-orange-100"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-serif text-sky-950 mb-4 font-bold">Request Received!</h2>
          <p className="text-sky-900/60 mb-8 leading-relaxed">
            Thank you for reaching out. Our team will review your preferred timings and get back to you at your email address shortly.
          </p>
          <button 
            onClick={goBack}
            className="w-full py-4 bg-sky-950 text-white rounded-full font-bold hover:bg-sky-900 transition-all uppercase tracking-widest text-xs"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={goBack}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-700 shadow-sm transition-colors hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <section className="relative overflow-hidden rounded-[2.75rem] border border-orange-100 shadow-[0_32px_90px_rgba(15,23,42,0.12)]">
          <motion.div
            key={selectedInquiryVisual.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${selectedInquiryVisual.image})`,
              backgroundPosition: selectedInquiryVisual.position,
            }}
          />
          <div className="absolute inset-0 bg-slate-950/30" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(115deg, rgba(15,23,42,0.9) 6%, rgba(15,23,42,0.64) 36%, rgba(248,250,252,0.14) 60%, rgba(248,250,252,0.95) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%)]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
            {/* Left Side: Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="pt-4 lg:pt-0"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/20 rounded-full bg-white/10 text-white font-bold text-xs tracking-[0.1em] mb-6 uppercase backdrop-blur-sm">
                Booking & Schedule
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight font-bold tracking-tight">
                Claim Your <br />
                <span className="text-orange-300 italic">Free Trial</span> Class
              </h1>
              <p className="text-xl text-white/78 mb-8 leading-relaxed max-w-xl">
                Experience the transformation firsthand. Select your preferred format and watch the hero background adapt to the kind of session you want.
              </p>

              <motion.div
                key={selectedInquiryVisual.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mb-10 rounded-[2rem] border border-white/15 bg-white/10 px-5 py-5 backdrop-blur-sm"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-200 mb-2">
                  {selectedInquiryVisual.label}
                </p>
                <p className="text-sm leading-6 text-white/82">
                  {selectedInquiryVisual.note}
                </p>
              </motion.div>

              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white font-bold uppercase tracking-widest text-[10px] shadow-sm hover:bg-white/16 transition-all backdrop-blur-sm"
              >
                View Membership Plans
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/12 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <Clock className="w-6 h-6 text-orange-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Flexible Slots</h4>
                    <p className="text-sm text-white/65">Morning, Afternoon, or Evening</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/12 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
                    <Calendar className="w-6 h-6 text-orange-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-widest text-xs">Personalized Match</h4>
                    <p className="text-sm text-white/65">Based on your goals and level</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/88 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/60 relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Calendar className="w-32 h-32 text-orange-500" />
              </div>

              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-sky-950 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                      Inquiry For
                    </label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.inquiryFor}
                        onChange={(e) => setFormData({...formData, inquiryFor: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-orange-500 transition-all text-sky-950 font-medium appearance-none text-sm"
                      >
                        <option value="" disabled>Select option</option>
                        {inquiryOptions.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <Target className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sky-950 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                      Timezone
                    </label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.timezone}
                        onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-orange-500 transition-all text-sky-950 font-medium appearance-none text-sm"
                      >
                        <option value="" disabled>Select timezone</option>
                        {timezones.map((tz, idx) => (
                          <option key={idx} value={tz}>{tz}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <Globe2 className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                  {/* Preferred Timings */}
                  <div>
                    <label className="block text-sky-950 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                      Preferred Call Time
                    </label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-orange-500 transition-all text-sky-950 font-medium appearance-none text-sm"
                      >
                        <option value="" disabled>Select time</option>
                        {timings.map((time, idx) => (
                          <option key={idx} value={time}>{time}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <Clock className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sky-950 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="name@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-orange-500 transition-all text-sky-950 font-medium text-sm"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Number (Optional) */}
                  <div>
                    <label className="block text-sky-950 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                      Contact (Optional)
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:border-orange-500 transition-all text-sky-950 font-medium text-sm"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <Phone className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="mb-8">
                  <label className="block text-sky-950 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                    Additional Comments
                  </label>
                  <div className="relative">
                    <textarea 
                      rows={3} 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pl-12 outline-none focus:border-orange-500 transition-all text-sky-950 font-medium resize-none text-sm"
                      placeholder="Tell us more about your requirements or any specific questions you have..."
                    />
                    <div className="absolute left-4 top-4 pointer-events-none">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Submit Request'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {submitError && (
                  <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {submitError}
                  </div>
                )}

                <p className="mt-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  * We will contact you within 24 hours to <br /> confirm your session details.
                </p>

                <div className="mt-6 text-center">
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Want to compare plans first?
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Schedule;


