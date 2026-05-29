import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { apiClient } from '../lib/api';
import { getAuthToken, getStoredUser } from '../lib/account';

type ChatMessage = {
  id: string;
  sender: 'user' | 'admin' | 'system';
  text: string;
  createdAt: string;
};

type ChatThread = {
  id: string;
  userName: string;
  email: string;
  phone: string;
  messages: ChatMessage[];
};

type ChatProfile = {
  name: string;
  email: string;
  phone: string;
};

const readGuestProfile = (): ChatProfile => {
  try {
    const raw = localStorage.getItem('guestChatProfile');
    if (raw) return JSON.parse(raw) as ChatProfile;
  } catch {
    // Ignore malformed local profile data.
  }

  return { name: '', email: '', phone: '' };
};

const FloatingChat = () => {
  const storedUser = getStoredUser();
  const token = getAuthToken();
  const [isOpen, setIsOpen] = useState(false);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [profile, setProfile] = useState<ChatProfile>(() => storedUser ? {
    name: storedUser.name || '',
    email: storedUser.email || '',
    phone: storedUser.phone || '',
  } : readGuestProfile());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const authHeaders = useMemo(() => token ? { Authorization: `Bearer ${token}` } : undefined, [token]);
  const canLoadThread = Boolean(storedUser?.email || profile.email);

  useEffect(() => {
    if (!isOpen || !canLoadThread) return undefined;

    let active = true;
    const loadThread = () => {
      apiClient.get<ChatThread>('/api/chat/thread', {
        headers: authHeaders,
        params: {
          name: profile.name || undefined,
          email: profile.email || undefined,
          phone: profile.phone || undefined,
        },
      })
        .then((response) => {
          if (active) setThread(response.data);
        })
        .catch(() => {
          if (active) setError('Chat is temporarily unavailable.');
        });
    };

    loadThread();
    const timer = window.setInterval(loadThread, 6000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [authHeaders, canLoadThread, isOpen, profile.email, profile.name, profile.phone]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages.length, isOpen]);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;
    if (!profile.name || !profile.email) {
      setError('Please add your name and email before sending.');
      return;
    }

    try {
      setSending(true);
      setError('');
      if (!storedUser) {
        localStorage.setItem('guestChatProfile', JSON.stringify(profile));
      }

      const response = await apiClient.post<ChatThread>('/api/chat/messages', {
        text: trimmedMessage,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      }, { headers: authHeaders });

      setThread(response.data);
      setMessage('');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : '';
      setError(message || 'Unable to send message right now.');
    } finally {
      setSending(false);
    }
  };

  const messages = thread?.messages || [];

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-[70] flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-[0_20px_50px_rgba(249,115,22,0.38)] ring-4 ring-white/70 transition-transform hover:scale-105 active:scale-95"
        aria-label="Open chat"
        whileHover={{ y: -2 }}
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-4 z-[69] w-[calc(100vw-2rem)] max-w-[390px] overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]"
          >
            <div className="relative overflow-hidden bg-[#08111f] px-5 py-5 text-white">
              <div className="absolute right-[-30px] top-[-30px] h-28 w-28 rounded-full bg-orange-400/30 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-200 ring-1 ring-white/10">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">LiveFit Support</h3>
                  <p className="text-xs text-white/60">Usually replies soon</p>
                </div>
              </div>
            </div>

            <div className="max-h-[54vh] min-h-[320px] overflow-y-auto bg-slate-50 px-4 py-4">
              {!storedUser && (
                <div className="mb-4 grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-white p-3">
                  <input value={profile.name} onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))} placeholder="Your name" className="rounded-xl border border-slate-100 px-3 py-2 text-xs outline-none focus:border-orange-300" />
                  <input value={profile.email} onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email address" className="rounded-xl border border-slate-100 px-3 py-2 text-xs outline-none focus:border-orange-300" />
                  <input value={profile.phone} onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone optional" className="rounded-xl border border-slate-100 px-3 py-2 text-xs outline-none focus:border-orange-300" />
                </div>
              )}

              {messages.length === 0 ? (
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm leading-6 text-slate-700">
                  Send us a message. Your conversation will be saved for the admin team.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((item) => {
                    const isUser = item.sender === 'user';
                    return (
                      <div key={item.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${isUser ? 'rounded-br-md bg-orange-500 text-white' : 'rounded-bl-md bg-white text-slate-700 border border-slate-100'}`}>
                          <p>{item.text}</p>
                          <p className={`mt-1 text-[10px] ${isUser ? 'text-white/70' : 'text-slate-400'}`}>{item.sender === 'system' ? 'Auto reply' : item.sender === 'admin' ? 'Admin' : 'You'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {error && <div className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">{error}</div>}

            <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your message..."
                className="min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-200"
              />
              <button type="submit" disabled={sending} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg transition-colors hover:bg-orange-500 disabled:opacity-50">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;
