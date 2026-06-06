import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Navigation from './Navigation';
import Logo from './Logo';
import FloatingChat from './FloatingChat';
import { apiClient } from '../lib/api';
import { getSiteContactSettings, storeSiteContactSettings, type SiteContactSettings } from '../lib/account';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isWorkFitPage = location.pathname.startsWith('/workfit') || location.pathname.startsWith('/solutions');
  const helpCenterPath = isWorkFitPage ? '/workfitinquiry' : '/livefitinquiry';
  const [contactSettings, setContactSettings] = useState<SiteContactSettings>(getSiteContactSettings());

  useEffect(() => {
    let active = true;

    apiClient.get<SiteContactSettings>('/api/content/site-settings')
      .then((response) => {
        if (!active) return;
        setContactSettings(response.data);
        storeSiteContactSettings(response.data);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-white flex flex-col w-full">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <FloatingChat />
      
      <footer className="bg-white pt-24 pb-12 border-t border-sky-50 relative overflow-hidden">
        <div className="w-full px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
            {/* Brand Section */}
            <div className="lg:col-span-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-8">
                <Link to="/">
                  <Logo />
                </Link>
              </div>
              <p className="text-sky-800 font-medium leading-relaxed mb-10 max-w-sm mx-auto md:mx-0 opacity-70">
                Elevating corporate consciousness through ancient wisdom and modern technology. We build resilient, healthy, and high-performance teams worldwide.
              </p>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-2 text-center md:text-left">
              <h4 className="font-bold text-sky-950 mb-8 uppercase tracking-widest text-[10px]">Ecosystem</h4>
              <ul className="space-y-4">
                <li><Link to="/workfit" className="text-sky-600 hover:text-sky-950 transition-colors text-sm font-bold">WorkFit</Link></li>
                <li><Link to="/solutions" className="text-sky-600 hover:text-sky-950 transition-colors text-sm font-bold">Solutions Ecosystem</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2 text-center md:text-left">
              <h4 className="font-bold text-sky-950 mb-8 uppercase tracking-widest text-[10px]">Resources</h4>
              <ul className="space-y-4">
                <li><Link to={helpCenterPath} className="text-sky-600 hover:text-sky-950 transition-colors text-sm font-bold">Help Center</Link></li>
                <li><a href="#" className="text-sky-600 hover:text-sky-950 transition-colors text-sm font-bold">Careers</a></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="lg:col-span-4 text-center md:text-left">
              <h4 className="font-bold text-sky-950 mb-8 uppercase tracking-widest text-[10px]">Connect</h4>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center justify-center md:justify-start gap-4 text-sky-800 text-sm font-bold">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  Workfitbylivefit@gmail.com
                </li>
                <li className="flex items-start justify-center md:justify-start gap-4 text-sky-800 text-sm font-bold">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 text-left">
                    <a href={`tel:+${String(contactSettings.livefitPhone || '919890008742').replace(/\D/g, '')}`} className="block hover:text-sky-950 transition-colors">
                      LiveFit: {contactSettings.livefitPhone || '+91 9890008742'}
                    </a>
                    <a href={`tel:+${String(contactSettings.workfitPhone || '19256602776').replace(/\D/g, '')}`} className="block text-sky-500 hover:text-sky-950 transition-colors">
                      WorkFit: {contactSettings.workfitPhone || '+1 925 660 2776'}
                    </a>
                  </div>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-4 text-sky-800 text-sm font-bold">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  Imperia tower II, Mira Road, Mumbai 401107,India
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-sky-50 flex flex-col md:flex-row justify-between items-center gap-8 text-center">
            <p className="text-sky-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              © 2024 LiveFit. Designed for the Conscious Professional.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy-policy" className="text-sky-400 hover:text-sky-600 text-[10px] font-bold uppercase tracking-widest transition-colors">Privacy Policy</Link>
              <Link to="/termsofservice" className="text-sky-400 hover:text-sky-600 text-[10px] font-bold uppercase tracking-widest transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-sky-50/50 rounded-full blur-[120px] -z-10" />
      </footer>
    </div>
  );
};

export default Layout;
