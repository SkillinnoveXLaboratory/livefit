import React, { useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { BadgeCheck, Box, ChevronLeft, ChevronRight, ClipboardList, CreditCard, Film, ImagePlus, Images, LayoutDashboard, Leaf, LogOut, Menu, MessageCircle, Pencil, Plus, Save, Send, Settings2, Target, Trash2, Users, X } from 'lucide-react';
import '../styles/admin.css';
import {
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
  adminApiClient,
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  redirectToAdminLogin,
  type AdminManagedUser,
  type AdminOverviewResponse,
  type AdminChatSettings,
  type AdminChatThread,
  type AdminGalleryImage,
  type AdminPackage,
  type AdminPaidUser,
  type AdminPaidUsersResponse,
  type AdminPlaylist,
  type AdminSectionContent,
  type AdminSiteSettings,
  type AdminUsersResponse,
  type AdminWorkfitChallenge,
  type AdminYogaChallenge,
  type AdminYogaChallengesSectionContent,
  type AdminYogaProgram,
  type AdminYogaType,
} from '../lib/admin';
import { resolveYogaImageUrl } from '../lib/yogaPrograms';

type View = 'dashboard' | 'yoga-programs' | 'yoga-types' | 'yoga-challenges' | 'users' | 'paid-users' | 'workfit-challenges' | 'playlists' | 'gallery' | 'packages' | 'chats' | 'settings';
type ModalType = 'program' | 'yoga-type' | 'yoga-challenge' | 'user' | 'paid-user' | 'challenge' | 'playlist' | 'gallery' | 'package' | null;

type ProgramForm = { title: string; tagline: string; desc: string; iconKey: string; overview: string; details: string; benefits: string; displayOrder: string; isActive: boolean; image: string; imageFile: File | null };
type YogaTypeForm = ProgramForm & { perfectFor: string };
type YogaChallengeForm = { title: string; desc: string; iconKey: string; days: string; level: string; category: string; color: string; overview: string; follow: string; bestFor: string; displayOrder: string; isActive: boolean; image: string; imageFile: File | null };
type UserForm = { name: string; email: string; phone: string; role: 'livefit' | 'workfit' | 'admin'; focusAreas: string; password: string };
type PaidUserForm = { status: 'free' | 'paid'; product: 'livefit' | 'workfit'; planId: string; planName: string; expiresAt: string };
type ChallengeForm = { slug: string; title: string; desc: string; image: string; imageFile: File | null; stat: string; statDesc: string; displayOrder: string; isActive: boolean };
type PlaylistForm = { title: string; description: string; videoUrl: string; thumbnail: string; thumbnailFile: File | null; category: string; displayOrder: string; isActive: boolean };
type GalleryForm = { title: string; alt: string; category: string; image: string; imageFile: File | null; displayOrder: string; isActive: boolean };
type PackageForm = { slug: string; name: string; priceLabel: string; amount: string; currency: string; period: string; features: string[]; ctaLabel: string; checkoutType: 'razorpay' | 'whatsapp'; isPopular: boolean; displayOrder: string; isActive: boolean };
type SiteSettingsForm = { livefitPhone: string; workfitPhone: string };

const defaultProgramForm: ProgramForm = { title: '', tagline: '', desc: '', iconKey: 'dumbbell', overview: '', details: '', benefits: '', displayOrder: '', isActive: true, image: '', imageFile: null };
const defaultYogaTypeForm: YogaTypeForm = { ...defaultProgramForm, iconKey: 'leaf', perfectFor: '' };
const defaultYogaChallengeForm: YogaChallengeForm = { title: '', desc: '', iconKey: 'target', days: '30 Days', level: 'All Levels', category: 'Fitness', color: 'bg-orange-500', overview: '', follow: '', bestFor: '', displayOrder: '', isActive: true, image: '', imageFile: null };
const defaultUserForm: UserForm = { name: '', email: '', phone: '', role: 'livefit', focusAreas: '', password: '' };
const defaultPaidUserForm: PaidUserForm = { status: 'free', product: 'livefit', planId: '', planName: 'Free Access', expiresAt: '' };
const defaultChallengeForm: ChallengeForm = { slug: '', title: '', desc: '', image: '', imageFile: null, stat: '', statDesc: '', displayOrder: '', isActive: true };
const defaultPlaylistForm: PlaylistForm = { title: '', description: '', videoUrl: '', thumbnail: '', thumbnailFile: null, category: 'Wellness', displayOrder: '', isActive: true };
const defaultGalleryForm: GalleryForm = { title: '', alt: '', category: 'Picture Gallery', image: '', imageFile: null, displayOrder: '', isActive: true };
const defaultPackageForm: PackageForm = { slug: '', name: '', priceLabel: '', amount: '', currency: 'INR', period: '', features: [''], ctaLabel: 'Buy Plan', checkoutType: 'razorpay', isPopular: false, displayOrder: '', isActive: true };
const defaultSiteSettingsForm: SiteSettingsForm = { livefitPhone: '+91 9890008742', workfitPhone: '+1 9256602776' };
const defaultChatSettings: AdminChatSettings = { autoReplyEnabled: true, autoReplyMessage: 'Thanks for reaching out. A wellness expert will reply shortly.' };

const iconOptions = ['dumbbell', 'heart', 'brain', 'baby', 'flame', 'user-round', 'smile', 'users', 'user', 'trophy', 'sparkles', 'sun', 'clock', 'bed', 'leaf', 'zap', 'target', 'chair', 'wind', 'moon'];
const challengeColorOptions = ['bg-orange-500', 'bg-green-500', 'bg-purple-500', 'bg-emerald-500', 'bg-blue-500', 'bg-rose-500', 'bg-teal-500', 'bg-amber-500'];

const formatDate = (value?: string | null) => {
  if (!value) return 'Not updated yet';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
};

const toProgramForm = (program: AdminYogaProgram): ProgramForm => ({
  title: program.title,
  tagline: program.tagline,
  desc: program.desc,
  iconKey: program.iconKey,
  overview: program.overview,
  details: program.details,
  benefits: program.benefits.join('\n'),
  displayOrder: String(program.displayOrder),
  isActive: program.isActive,
  image: program.image,
  imageFile: null,
});
const toYogaTypeForm = (type: AdminYogaType): YogaTypeForm => ({
  title: type.title,
  tagline: type.tagline,
  desc: type.desc,
  iconKey: type.iconKey,
  overview: type.overview,
  details: type.details,
  benefits: type.benefits.join('\n'),
  perfectFor: type.perfectFor.join('\n'),
  displayOrder: String(type.displayOrder),
  isActive: type.isActive,
  image: type.image,
  imageFile: null,
});
const toYogaChallengeForm = (challenge: AdminYogaChallenge): YogaChallengeForm => ({
  title: challenge.title,
  desc: challenge.desc,
  iconKey: challenge.iconKey,
  days: challenge.days,
  level: challenge.level,
  category: challenge.category,
  color: challenge.color,
  overview: challenge.overview,
  follow: challenge.follow.join('\n'),
  bestFor: challenge.bestFor.join('\n'),
  displayOrder: String(challenge.displayOrder),
  isActive: challenge.isActive,
  image: challenge.image,
  imageFile: null,
});
const toUserForm = (user: AdminManagedUser): UserForm => ({ name: user.name, email: user.email, phone: user.phone || '', role: user.role, focusAreas: user.focusAreas.join('\n'), password: '' });
const toPaidUserForm = (user: AdminPaidUser): PaidUserForm => ({
  status: user.manualMembership.isManualOverride ? user.manualMembership.status : user.paid ? 'paid' : 'free',
  product: user.manualMembership.isManualOverride ? user.manualMembership.product : user.product,
  planId: user.manualMembership.isManualOverride ? user.manualMembership.planId : user.planId,
  planName: user.manualMembership.isManualOverride ? user.manualMembership.planName : user.planName,
  expiresAt: (user.manualMembership.isManualOverride ? user.manualMembership.expiresAt : user.expiresAt)?.slice(0, 10) || '',
});
const toChallengeForm = (challenge: AdminWorkfitChallenge): ChallengeForm => ({ slug: challenge.slug, title: challenge.title, desc: challenge.desc, image: challenge.image, imageFile: null, stat: challenge.stat, statDesc: challenge.statDesc, displayOrder: String(challenge.displayOrder), isActive: challenge.isActive });
const toPlaylistForm = (playlist: AdminPlaylist): PlaylistForm => ({ title: playlist.title, description: playlist.description, videoUrl: playlist.videoUrl, thumbnail: playlist.thumbnail, thumbnailFile: null, category: playlist.category, displayOrder: String(playlist.displayOrder), isActive: playlist.isActive });
const toGalleryForm = (image: AdminGalleryImage): GalleryForm => ({ title: image.title, alt: image.alt, category: image.category || 'Picture Gallery', image: image.image, imageFile: null, displayOrder: String(image.displayOrder), isActive: image.isActive });
const toPackageForm = (plan: AdminPackage): PackageForm => ({ slug: plan.slug, name: plan.name, priceLabel: plan.priceLabel, amount: String(plan.amount), currency: plan.currency, period: plan.period, features: plan.features.length ? plan.features : [''], ctaLabel: plan.ctaLabel, checkoutType: plan.checkoutType, isPopular: plan.isPopular, displayOrder: String(plan.displayOrder), isActive: plan.isActive });

const Field = ({ label, full = false, children }: { label: string; full?: boolean; children: React.ReactNode }) => (
  <div className={`admin-form-field ${full ? 'full' : ''}`}><label>{label}</label>{children}</div>
);

const ModalHeader = ({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) => (
  <div className="admin-modal-header">
    <div><h3 style={{ fontSize: 22, fontWeight: 700 }}>{title}</h3><p className="admin-muted" style={{ marginTop: 6 }}>{subtitle}</p></div>
    <button type="button" className="admin-close-button" onClick={onClose}><X size={18} /></button>
  </div>
);

const ModalActions = ({ submitting, editing, createLabel, updateLabel, onCancel }: { submitting: boolean; editing: boolean; createLabel: string; updateLabel: string; onCancel: () => void }) => (
  <div className="admin-modal-actions">
    <button type="button" className="admin-secondary-button" onClick={onCancel} disabled={submitting}>Cancel</button>
    <button type="submit" className="admin-primary-button" disabled={submitting}>{submitting ? 'Saving...' : editing ? updateLabel : createLabel}</button>
  </div>
);

const ImagePreview = ({ src, alt }: { src: string; alt: string }) => (
  <div className="admin-form-field full">
    <label>Image Preview</label>
    <div className="admin-image-preview">
      {src ? <img src={src} alt={alt} /> : <div className="admin-empty-preview"><ImagePlus size={24} />Upload a photo to store it securely in Cloudflare R2.</div>}
    </div>
  </div>
);

const AdminDashboard = () => {
  const adminToken = getAdminToken();
  const adminUser = getAdminUser();
  const authHeaders = adminToken ? { Authorization: `Bearer ${adminToken}` } : undefined;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [programs, setPrograms] = useState<AdminYogaProgram[]>([]);
  const [yogaTypes, setYogaTypes] = useState<AdminYogaType[]>([]);
  const [yogaChallenges, setYogaChallenges] = useState<AdminYogaChallenge[]>([]);
  const [usersResponse, setUsersResponse] = useState<AdminUsersResponse>({ users: [], total: 0, page: 1, limit: 10, totalPages: 1 });
  const [paidUsersResponse, setPaidUsersResponse] = useState<AdminPaidUsersResponse>({ users: [], total: 0, page: 1, limit: 10, totalPages: 1 });
  const [userPage, setUserPage] = useState(1);
  const [paidUserPage, setPaidUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [paidUserSearch, setPaidUserSearch] = useState('');
  const [challenges, setChallenges] = useState<AdminWorkfitChallenge[]>([]);
  const [playlists, setPlaylists] = useState<AdminPlaylist[]>([]);
  const [galleryImages, setGalleryImages] = useState<AdminGalleryImage[]>([]);
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [chats, setChats] = useState<AdminChatThread[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [chatSettings, setChatSettings] = useState<AdminChatSettings>(defaultChatSettings);
  const [savingChatSettings, setSavingChatSettings] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsForm>(defaultSiteSettingsForm);
  const [savingSiteSettings, setSavingSiteSettings] = useState(false);
  const [sectionContent, setSectionContent] = useState<AdminSectionContent>({ title: 'Wellness Programs for Every Lifestyle', description: 'Personalized wellness experiences designed to help you move better, feel stronger, reduce stress, and live healthier.' });
  const [challengeSectionContent, setChallengeSectionContent] = useState<AdminYogaChallengesSectionContent>({ eyebrow: 'Programs & Challenges', title: 'Programs That Transform Habits', description: 'Join expert-designed 30-day programs and challenges that help you build discipline, stay motivated, and create lasting change one day at a time.', quote: 'One Commitment. 30 Days. A healthier, stronger, calmer you.' });
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [editingYogaTypeId, setEditingYogaTypeId] = useState<string | null>(null);
  const [editingYogaChallengeId, setEditingYogaChallengeId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingPaidUserId, setEditingPaidUserId] = useState<string | null>(null);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [programForm, setProgramForm] = useState<ProgramForm>(defaultProgramForm);
  const [yogaTypeForm, setYogaTypeForm] = useState<YogaTypeForm>(defaultYogaTypeForm);
  const [yogaChallengeForm, setYogaChallengeForm] = useState<YogaChallengeForm>(defaultYogaChallengeForm);
  const [userForm, setUserForm] = useState<UserForm>(defaultUserForm);
  const [paidUserForm, setPaidUserForm] = useState<PaidUserForm>(defaultPaidUserForm);
  const [challengeForm, setChallengeForm] = useState<ChallengeForm>(defaultChallengeForm);
  const [playlistForm, setPlaylistForm] = useState<PlaylistForm>(defaultPlaylistForm);
  const [galleryForm, setGalleryForm] = useState<GalleryForm>(defaultGalleryForm);
  const [packageForm, setPackageForm] = useState<PackageForm>(defaultPackageForm);

  const getErrorMessage = (err: unknown, fallback: string) => err instanceof AxiosError ? err.response?.data?.message || fallback : fallback;
  const resetMessages = () => { setError(''); setSuccessMessage(''); };

  useEffect(() => {
    if (!adminToken || !adminUser) redirectToAdminLogin(ADMIN_DASHBOARD_PATH);
  }, [adminToken, adminUser]);

  const refreshOverview = async () => {
    if (!adminToken) return;
    const response = await adminApiClient.get<AdminOverviewResponse>('/api/admin/overview', { headers: authHeaders });
    setOverview(response.data);
  };

  const loadUsers = async (page = userPage, search = userSearch) => {
    if (!adminToken) return;
    const response = await adminApiClient.get<AdminUsersResponse>('/api/admin/users', { headers: authHeaders, params: { page, limit: 10, search: search.trim() || undefined } });
    setUsersResponse(response.data);
  };

  const loadPaidUsers = async (page = paidUserPage, search = paidUserSearch) => {
    if (!adminToken) return;
    const response = await adminApiClient.get<AdminPaidUsersResponse>('/api/admin/paid-users', { headers: authHeaders, params: { page, limit: 10, search: search.trim() || undefined } });
    setPaidUsersResponse(response.data);
  };

  const loadChats = async () => {
    if (!adminToken) return;
    const response = await adminApiClient.get<AdminChatThread[]>('/api/admin/chats', { headers: authHeaders });
    setChats(response.data);
    if (!selectedChatId && response.data.length > 0) setSelectedChatId(response.data[0].id);
  };

  const loadAdminData = async () => {
    if (!adminToken) return;
    try {
      setLoading(true);
      resetMessages();
      const [overviewRes, programsRes, yogaTypesRes, yogaChallengesRes, sectionRes, challengeSectionRes, challengesRes, playlistsRes, galleryRes, usersRes, paidUsersRes, packagesRes, chatsRes, chatSettingsRes, siteSettingsRes] = await Promise.all([
        adminApiClient.get<AdminOverviewResponse>('/api/admin/overview', { headers: authHeaders }),
        adminApiClient.get<AdminYogaProgram[]>('/api/admin/yoga-programs', { headers: authHeaders }),
        adminApiClient.get<AdminYogaType[]>('/api/admin/yoga-types', { headers: authHeaders }),
        adminApiClient.get<AdminYogaChallenge[]>('/api/admin/yoga-challenges', { headers: authHeaders }),
        adminApiClient.get<AdminSectionContent>('/api/content/yoga-programs-section'),
        adminApiClient.get<AdminYogaChallengesSectionContent>('/api/content/yoga-challenges-section'),
        adminApiClient.get<AdminWorkfitChallenge[]>('/api/admin/workfit-challenges', { headers: authHeaders }),
        adminApiClient.get<AdminPlaylist[]>('/api/admin/playlists', { headers: authHeaders }),
        adminApiClient.get<AdminGalleryImage[]>('/api/admin/gallery', { headers: authHeaders }),
        adminApiClient.get<AdminUsersResponse>('/api/admin/users', { headers: authHeaders, params: { page: 1, limit: 10 } }),
        adminApiClient.get<AdminPaidUsersResponse>('/api/admin/paid-users', { headers: authHeaders, params: { page: 1, limit: 10 } }),
        adminApiClient.get<AdminPackage[]>('/api/admin/packages', { headers: authHeaders }),
        adminApiClient.get<AdminChatThread[]>('/api/admin/chats', { headers: authHeaders }),
        adminApiClient.get<AdminChatSettings>('/api/admin/chat-settings', { headers: authHeaders }),
        adminApiClient.get<AdminSiteSettings>('/api/content/site-settings'),
      ]);
      setOverview(overviewRes.data);
      setPrograms(programsRes.data);
      setYogaTypes(yogaTypesRes.data);
      setYogaChallenges(yogaChallengesRes.data);
      setSectionContent(sectionRes.data);
      setChallengeSectionContent(challengeSectionRes.data);
      setChallenges(challengesRes.data);
      setPlaylists(playlistsRes.data);
      setGalleryImages(galleryRes.data);
      setUsersResponse(usersRes.data);
      setPaidUsersResponse(paidUsersRes.data);
      setPackages(packagesRes.data);
      setChats(chatsRes.data);
      setChatSettings(chatSettingsRes.data);
      setSiteSettings(siteSettingsRes.data);
      if (chatsRes.data.length > 0) setSelectedChatId(chatsRes.data[0].id);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to load the admin dashboard right now.'));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { loadAdminData(); }, [adminToken]);
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { if (adminToken) loadUsers(userPage, userSearch).catch((err: unknown) => setError(getErrorMessage(err, 'Unable to load users.'))); }, [userPage]);
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { if (adminToken) loadPaidUsers(paidUserPage, paidUserSearch).catch((err: unknown) => setError(getErrorMessage(err, 'Unable to load paid users.'))); }, [paidUserPage]);

  const programPreview = useMemo(() => programForm.imageFile ? URL.createObjectURL(programForm.imageFile) : resolveYogaImageUrl(programForm.image), [programForm.image, programForm.imageFile]);
  const yogaTypePreview = useMemo(() => yogaTypeForm.imageFile ? URL.createObjectURL(yogaTypeForm.imageFile) : resolveYogaImageUrl(yogaTypeForm.image), [yogaTypeForm.image, yogaTypeForm.imageFile]);
  const yogaChallengePreview = useMemo(() => yogaChallengeForm.imageFile ? URL.createObjectURL(yogaChallengeForm.imageFile) : resolveYogaImageUrl(yogaChallengeForm.image), [yogaChallengeForm.image, yogaChallengeForm.imageFile]);
  const challengePreview = useMemo(() => challengeForm.imageFile ? URL.createObjectURL(challengeForm.imageFile) : resolveYogaImageUrl(challengeForm.image), [challengeForm.image, challengeForm.imageFile]);
  const playlistPreview = useMemo(() => playlistForm.thumbnailFile ? URL.createObjectURL(playlistForm.thumbnailFile) : resolveYogaImageUrl(playlistForm.thumbnail), [playlistForm.thumbnail, playlistForm.thumbnailFile]);
  const galleryPreview = useMemo(() => galleryForm.imageFile ? URL.createObjectURL(galleryForm.imageFile) : resolveYogaImageUrl(galleryForm.image), [galleryForm.image, galleryForm.imageFile]);
  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  useEffect(() => {
    return () => {
      [programPreview, yogaTypePreview, yogaChallengePreview, challengePreview, playlistPreview, galleryPreview]
        .filter((value) => value.startsWith('blob:'))
        .forEach((value) => URL.revokeObjectURL(value));
    };
  }, [programPreview, yogaTypePreview, yogaChallengePreview, challengePreview, playlistPreview, galleryPreview]);

  const setView = (view: View) => { setActiveView(view); setSidebarOpen(false); if (view === 'chats') loadChats().catch(() => undefined); };
  const handleLogout = () => { clearAdminSession(); window.location.assign(ADMIN_LOGIN_PATH); };
  const closeModal = () => {
    if (submitting) return;
    setModalType(null); setEditingProgramId(null); setEditingYogaTypeId(null); setEditingYogaChallengeId(null); setEditingUserId(null); setEditingPaidUserId(null); setEditingChallengeId(null); setEditingPlaylistId(null); setEditingGalleryId(null); setEditingPackageId(null);
    setProgramForm(defaultProgramForm); setYogaTypeForm(defaultYogaTypeForm); setYogaChallengeForm(defaultYogaChallengeForm); setUserForm(defaultUserForm); setPaidUserForm(defaultPaidUserForm); setChallengeForm(defaultChallengeForm); setPlaylistForm(defaultPlaylistForm); setGalleryForm(defaultGalleryForm); setPackageForm(defaultPackageForm);
  };

  const openProgramModal = (program?: AdminYogaProgram) => { resetMessages(); setModalType('program'); setEditingProgramId(program?.id || null); setProgramForm(program ? toProgramForm(program) : defaultProgramForm); };
  const openYogaTypeModal = (type?: AdminYogaType) => { resetMessages(); setModalType('yoga-type'); setEditingYogaTypeId(type?.id || null); setYogaTypeForm(type ? toYogaTypeForm(type) : defaultYogaTypeForm); };
  const openYogaChallengeModal = (challenge?: AdminYogaChallenge) => { resetMessages(); setModalType('yoga-challenge'); setEditingYogaChallengeId(challenge?.id || null); setYogaChallengeForm(challenge ? toYogaChallengeForm(challenge) : defaultYogaChallengeForm); };
  const openUserModal = (user: AdminManagedUser) => { resetMessages(); setModalType('user'); setEditingUserId(user.id); setUserForm(toUserForm(user)); };
  const openPaidUserModal = (user: AdminPaidUser) => { resetMessages(); setModalType('paid-user'); setEditingPaidUserId(user.id); setPaidUserForm(toPaidUserForm(user)); };
  const openChallengeModal = (challenge?: AdminWorkfitChallenge) => { resetMessages(); setModalType('challenge'); setEditingChallengeId(challenge?.id || null); setChallengeForm(challenge ? toChallengeForm(challenge) : defaultChallengeForm); };
  const openPlaylistModal = (playlist?: AdminPlaylist) => { resetMessages(); setModalType('playlist'); setEditingPlaylistId(playlist?.id || null); setPlaylistForm(playlist ? toPlaylistForm(playlist) : defaultPlaylistForm); };
  const openGalleryModal = (image?: AdminGalleryImage) => { resetMessages(); setModalType('gallery'); setEditingGalleryId(image?.id || null); setGalleryForm(image ? toGalleryForm(image) : defaultGalleryForm); };
  const openPackageModal = (plan?: AdminPackage) => { resetMessages(); setModalType('package'); setEditingPackageId(plan?.id || null); setPackageForm(plan ? toPackageForm(plan) : defaultPackageForm); };
  const handleSectionSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSavingSection(true); resetMessages();
      await adminApiClient.put('/api/content/yoga-programs-section', { data: sectionContent }, { headers: authHeaders });
      setSuccessMessage('Yoga section heading content updated successfully.');
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to update section content.')); }
    finally { setSavingSection(false); }
  };

  const handleChallengeSectionSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSavingSection(true); resetMessages();
      await adminApiClient.put('/api/content/yoga-challenges-section', { data: challengeSectionContent }, { headers: authHeaders });
      setSuccessMessage('Yoga challenges section content updated successfully.');
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to update challenges section content.')); }
    finally { setSavingSection(false); }
  };

  const handleSiteSettingsSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSavingSiteSettings(true); resetMessages();
      const response = await adminApiClient.put<{ message: string; data: AdminSiteSettings }>('/api/content/site-settings', { data: siteSettings }, { headers: authHeaders });
      setSiteSettings(response.data.data);
      localStorage.setItem('siteContactSettings', JSON.stringify(response.data.data));
      setSuccessMessage('Phone numbers updated successfully.');
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to update phone numbers.')); }
    finally { setSavingSiteSettings(false); }
  };

  const handleProgramSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSubmitting(true); resetMessages();
      const formData = new FormData();
      Object.entries({ title: programForm.title, tagline: programForm.tagline, desc: programForm.desc, iconKey: programForm.iconKey, overview: programForm.overview, details: programForm.details, benefits: programForm.benefits, displayOrder: programForm.displayOrder || '0', isActive: String(programForm.isActive), imagePath: programForm.image }).forEach(([key, value]) => formData.append(key, value));
      if (programForm.imageFile) formData.append('image', programForm.imageFile);
      const endpoint = editingProgramId ? `/api/admin/yoga-programs/${editingProgramId}` : '/api/admin/yoga-programs';
      const response = await adminApiClient.request<{ data: AdminYogaProgram }>({ url: endpoint, method: editingProgramId ? 'put' : 'post', data: formData, headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' } });
      setPrograms((previous) => (editingProgramId ? previous.map((item) => item.id === editingProgramId ? response.data.data : item) : [...previous, response.data.data]).sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title)));
      await refreshOverview();
      setSuccessMessage(editingProgramId ? 'Yoga program updated successfully.' : 'Yoga program added successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to save yoga program.')); }
    finally { setSubmitting(false); }
  };

  const handleYogaTypeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSubmitting(true); resetMessages();
      const formData = new FormData();
      Object.entries({
        title: yogaTypeForm.title,
        tagline: yogaTypeForm.tagline,
        desc: yogaTypeForm.desc,
        iconKey: yogaTypeForm.iconKey,
        overview: yogaTypeForm.overview,
        details: yogaTypeForm.details,
        benefits: yogaTypeForm.benefits,
        perfectFor: yogaTypeForm.perfectFor,
        displayOrder: yogaTypeForm.displayOrder || '0',
        isActive: String(yogaTypeForm.isActive),
        imagePath: yogaTypeForm.image,
      }).forEach(([key, value]) => formData.append(key, value));
      if (yogaTypeForm.imageFile) formData.append('image', yogaTypeForm.imageFile);
      const endpoint = editingYogaTypeId ? `/api/admin/yoga-types/${editingYogaTypeId}` : '/api/admin/yoga-types';
      const response = await adminApiClient.request<{ data: AdminYogaType }>({ url: endpoint, method: editingYogaTypeId ? 'put' : 'post', data: formData, headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' } });
      setYogaTypes((previous) => (editingYogaTypeId ? previous.map((item) => item.id === editingYogaTypeId ? response.data.data : item) : [...previous, response.data.data]).sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title)));
      setSuccessMessage(editingYogaTypeId ? 'Yoga type updated successfully.' : 'Yoga type added successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to save yoga type.')); }
    finally { setSubmitting(false); }
  };

  const handleYogaChallengeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSubmitting(true); resetMessages();
      const formData = new FormData();
      Object.entries({
        title: yogaChallengeForm.title,
        desc: yogaChallengeForm.desc,
        iconKey: yogaChallengeForm.iconKey,
        days: yogaChallengeForm.days,
        level: yogaChallengeForm.level,
        category: yogaChallengeForm.category,
        color: yogaChallengeForm.color,
        overview: yogaChallengeForm.overview,
        follow: yogaChallengeForm.follow,
        bestFor: yogaChallengeForm.bestFor,
        displayOrder: yogaChallengeForm.displayOrder || '0',
        isActive: String(yogaChallengeForm.isActive),
        imagePath: yogaChallengeForm.image,
      }).forEach(([key, value]) => formData.append(key, value));
      if (yogaChallengeForm.imageFile) formData.append('image', yogaChallengeForm.imageFile);
      const endpoint = editingYogaChallengeId ? `/api/admin/yoga-challenges/${editingYogaChallengeId}` : '/api/admin/yoga-challenges';
      const response = await adminApiClient.request<{ data: AdminYogaChallenge }>({ url: endpoint, method: editingYogaChallengeId ? 'put' : 'post', data: formData, headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' } });
      setYogaChallenges((previous) => (editingYogaChallengeId ? previous.map((item) => item.id === editingYogaChallengeId ? response.data.data : item) : [...previous, response.data.data]).sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title)));
      setSuccessMessage(editingYogaChallengeId ? 'Yoga challenge updated successfully.' : 'Yoga challenge added successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to save yoga challenge.')); }
    finally { setSubmitting(false); }
  };

  const handleUserSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken || !editingUserId) return;
    try {
      setSubmitting(true); resetMessages();
      await adminApiClient.put(`/api/admin/users/${editingUserId}`, { ...userForm, password: userForm.password || undefined }, { headers: authHeaders });
      await Promise.all([loadUsers(userPage, userSearch), refreshOverview()]);
      setSuccessMessage('User account updated successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to update user account.')); }
    finally { setSubmitting(false); }
  };

  const handlePaidUserSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken || !editingPaidUserId) return;
    try {
      setSubmitting(true); resetMessages();
      await adminApiClient.put(`/api/admin/paid-users/${editingPaidUserId}`, paidUserForm, { headers: authHeaders });
      await Promise.all([loadPaidUsers(paidUserPage, paidUserSearch), refreshOverview()]);
      setSuccessMessage('Paid access updated successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to update paid access.')); }
    finally { setSubmitting(false); }
  };

  const handleChallengeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSubmitting(true); resetMessages();
      const formData = new FormData();
      Object.entries({ slug: challengeForm.slug, title: challengeForm.title, desc: challengeForm.desc, stat: challengeForm.stat, statDesc: challengeForm.statDesc, displayOrder: challengeForm.displayOrder || '0', isActive: String(challengeForm.isActive), imagePath: challengeForm.image }).forEach(([key, value]) => formData.append(key, value));
      if (challengeForm.imageFile) formData.append('image', challengeForm.imageFile);
      const endpoint = editingChallengeId ? `/api/admin/workfit-challenges/${editingChallengeId}` : '/api/admin/workfit-challenges';
      const response = await adminApiClient.request<{ data: AdminWorkfitChallenge }>({ url: endpoint, method: editingChallengeId ? 'put' : 'post', data: formData, headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' } });
      setChallenges((previous) => (editingChallengeId ? previous.map((item) => item.id === editingChallengeId ? response.data.data : item) : [...previous, response.data.data]).sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title)));
      setSuccessMessage(editingChallengeId ? 'WorkFit challenge updated successfully.' : 'WorkFit challenge added successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to save WorkFit challenge.')); }
    finally { setSubmitting(false); }
  };

  const handlePlaylistSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSubmitting(true); resetMessages();
      const formData = new FormData();
      Object.entries({ title: playlistForm.title, description: playlistForm.description, videoUrl: playlistForm.videoUrl, category: playlistForm.category, displayOrder: playlistForm.displayOrder || '0', isActive: String(playlistForm.isActive), thumbnailPath: playlistForm.thumbnail }).forEach(([key, value]) => formData.append(key, value));
      if (playlistForm.thumbnailFile) formData.append('thumbnail', playlistForm.thumbnailFile);
      const endpoint = editingPlaylistId ? `/api/admin/playlists/${editingPlaylistId}` : '/api/admin/playlists';
      const response = await adminApiClient.request<{ data: AdminPlaylist }>({ url: endpoint, method: editingPlaylistId ? 'put' : 'post', data: formData, headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' } });
      setPlaylists((previous) => (editingPlaylistId ? previous.map((item) => item.id === editingPlaylistId ? response.data.data : item) : [...previous, response.data.data]).sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title)));
      setSuccessMessage(editingPlaylistId ? 'Playlist updated successfully.' : 'Playlist added successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to save playlist.')); }
    finally { setSubmitting(false); }
  };

  const handleGallerySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSubmitting(true); resetMessages();
      const formData = new FormData();
      Object.entries({ title: galleryForm.title, alt: galleryForm.alt, category: galleryForm.category, displayOrder: galleryForm.displayOrder || '0', isActive: String(galleryForm.isActive), imagePath: galleryForm.image }).forEach(([key, value]) => formData.append(key, value));
      if (galleryForm.imageFile) formData.append('image', galleryForm.imageFile);
      const endpoint = editingGalleryId ? `/api/admin/gallery/${editingGalleryId}` : '/api/admin/gallery';
      const response = await adminApiClient.request<{ data: AdminGalleryImage }>({ url: endpoint, method: editingGalleryId ? 'put' : 'post', data: formData, headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' } });
      setGalleryImages((previous) => (editingGalleryId ? previous.map((item) => item.id === editingGalleryId ? response.data.data : item) : [...previous, response.data.data]).sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title)));
      setSuccessMessage(editingGalleryId ? 'Gallery image updated successfully.' : 'Gallery image added successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to save gallery image.')); }
    finally { setSubmitting(false); }
  };

  const handlePackageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSubmitting(true); resetMessages();
      const payload = {
        ...packageForm,
        amount: Number(packageForm.amount || 0),
        displayOrder: Number(packageForm.displayOrder || 0),
        features: packageForm.features.map((feature) => feature.trim()).filter(Boolean),
      };
      const endpoint = editingPackageId ? `/api/admin/packages/${editingPackageId}` : '/api/admin/packages';
      const response = await adminApiClient.request<{ data: AdminPackage }>({ url: endpoint, method: editingPackageId ? 'put' : 'post', data: payload, headers: authHeaders });
      setPackages((previous) => (editingPackageId ? previous.map((item) => item.id === editingPackageId ? response.data.data : item) : [...previous, response.data.data]).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name)));
      setSuccessMessage(editingPackageId ? 'Package updated successfully.' : 'Package added successfully.');
      closeModal();
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to save package.')); }
    finally { setSubmitting(false); }
  };

  const handleChatSettingsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken) return;
    try {
      setSavingChatSettings(true); resetMessages();
      const response = await adminApiClient.put<{ data: AdminChatSettings }>('/api/admin/chat-settings', chatSettings, { headers: authHeaders });
      setChatSettings(response.data.data);
      setSuccessMessage('Chat auto message updated successfully.');
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to update chat settings.')); }
    finally { setSavingChatSettings(false); }
  };

  const sendAdminReply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!adminToken || !selectedChat || !replyText.trim()) return;
    try {
      resetMessages();
      const response = await adminApiClient.post<AdminChatThread>(`/api/admin/chats/${selectedChat.id}/messages`, { text: replyText.trim() }, { headers: authHeaders });
      setChats((previous) => previous.map((chat) => chat.id === response.data.id ? response.data : chat));
      setReplyText('');
    } catch (err: unknown) { setError(getErrorMessage(err, 'Unable to send reply.')); }
  };

  const deleteChat = async (chat: AdminChatThread) => {
    if (!adminToken || !window.confirm(`Delete chat for "${chat.userName}" and all its messages?`)) return;
    try {
      resetMessages();
      const deletingSelected = selectedChatId === chat.id;
      await adminApiClient.delete(`/api/admin/chats/${chat.id}`, { headers: authHeaders });
      setChats((previous) => previous.filter((item) => item.id !== chat.id));
      if (deletingSelected) {
        const nextSelected = chats.find((item) => item.id !== chat.id)?.id || null;
        setSelectedChatId(nextSelected);
        setReplyText('');
      }
      setSuccessMessage('Chat deleted successfully.');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Unable to delete chat.'));
    }
  };

  const deleteProgram = async (program: AdminYogaProgram) => {
    if (!adminToken || !window.confirm(`Delete "${program.title}"?`)) return;
    try { resetMessages(); await adminApiClient.delete(`/api/admin/yoga-programs/${program.id}`, { headers: authHeaders }); setPrograms((previous) => previous.filter((item) => item.id !== program.id)); await refreshOverview(); setSuccessMessage('Yoga program deleted successfully.'); }
    catch (err: unknown) { setError(getErrorMessage(err, 'Unable to delete yoga program.')); }
  };
  const deleteYogaType = async (type: AdminYogaType) => {
    if (!adminToken || !window.confirm(`Delete "${type.title}"?`)) return;
    try { resetMessages(); await adminApiClient.delete(`/api/admin/yoga-types/${type.id}`, { headers: authHeaders }); setYogaTypes((previous) => previous.filter((item) => item.id !== type.id)); setSuccessMessage('Yoga type deleted successfully.'); }
    catch (err: unknown) { setError(getErrorMessage(err, 'Unable to delete yoga type.')); }
  };
  const deleteYogaChallenge = async (challenge: AdminYogaChallenge) => {
    if (!adminToken || !window.confirm(`Delete "${challenge.title}"?`)) return;
    try { resetMessages(); await adminApiClient.delete(`/api/admin/yoga-challenges/${challenge.id}`, { headers: authHeaders }); setYogaChallenges((previous) => previous.filter((item) => item.id !== challenge.id)); setSuccessMessage('Yoga challenge deleted successfully.'); }
    catch (err: unknown) { setError(getErrorMessage(err, 'Unable to delete yoga challenge.')); }
  };
  const deleteUser = async (user: AdminManagedUser) => {
    if (!adminToken || !window.confirm(`Delete user "${user.email}"?`)) return;
    try { resetMessages(); await adminApiClient.delete(`/api/admin/users/${user.id}`, { headers: authHeaders }); await Promise.all([loadUsers(userPage, userSearch), refreshOverview()]); setSuccessMessage('User deleted successfully.'); }
    catch (err: unknown) { setError(getErrorMessage(err, 'Unable to delete user.')); }
  };
  const deleteChallenge = async (challenge: AdminWorkfitChallenge) => {
    if (!adminToken || !window.confirm(`Delete "${challenge.title}"?`)) return;
    try { resetMessages(); await adminApiClient.delete(`/api/admin/workfit-challenges/${challenge.id}`, { headers: authHeaders }); setChallenges((previous) => previous.filter((item) => item.id !== challenge.id)); setSuccessMessage('WorkFit challenge deleted successfully.'); }
    catch (err: unknown) { setError(getErrorMessage(err, 'Unable to delete WorkFit challenge.')); }
  };
  const deletePlaylist = async (playlist: AdminPlaylist) => {
    if (!adminToken || !window.confirm(`Delete "${playlist.title}"?`)) return;
    try { resetMessages(); await adminApiClient.delete(`/api/admin/playlists/${playlist.id}`, { headers: authHeaders }); setPlaylists((previous) => previous.filter((item) => item.id !== playlist.id)); setSuccessMessage('Playlist deleted successfully.'); }
    catch (err: unknown) { setError(getErrorMessage(err, 'Unable to delete playlist.')); }
  };
  const deleteGalleryImage = async (image: AdminGalleryImage) => {
    if (!adminToken || !window.confirm(`Delete "${image.title}"?`)) return;
    try { resetMessages(); await adminApiClient.delete(`/api/admin/gallery/${image.id}`, { headers: authHeaders }); setGalleryImages((previous) => previous.filter((item) => item.id !== image.id)); setSuccessMessage('Gallery image deleted successfully.'); }
    catch (err: unknown) { setError(getErrorMessage(err, 'Unable to delete gallery image.')); }
  };
  const deletePackage = async (plan: AdminPackage) => {
    if (!adminToken || !window.confirm(`Delete package "${plan.name}"?`)) return;
    try { resetMessages(); await adminApiClient.delete(`/api/admin/packages/${plan.id}`, { headers: authHeaders }); setPackages((previous) => previous.filter((item) => item.id !== plan.id)); setSuccessMessage('Package deleted successfully.'); }
    catch (err: unknown) { setError(getErrorMessage(err, 'Unable to delete package.')); }
  };

  const submitUserSearch = async (event: React.FormEvent) => { event.preventDefault(); setUserPage(1); await loadUsers(1, userSearch); };
  const submitPaidUserSearch = async (event: React.FormEvent) => { event.preventDefault(); setPaidUserPage(1); await loadPaidUsers(1, paidUserSearch); };

  if (!adminToken || !adminUser) return null;
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-logo-area">Live<span>Fit</span></div>
        <div className="admin-menu-group">
          <div className="admin-menu-label">Menu</div>
          <button type="button" className={`admin-menu-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}><LayoutDashboard />Dashboard<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'yoga-programs' ? 'active' : ''}`} onClick={() => setView('yoga-programs')}><ClipboardList />Yoga Programs<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'yoga-types' ? 'active' : ''}`} onClick={() => setView('yoga-types')}><Leaf />Yoga Types<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'yoga-challenges' ? 'active' : ''}`} onClick={() => setView('yoga-challenges')}><Target />Yoga Challenges<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'users' ? 'active' : ''}`} onClick={() => setView('users')}><Users />Users<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'paid-users' ? 'active' : ''}`} onClick={() => setView('paid-users')}><CreditCard />Paid Users<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'workfit-challenges' ? 'active' : ''}`} onClick={() => setView('workfit-challenges')}><Target />WorkFit Problems<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'playlists' ? 'active' : ''}`} onClick={() => setView('playlists')}><Film />Playlists<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'gallery' ? 'active' : ''}`} onClick={() => setView('gallery')}><Images />Gallery<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'packages' ? 'active' : ''}`} onClick={() => setView('packages')}><Box />Packages<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'chats' ? 'active' : ''}`} onClick={() => setView('chats')}><MessageCircle />Chats<ChevronRight className="arrow" /></button>
          <button type="button" className={`admin-menu-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}><Settings2 />Settings<ChevronRight className="arrow" /></button>
          <div className="admin-menu-label" style={{ marginTop: 20 }}>Quick Add</div>
          <button type="button" className="admin-menu-item" onClick={() => openProgramModal()}><Plus />Yoga Program<ChevronRight className="arrow" /></button>
          <button type="button" className="admin-menu-item" onClick={() => openYogaTypeModal()}><Plus />Yoga Type<ChevronRight className="arrow" /></button>
          <button type="button" className="admin-menu-item" onClick={() => openYogaChallengeModal()}><Plus />Yoga Challenge<ChevronRight className="arrow" /></button>
          <button type="button" className="admin-menu-item" onClick={() => openChallengeModal()}><Plus />WorkFit Problem<ChevronRight className="arrow" /></button>
          <button type="button" className="admin-menu-item" onClick={() => openPlaylistModal()}><Plus />Playlist<ChevronRight className="arrow" /></button>
          <button type="button" className="admin-menu-item" onClick={() => openGalleryModal()}><Plus />Gallery Image<ChevronRight className="arrow" /></button>
          <button type="button" className="admin-menu-item" onClick={() => openPackageModal()}><Plus />Package<ChevronRight className="arrow" /></button>
          <button type="button" className="admin-menu-item" onClick={handleLogout}><LogOut />Logout<ChevronRight className="arrow" /></button>
        </div>
      </aside>

      <div className={`admin-main-wrapper ${sidebarOpen ? 'expanded' : ''}`}>
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button type="button" className="admin-toggle-btn" onClick={() => setSidebarOpen((value) => !value)}><Menu /></button>
            <div className="admin-topbar-title"><h1>{activeView === 'dashboard' ? 'Admin Dashboard' : activeView === 'workfit-challenges' ? 'WorkFit Problems' : activeView.replace('-', ' ')}</h1><p>MongoDB content manager for LiveFit and WorkFit.</p></div>
          </div>
          <div className="admin-topbar-right"><div className="admin-profile-icon">{adminUser.adminId.slice(0, 1).toUpperCase()}</div></div>
        </header>

        <div className="admin-content">
          {error && <div className="admin-error">{error}</div>}
          {successMessage && <div className="admin-success">{successMessage}</div>}
          {loading ? <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Loading Admin Dashboard</h3><p>Fetching live MongoDB data.</p></div></div></div> : (
            <>
              {activeView === 'dashboard' && overview && (
                <div className="admin-panel-card">
                  <div className="admin-section-head"><div><h3>Users</h3><p>Total users are counted by unique visitor IP. Hardcoded dashboard profile, revenue, followers, and chart content were removed.</p></div></div>
                  <div className="admin-stats-grid one-card"><div className="admin-stat-card"><div className="admin-stat-info"><p>Total Users</p><h3>{overview.stats.uniqueVisitors}</h3><small>Unique IP visitors tracked from website traffic.</small></div><div className="admin-stat-icon icon-blue"><Users size={22} /></div></div></div>
                </div>
              )}

              {activeView === 'yoga-programs' && (
                <>
                  <div className="admin-panel-card">
                    <div className="admin-section-head"><div><h3>Yoga Section Copy</h3><p>Control the headline and intro text shown above public yoga program cards.</p></div></div>
                    <form onSubmit={handleSectionSave}><div className="admin-form-grid"><Field label="Section Title" full><input value={sectionContent.title} onChange={(event) => setSectionContent((previous) => ({ ...previous, title: event.target.value }))} required /></Field><Field label="Section Description" full><textarea value={sectionContent.description} onChange={(event) => setSectionContent((previous) => ({ ...previous, description: event.target.value }))} required /></Field></div><div className="admin-modal-actions" style={{ padding: '18px 0 0' }}><button type="submit" className="admin-primary-button" disabled={savingSection}><Save size={16} style={{ marginRight: 8 }} />{savingSection ? 'Saving...' : 'Save Section Content'}</button></div></form>
                  </div>
                  <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Yoga Programs</h3><p>All existing public wellness program cards.</p></div><button type="button" className="admin-primary-button" onClick={() => openProgramModal()}><Plus size={16} style={{ marginRight: 8 }} />Add Yoga Program</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Program</th><th>Description</th><th>Order</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{programs.length === 0 ? <tr><td colSpan={6} className="admin-muted">No yoga programs found.</td></tr> : programs.map((program) => <tr key={program.id}><td><div className="admin-program-cell"><img src={resolveYogaImageUrl(program.image)} alt={program.title} /><div><div style={{ fontWeight: 700 }}>{program.title}</div><div className="admin-muted">{program.tagline}</div></div></div></td><td>{program.desc}</td><td>{program.displayOrder}</td><td><span className={`admin-status-badge ${program.isActive ? 'active' : 'inactive'}`}>{program.isActive ? 'Active' : 'Inactive'}</span></td><td>{formatDate(program.updatedAt)}</td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openProgramModal(program)}><Pencil size={15} style={{ marginRight: 6 }} />Edit</button><button type="button" className="admin-danger-button" onClick={() => deleteProgram(program)}><Trash2 size={15} style={{ marginRight: 6 }} />Delete</button></div></td></tr>)}</tbody></table></div></div>
                </>
              )}

              {activeView === 'yoga-types' && (
                <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Yoga Types</h3><p>Manage the dedicated yoga type cards shown below the wellness programs section.</p></div><button type="button" className="admin-primary-button" onClick={() => openYogaTypeModal()}><Plus size={16} style={{ marginRight: 8 }} />Add Yoga Type</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Yoga Type</th><th>Description</th><th>Perfect For</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>{yogaTypes.length === 0 ? <tr><td colSpan={6} className="admin-muted">No yoga types found.</td></tr> : yogaTypes.map((type) => <tr key={type.id}><td><div className="admin-program-cell"><img src={resolveYogaImageUrl(type.image)} alt={type.title} /><div><div style={{ fontWeight: 700 }}>{type.title}</div><div className="admin-muted">{type.tagline}</div></div></div></td><td>{type.desc}</td><td>{type.perfectFor.slice(0, 3).join(', ') || 'Not set'}</td><td>{type.displayOrder}</td><td><span className={`admin-status-badge ${type.isActive ? 'active' : 'inactive'}`}>{type.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openYogaTypeModal(type)}><Pencil size={15} style={{ marginRight: 6 }} />Edit</button><button type="button" className="admin-danger-button" onClick={() => deleteYogaType(type)}><Trash2 size={15} style={{ marginRight: 6 }} />Delete</button></div></td></tr>)}</tbody></table></div></div>
              )}

              {activeView === 'yoga-challenges' && (
                <>
                  <div className="admin-panel-card">
                    <div className="admin-section-head"><div><h3>Yoga Challenges Copy</h3><p>Controls the heading above public Programs & Challenges cards.</p></div></div>
                    <form onSubmit={handleChallengeSectionSave}><div className="admin-form-grid">
                      <Field label="Eyebrow"><input value={challengeSectionContent.eyebrow} onChange={(event) => setChallengeSectionContent((previous) => ({ ...previous, eyebrow: event.target.value }))} required /></Field>
                      <Field label="Title"><input value={challengeSectionContent.title} onChange={(event) => setChallengeSectionContent((previous) => ({ ...previous, title: event.target.value }))} required /></Field>
                      <Field label="Description" full><textarea value={challengeSectionContent.description} onChange={(event) => setChallengeSectionContent((previous) => ({ ...previous, description: event.target.value }))} required /></Field>
                      <Field label="Bottom Quote" full><input value={challengeSectionContent.quote} onChange={(event) => setChallengeSectionContent((previous) => ({ ...previous, quote: event.target.value }))} required /></Field>
                    </div><div className="admin-modal-actions" style={{ padding: '18px 0 0' }}><button type="submit" className="admin-primary-button" disabled={savingSection}><Save size={16} style={{ marginRight: 8 }} />{savingSection ? 'Saving...' : 'Save Challenge Copy'}</button></div></form>
                  </div>
                  <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Yoga Challenges</h3><p>All public 30-day programs are fetched from this MongoDB collection.</p></div><button type="button" className="admin-primary-button" onClick={() => openYogaChallengeModal()}><Plus size={16} style={{ marginRight: 8 }} />Add Yoga Challenge</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Program</th><th>Category</th><th>Duration</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>{yogaChallenges.length === 0 ? <tr><td colSpan={6} className="admin-muted">No yoga challenges found.</td></tr> : yogaChallenges.map((challenge) => <tr key={challenge.id}><td><div className="admin-program-cell"><img src={resolveYogaImageUrl(challenge.image)} alt={challenge.title} /><div><div style={{ fontWeight: 700 }}>{challenge.title}</div><div className="admin-muted">{challenge.desc}</div></div></div></td><td>{challenge.category}<div className="admin-muted">{challenge.level}</div></td><td>{challenge.days}</td><td>{challenge.displayOrder}</td><td><span className={`admin-status-badge ${challenge.isActive ? 'active' : 'inactive'}`}>{challenge.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openYogaChallengeModal(challenge)}><Pencil size={15} style={{ marginRight: 6 }} />Edit</button><button type="button" className="admin-danger-button" onClick={() => deleteYogaChallenge(challenge)}><Trash2 size={15} style={{ marginRight: 6 }} />Delete</button></div></td></tr>)}</tbody></table></div></div>
                </>
              )}

              {activeView === 'users' && (
                <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Users</h3><p>View, edit, and delete registered user accounts.</p></div><form onSubmit={submitUserSearch} className="admin-search-form"><input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search users" /><button type="submit" className="admin-secondary-button">Search</button></form></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead><tbody>{usersResponse.users.length === 0 ? <tr><td colSpan={6} className="admin-muted">No users found.</td></tr> : usersResponse.users.map((user) => <tr key={user.id}><td style={{ fontWeight: 700 }}>{user.name}</td><td>{user.email}</td><td>{user.phone || 'Not set'}</td><td><span className="admin-status-badge active">{user.role}</span></td><td>{formatDate(user.createdAt)}</td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openUserModal(user)}><Pencil size={15} style={{ marginRight: 6 }} />Edit</button><button type="button" className="admin-danger-button" onClick={() => deleteUser(user)}><Trash2 size={15} style={{ marginRight: 6 }} />Delete</button></div></td></tr>)}</tbody></table></div><div className="admin-pagination"><button type="button" className="admin-secondary-button" disabled={usersResponse.page <= 1} onClick={() => setUserPage((page) => Math.max(page - 1, 1))}><ChevronLeft size={16} />Previous</button><span>Page {usersResponse.page} of {usersResponse.totalPages} | {usersResponse.total} users</span><button type="button" className="admin-secondary-button" disabled={usersResponse.page >= usersResponse.totalPages} onClick={() => setUserPage((page) => page + 1)}>Next<ChevronRight size={16} /></button></div></div>
              )}

              {activeView === 'paid-users' && (
                <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Paid Users</h3><p>See paid/free status, assign a plan manually, and control expiry dates.</p></div><form onSubmit={submitPaidUserSearch} className="admin-search-form"><input value={paidUserSearch} onChange={(event) => setPaidUserSearch(event.target.value)} placeholder="Search paid users" /><button type="submit" className="admin-secondary-button">Search</button></form></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Status</th><th>Plan</th><th>Source</th><th>Expires</th><th>Actions</th></tr></thead><tbody>{paidUsersResponse.users.length === 0 ? <tr><td colSpan={6} className="admin-muted">No users found.</td></tr> : paidUsersResponse.users.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><div className="admin-muted">{user.email}</div></td><td><span className={`admin-status-badge ${user.paid ? 'active' : 'inactive'}`}>{user.paid ? 'Paid' : 'Free'}</span></td><td>{user.planName}<div className="admin-muted">{user.product}</div></td><td>{user.source === 'admin' ? 'Admin override' : user.source === 'payment' ? 'Payment' : 'None'}<div className="admin-muted">{user.totalPayments} paid records</div></td><td>{user.expiresAt ? formatDate(user.expiresAt) : 'No expiry'}</td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openPaidUserModal(user)}><BadgeCheck size={15} style={{ marginRight: 6 }} />Change Plan</button></div></td></tr>)}</tbody></table></div><div className="admin-pagination"><button type="button" className="admin-secondary-button" disabled={paidUsersResponse.page <= 1} onClick={() => setPaidUserPage((page) => Math.max(page - 1, 1))}><ChevronLeft size={16} />Previous</button><span>Page {paidUsersResponse.page} of {paidUsersResponse.totalPages} | {paidUsersResponse.total} users</span><button type="button" className="admin-secondary-button" disabled={paidUsersResponse.page >= paidUsersResponse.totalPages} onClick={() => setPaidUserPage((page) => page + 1)}>Next<ChevronRight size={16} /></button></div></div>
              )}

              {activeView === 'workfit-challenges' && (
                <div className="admin-panel-card"><div className="admin-section-head"><div><h3>WorkFit Problems We Solve</h3><p>These cards feed the WorkFit homepage challenge section.</p></div><button type="button" className="admin-primary-button" onClick={() => openChallengeModal()}><Plus size={16} style={{ marginRight: 8 }} />Add Problem</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Problem</th><th>Description</th><th>Stat</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>{challenges.length === 0 ? <tr><td colSpan={6} className="admin-muted">No WorkFit problems found.</td></tr> : challenges.map((challenge) => <tr key={challenge.id}><td><div className="admin-program-cell"><img src={resolveYogaImageUrl(challenge.image)} alt={challenge.title} /><div><div style={{ fontWeight: 700 }}>{challenge.title}</div><div className="admin-muted">/{challenge.slug}</div></div></div></td><td>{challenge.desc}</td><td><strong>{challenge.stat}</strong><div className="admin-muted">{challenge.statDesc}</div></td><td>{challenge.displayOrder}</td><td><span className={`admin-status-badge ${challenge.isActive ? 'active' : 'inactive'}`}>{challenge.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openChallengeModal(challenge)}><Pencil size={15} style={{ marginRight: 6 }} />Edit</button><button type="button" className="admin-danger-button" onClick={() => deleteChallenge(challenge)}><Trash2 size={15} style={{ marginRight: 6 }} />Delete</button></div></td></tr>)}</tbody></table></div></div>
              )}

              {activeView === 'playlists' && (
                <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Playlists</h3><p>Add video playlist details and thumbnails for the public playlist page.</p></div><button type="button" className="admin-primary-button" onClick={() => openPlaylistModal()}><Plus size={16} style={{ marginRight: 8 }} />Add Playlist</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Playlist</th><th>Description</th><th>Video URL</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>{playlists.length === 0 ? <tr><td colSpan={6} className="admin-muted">No playlists found yet.</td></tr> : playlists.map((playlist) => <tr key={playlist.id}><td><div className="admin-program-cell"><img src={resolveYogaImageUrl(playlist.thumbnail)} alt={playlist.title} /><div><div style={{ fontWeight: 700 }}>{playlist.title}</div><div className="admin-muted">{playlist.category}</div></div></div></td><td>{playlist.description}</td><td><a href={playlist.videoUrl} target="_blank" rel="noreferrer">Open video</a></td><td>{playlist.displayOrder}</td><td><span className={`admin-status-badge ${playlist.isActive ? 'active' : 'inactive'}`}>{playlist.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openPlaylistModal(playlist)}><Pencil size={15} style={{ marginRight: 6 }} />Edit</button><button type="button" className="admin-danger-button" onClick={() => deletePlaylist(playlist)}><Trash2 size={15} style={{ marginRight: 6 }} />Delete</button></div></td></tr>)}</tbody></table></div></div>
              )}

              {activeView === 'gallery' && (
                <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Gallery Images</h3><p>Upload categorized public gallery pictures and control the dedicated gallery page.</p></div><button type="button" className="admin-primary-button" onClick={() => openGalleryModal()}><Plus size={16} style={{ marginRight: 8 }} />Add Gallery Image</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Image</th><th>Category</th><th>Alt Text</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>{galleryImages.length === 0 ? <tr><td colSpan={6} className="admin-muted">No gallery images found.</td></tr> : galleryImages.map((image) => <tr key={image.id}><td><div className="admin-program-cell"><img src={resolveYogaImageUrl(image.image)} alt={image.title} /><div><div style={{ fontWeight: 700 }}>{image.title}</div><div className="admin-muted">{image.image}</div></div></div></td><td><span className="admin-status-badge active">{image.category || 'Picture Gallery'}</span></td><td>{image.alt || image.title}</td><td>{image.displayOrder}</td><td><span className={`admin-status-badge ${image.isActive ? 'active' : 'inactive'}`}>{image.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openGalleryModal(image)}><Pencil size={15} style={{ marginRight: 6 }} />Edit</button><button type="button" className="admin-danger-button" onClick={() => deleteGalleryImage(image)}><Trash2 size={15} style={{ marginRight: 6 }} />Delete</button></div></td></tr>)}</tbody></table></div></div>
              )}

              {activeView === 'packages' && (
                <div className="admin-panel-card"><div className="admin-section-head"><div><h3>Manage Packages</h3><p>Control package names, features, prices, currency, CTAs, checkout type, and visibility.</p></div><button type="button" className="admin-primary-button" onClick={() => openPackageModal()}><Plus size={16} style={{ marginRight: 8 }} />Add Package</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Package</th><th>Price</th><th>Features</th><th>Checkout</th><th>Status</th><th>Actions</th></tr></thead><tbody>{packages.length === 0 ? <tr><td colSpan={6} className="admin-muted">No packages found.</td></tr> : packages.map((plan) => <tr key={plan.id}><td><strong>{plan.name}</strong><div className="admin-muted">/{plan.slug} | Order {plan.displayOrder}</div>{plan.isPopular && <span className="admin-status-badge active">Popular</span>}</td><td><strong>{plan.priceLabel}</strong><div className="admin-muted">{plan.currency} {plan.period}</div></td><td>{plan.features.slice(0, 3).join(', ')}{plan.features.length > 3 ? '...' : ''}</td><td>{plan.checkoutType}<div className="admin-muted">{plan.ctaLabel}</div></td><td><span className={`admin-status-badge ${plan.isActive ? 'active' : 'inactive'}`}>{plan.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="admin-button-row"><button type="button" className="admin-secondary-button" onClick={() => openPackageModal(plan)}><Pencil size={15} style={{ marginRight: 6 }} />Edit</button><button type="button" className="admin-danger-button" onClick={() => deletePackage(plan)}><Trash2 size={15} style={{ marginRight: 6 }} />Delete</button></div></td></tr>)}</tbody></table></div></div>
              )}

              {activeView === 'chats' && (
                <div className="admin-panel-card">
                  <div className="admin-section-head"><div><h3>Chats</h3><p>Reply to saved user messages and control the automatic response.</p></div><button type="button" className="admin-secondary-button" onClick={() => loadChats()}><MessageCircle size={16} style={{ marginRight: 8 }} />Refresh</button></div>
                  <form onSubmit={handleChatSettingsSubmit} className="admin-form-grid" style={{ marginBottom: 24 }}>
                    <Field label="Auto Message" full><textarea value={chatSettings.autoReplyMessage} onChange={(event) => setChatSettings((previous) => ({ ...previous, autoReplyMessage: event.target.value }))} required /></Field>
                    <Field label="Auto Reply"><select value={String(chatSettings.autoReplyEnabled)} onChange={(event) => setChatSettings((previous) => ({ ...previous, autoReplyEnabled: event.target.value === 'true' }))}><option value="true">Enabled</option><option value="false">Disabled</option></select></Field>
                    <div className="admin-modal-actions" style={{ padding: 0 }}><button type="submit" className="admin-primary-button" disabled={savingChatSettings}>{savingChatSettings ? 'Saving...' : 'Save Auto Message'}</button></div>
                  </form>
                  <div className="admin-chat-grid">
                    <div className="admin-chat-list">
                      {chats.length === 0 ? <div className="admin-muted">No chats yet.</div> : chats.map((chat) => (
                        <div key={chat.id} className={`admin-chat-list-item ${selectedChatId === chat.id ? 'active' : ''}`}>
                          <button type="button" className="admin-chat-list-item-main" onClick={() => setSelectedChatId(chat.id)}>
                            <strong>{chat.userName}</strong>
                            <span>{chat.email || 'No email'}</span>
                            <small>{chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}</small>
                          </button>
                          <button type="button" className="admin-chat-delete-button" onClick={() => deleteChat(chat)} aria-label={`Delete chat for ${chat.userName}`} title="Delete chat">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="admin-chat-panel">
                      {selectedChat ? <><div className="admin-chat-head"><div><h3>{selectedChat.userName}</h3><p>{selectedChat.email} {selectedChat.phone ? `| ${selectedChat.phone}` : ''}</p></div><span className="admin-status-badge active">{selectedChat.messages.length} messages</span></div><div className="admin-chat-messages">{selectedChat.messages.map((message) => <div key={message.id} className={`admin-chat-bubble ${message.sender === 'user' ? 'user' : 'admin'}`}><p>{message.text}</p><small>{message.sender === 'system' ? 'Auto reply' : message.sender} | {formatDate(message.createdAt)}</small></div>)}</div><form onSubmit={sendAdminReply} className="admin-chat-reply"><input value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Type admin reply" /><button type="submit" className="admin-primary-button"><Send size={15} style={{ marginRight: 8 }} />Reply</button></form></> : <div className="admin-muted">Select a user chat to reply.</div>}
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'settings' && (
                <div className="admin-panel-card">
                  <div className="admin-section-head">
                    <div>
                      <h3>Phone Settings</h3>
                      <p>Update the LiveFit and WorkFit contact numbers used across the footer and WhatsApp buttons.</p>
                    </div>
                  </div>
                  <form onSubmit={handleSiteSettingsSave} className="admin-form-grid">
                    <Field label="LiveFit Phone"><input value={siteSettings.livefitPhone} onChange={(event) => setSiteSettings((previous) => ({ ...previous, livefitPhone: event.target.value }))} placeholder="+91 9890008742" required /></Field>
                    <Field label="WorkFit Phone"><input value={siteSettings.workfitPhone} onChange={(event) => setSiteSettings((previous) => ({ ...previous, workfitPhone: event.target.value }))} placeholder="+1 9256602776" required /></Field>
                    <div className="admin-modal-actions" style={{ padding: '18px 0 0' }}>
                      <button type="submit" className="admin-primary-button" disabled={savingSiteSettings}><Save size={16} style={{ marginRight: 8 }} />{savingSiteSettings ? 'Saving...' : 'Save Phone Numbers'}</button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {modalType === 'program' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title={editingProgramId ? 'Edit Yoga Program' : 'Add Yoga Program'} subtitle="Control public yoga cards, images, modal copy, and benefits." onClose={closeModal} /><form onSubmit={handleProgramSubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Program Title"><input value={programForm.title} onChange={(event) => setProgramForm((previous) => ({ ...previous, title: event.target.value }))} required /></Field>
          <Field label="Tagline"><input value={programForm.tagline} onChange={(event) => setProgramForm((previous) => ({ ...previous, tagline: event.target.value }))} required /></Field>
          <Field label="Short Description" full><textarea value={programForm.desc} onChange={(event) => setProgramForm((previous) => ({ ...previous, desc: event.target.value }))} required /></Field>
          <Field label="Icon"><select value={programForm.iconKey} onChange={(event) => setProgramForm((previous) => ({ ...previous, iconKey: event.target.value }))}>{iconOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
          <Field label="Display Order"><input type="number" min="0" value={programForm.displayOrder} onChange={(event) => setProgramForm((previous) => ({ ...previous, displayOrder: event.target.value }))} /></Field>
          <Field label="Overview" full><textarea value={programForm.overview} onChange={(event) => setProgramForm((previous) => ({ ...previous, overview: event.target.value }))} required /></Field>
          <Field label="Details" full><textarea value={programForm.details} onChange={(event) => setProgramForm((previous) => ({ ...previous, details: event.target.value }))} required /></Field>
          <Field label="Benefits" full><textarea value={programForm.benefits} onChange={(event) => setProgramForm((previous) => ({ ...previous, benefits: event.target.value }))} placeholder="Enter one benefit per line" required /></Field>
          <Field label="Upload Photo"><input type="file" accept="image/*" onChange={(event) => setProgramForm((previous) => ({ ...previous, imageFile: event.target.files?.[0] || null }))} /></Field>
          <Field label="Status"><select value={String(programForm.isActive)} onChange={(event) => setProgramForm((previous) => ({ ...previous, isActive: event.target.value === 'true' }))}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          <ImagePreview src={programPreview} alt={programForm.title || 'Program preview'} />
        </div></div><ModalActions submitting={submitting} editing={!!editingProgramId} createLabel="Create Yoga Program" updateLabel="Update Yoga Program" onCancel={closeModal} /></form></div></div>
      )}

      {modalType === 'yoga-type' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title={editingYogaTypeId ? 'Edit Yoga Type' : 'Add Yoga Type'} subtitle="Control the dedicated Yoga Types section below public wellness program cards." onClose={closeModal} /><form onSubmit={handleYogaTypeSubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Yoga Type Title"><input value={yogaTypeForm.title} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, title: event.target.value }))} required /></Field>
          <Field label="Tagline"><input value={yogaTypeForm.tagline} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, tagline: event.target.value }))} required /></Field>
          <Field label="Short Description" full><textarea value={yogaTypeForm.desc} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, desc: event.target.value }))} required /></Field>
          <Field label="Icon"><select value={yogaTypeForm.iconKey} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, iconKey: event.target.value }))}>{iconOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
          <Field label="Display Order"><input type="number" min="0" value={yogaTypeForm.displayOrder} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, displayOrder: event.target.value }))} /></Field>
          <Field label="Overview" full><textarea value={yogaTypeForm.overview} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, overview: event.target.value }))} required /></Field>
          <Field label="Details" full><textarea value={yogaTypeForm.details} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, details: event.target.value }))} required /></Field>
          <Field label="Benefits" full><textarea value={yogaTypeForm.benefits} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, benefits: event.target.value }))} placeholder="Enter one benefit per line" required /></Field>
          <Field label="Perfect For" full><textarea value={yogaTypeForm.perfectFor} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, perfectFor: event.target.value }))} placeholder="Enter one audience or use case per line" /></Field>
          <Field label="Upload Photo"><input type="file" accept="image/*" onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, imageFile: event.target.files?.[0] || null }))} /></Field>
          <Field label="Status"><select value={String(yogaTypeForm.isActive)} onChange={(event) => setYogaTypeForm((previous) => ({ ...previous, isActive: event.target.value === 'true' }))}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          <ImagePreview src={yogaTypePreview} alt={yogaTypeForm.title || 'Yoga type preview'} />
        </div></div><ModalActions submitting={submitting} editing={!!editingYogaTypeId} createLabel="Create Yoga Type" updateLabel="Update Yoga Type" onCancel={closeModal} /></form></div></div>
      )}

      {modalType === 'yoga-challenge' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title={editingYogaChallengeId ? 'Edit Yoga Challenge' : 'Add Yoga Challenge'} subtitle="Control the public Programs & Challenges section from MongoDB." onClose={closeModal} /><form onSubmit={handleYogaChallengeSubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Title"><input value={yogaChallengeForm.title} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, title: event.target.value }))} required /></Field>
          <Field label="Category"><input value={yogaChallengeForm.category} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, category: event.target.value }))} required /></Field>
          <Field label="Short Description" full><textarea value={yogaChallengeForm.desc} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, desc: event.target.value }))} required /></Field>
          <Field label="Icon"><select value={yogaChallengeForm.iconKey} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, iconKey: event.target.value }))}>{iconOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
          <Field label="Color"><select value={yogaChallengeForm.color} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, color: event.target.value }))}>{challengeColorOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field>
          <Field label="Days"><input value={yogaChallengeForm.days} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, days: event.target.value }))} required /></Field>
          <Field label="Level"><input value={yogaChallengeForm.level} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, level: event.target.value }))} required /></Field>
          <Field label="Display Order"><input type="number" min="0" value={yogaChallengeForm.displayOrder} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, displayOrder: event.target.value }))} /></Field>
          <Field label="Overview" full><textarea value={yogaChallengeForm.overview} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, overview: event.target.value }))} required /></Field>
          <Field label="What User Will Follow" full><textarea value={yogaChallengeForm.follow} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, follow: event.target.value }))} placeholder="Enter one item per line" /></Field>
          <Field label="Best For" full><textarea value={yogaChallengeForm.bestFor} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, bestFor: event.target.value }))} placeholder="Enter one item per line" /></Field>
          <Field label="Upload Photo"><input type="file" accept="image/*" onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, imageFile: event.target.files?.[0] || null }))} /></Field>
          <Field label="Status"><select value={String(yogaChallengeForm.isActive)} onChange={(event) => setYogaChallengeForm((previous) => ({ ...previous, isActive: event.target.value === 'true' }))}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          <ImagePreview src={yogaChallengePreview} alt={yogaChallengeForm.title || 'Yoga challenge preview'} />
        </div></div><ModalActions submitting={submitting} editing={!!editingYogaChallengeId} createLabel="Create Yoga Challenge" updateLabel="Update Yoga Challenge" onCancel={closeModal} /></form></div></div>
      )}

      {modalType === 'user' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title="Edit User Account" subtitle="Leave password blank to keep the current password." onClose={closeModal} /><form onSubmit={handleUserSubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Name"><input value={userForm.name} onChange={(event) => setUserForm((previous) => ({ ...previous, name: event.target.value }))} required /></Field>
          <Field label="Email"><input type="email" value={userForm.email} onChange={(event) => setUserForm((previous) => ({ ...previous, email: event.target.value }))} required /></Field>
          <Field label="Phone"><input value={userForm.phone} onChange={(event) => setUserForm((previous) => ({ ...previous, phone: event.target.value }))} required /></Field>
          <Field label="Role"><select value={userForm.role} onChange={(event) => setUserForm((previous) => ({ ...previous, role: event.target.value as UserForm['role'] }))}><option value="livefit">LiveFit</option><option value="workfit">WorkFit</option><option value="admin">Admin</option></select></Field>
          <Field label="Focus Areas" full><textarea value={userForm.focusAreas} onChange={(event) => setUserForm((previous) => ({ ...previous, focusAreas: event.target.value }))} placeholder="One focus area per line" /></Field>
          <Field label="New Password"><input type="password" minLength={8} value={userForm.password} onChange={(event) => setUserForm((previous) => ({ ...previous, password: event.target.value }))} placeholder="Leave blank to keep old password" /></Field>
        </div></div><ModalActions submitting={submitting} editing createLabel="Save User" updateLabel="Save User" onCancel={closeModal} /></form></div></div>
      )}

      {modalType === 'paid-user' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title="Change Paid Access" subtitle="Set a manual paid/free status and optional expiry date for this user." onClose={closeModal} /><form onSubmit={handlePaidUserSubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Status"><select value={paidUserForm.status} onChange={(event) => setPaidUserForm((previous) => ({ ...previous, status: event.target.value as PaidUserForm['status'], planName: event.target.value === 'free' ? 'Free Access' : previous.planName }))}><option value="free">Free</option><option value="paid">Paid</option></select></Field>
          <Field label="Product"><select value={paidUserForm.product} onChange={(event) => setPaidUserForm((previous) => ({ ...previous, product: event.target.value as PaidUserForm['product'] }))}><option value="livefit">LiveFit</option><option value="workfit">WorkFit</option></select></Field>
          <Field label="Plan"><select value={paidUserForm.planId} onChange={(event) => { const selected = packages.find((plan) => plan.slug === event.target.value); setPaidUserForm((previous) => ({ ...previous, planId: event.target.value, planName: selected?.name || previous.planName })); }} disabled={paidUserForm.status === 'free'}><option value="">Custom / Free</option>{packages.map((plan) => <option key={plan.id} value={plan.slug}>{plan.name}</option>)}</select></Field>
          <Field label="Plan Name"><input value={paidUserForm.planName} onChange={(event) => setPaidUserForm((previous) => ({ ...previous, planName: event.target.value }))} disabled={paidUserForm.status === 'free'} required={paidUserForm.status === 'paid'} /></Field>
          <Field label="Expiry Date"><input type="date" value={paidUserForm.expiresAt} onChange={(event) => setPaidUserForm((previous) => ({ ...previous, expiresAt: event.target.value }))} disabled={paidUserForm.status === 'free'} /></Field>
        </div></div><ModalActions submitting={submitting} editing createLabel="Save Access" updateLabel="Save Access" onCancel={closeModal} /></form></div></div>
      )}
      {modalType === 'challenge' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title={editingChallengeId ? 'Edit WorkFit Problem' : 'Add WorkFit Problem'} subtitle="This feeds the WorkFit workplace challenges section." onClose={closeModal} /><form onSubmit={handleChallengeSubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Title"><input value={challengeForm.title} onChange={(event) => setChallengeForm((previous) => ({ ...previous, title: event.target.value }))} required /></Field>
          <Field label="Slug"><input value={challengeForm.slug} onChange={(event) => setChallengeForm((previous) => ({ ...previous, slug: event.target.value }))} placeholder="auto-created from title if blank" /></Field>
          <Field label="Description" full><textarea value={challengeForm.desc} onChange={(event) => setChallengeForm((previous) => ({ ...previous, desc: event.target.value }))} required /></Field>
          <Field label="Stat"><input value={challengeForm.stat} onChange={(event) => setChallengeForm((previous) => ({ ...previous, stat: event.target.value }))} required /></Field>
          <Field label="Stat Description"><input value={challengeForm.statDesc} onChange={(event) => setChallengeForm((previous) => ({ ...previous, statDesc: event.target.value }))} required /></Field>
          <Field label="Display Order"><input type="number" min="0" value={challengeForm.displayOrder} onChange={(event) => setChallengeForm((previous) => ({ ...previous, displayOrder: event.target.value }))} /></Field>
          <Field label="Upload Photo"><input type="file" accept="image/*" onChange={(event) => setChallengeForm((previous) => ({ ...previous, imageFile: event.target.files?.[0] || null }))} /></Field>
          <Field label="Status"><select value={String(challengeForm.isActive)} onChange={(event) => setChallengeForm((previous) => ({ ...previous, isActive: event.target.value === 'true' }))}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          <ImagePreview src={challengePreview} alt={challengeForm.title || 'Challenge preview'} />
        </div></div><ModalActions submitting={submitting} editing={!!editingChallengeId} createLabel="Create Problem" updateLabel="Update Problem" onCancel={closeModal} /></form></div></div>
      )}

      {modalType === 'playlist' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title={editingPlaylistId ? 'Edit Playlist' : 'Add Playlist'} subtitle="Upload a thumbnail and connect the playlist/video URL." onClose={closeModal} /><form onSubmit={handlePlaylistSubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Title"><input value={playlistForm.title} onChange={(event) => setPlaylistForm((previous) => ({ ...previous, title: event.target.value }))} required /></Field>
          <Field label="Category"><input value={playlistForm.category} onChange={(event) => setPlaylistForm((previous) => ({ ...previous, category: event.target.value }))} /></Field>
          <Field label="Description" full><textarea value={playlistForm.description} onChange={(event) => setPlaylistForm((previous) => ({ ...previous, description: event.target.value }))} required /></Field>
          <Field label="Video URL" full><input type="url" value={playlistForm.videoUrl} onChange={(event) => setPlaylistForm((previous) => ({ ...previous, videoUrl: event.target.value }))} required /></Field>
          <Field label="Display Order"><input type="number" min="0" value={playlistForm.displayOrder} onChange={(event) => setPlaylistForm((previous) => ({ ...previous, displayOrder: event.target.value }))} /></Field>
          <Field label="Upload Thumbnail"><input type="file" accept="image/*" onChange={(event) => setPlaylistForm((previous) => ({ ...previous, thumbnailFile: event.target.files?.[0] || null }))} /></Field>
          <Field label="Status"><select value={String(playlistForm.isActive)} onChange={(event) => setPlaylistForm((previous) => ({ ...previous, isActive: event.target.value === 'true' }))}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          <ImagePreview src={playlistPreview} alt={playlistForm.title || 'Playlist preview'} />
        </div></div><ModalActions submitting={submitting} editing={!!editingPlaylistId} createLabel="Create Playlist" updateLabel="Update Playlist" onCancel={closeModal} /></form></div></div>
      )}

      {modalType === 'gallery' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title={editingGalleryId ? 'Edit Gallery Image' : 'Add Gallery Image'} subtitle="Upload photos for the dedicated public gallery page." onClose={closeModal} /><form onSubmit={handleGallerySubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Title"><input value={galleryForm.title} onChange={(event) => setGalleryForm((previous) => ({ ...previous, title: event.target.value }))} required /></Field>
          <Field label="Category"><select value={galleryForm.category} onChange={(event) => setGalleryForm((previous) => ({ ...previous, category: event.target.value }))}><option value="Meditation Library">Meditation Library</option><option value="Practice Library">Practice Library</option><option value="Picture Gallery">Picture Gallery</option></select></Field>
          <Field label="Display Order"><input type="number" min="0" value={galleryForm.displayOrder} onChange={(event) => setGalleryForm((previous) => ({ ...previous, displayOrder: event.target.value }))} /></Field>
          <Field label="Alt Text" full><input value={galleryForm.alt} onChange={(event) => setGalleryForm((previous) => ({ ...previous, alt: event.target.value }))} placeholder="Describe the image for accessibility" /></Field>
          <Field label="Upload Photo"><input type="file" accept="image/*" onChange={(event) => setGalleryForm((previous) => ({ ...previous, imageFile: event.target.files?.[0] || null }))} /></Field>
          <Field label="Status"><select value={String(galleryForm.isActive)} onChange={(event) => setGalleryForm((previous) => ({ ...previous, isActive: event.target.value === 'true' }))}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          <ImagePreview src={galleryPreview} alt={galleryForm.title || 'Gallery preview'} />
        </div></div><ModalActions submitting={submitting} editing={!!editingGalleryId} createLabel="Create Gallery Image" updateLabel="Update Gallery Image" onCancel={closeModal} /></form></div></div>
      )}

      {modalType === 'package' && (
        <div className="admin-modal-overlay" onClick={closeModal}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><ModalHeader title={editingPackageId ? 'Edit Package' : 'Add Package'} subtitle="Manage package price, currency, features, and checkout behavior." onClose={closeModal} /><form onSubmit={handlePackageSubmit}><div className="admin-modal-body"><div className="admin-form-grid">
          <Field label="Package Name"><input value={packageForm.name} onChange={(event) => setPackageForm((previous) => ({ ...previous, name: event.target.value }))} required /></Field>
          <Field label="Slug"><input value={packageForm.slug} onChange={(event) => setPackageForm((previous) => ({ ...previous, slug: event.target.value }))} placeholder="monthly" /></Field>
          <Field label="Price Label"><input value={packageForm.priceLabel} onChange={(event) => setPackageForm((previous) => ({ ...previous, priceLabel: event.target.value }))} placeholder="29 or Custom" required /></Field>
          <Field label="Amount"><input type="number" min="0" step="0.01" value={packageForm.amount} onChange={(event) => setPackageForm((previous) => ({ ...previous, amount: event.target.value }))} /></Field>
          <Field label="Currency"><input value={packageForm.currency} onChange={(event) => setPackageForm((previous) => ({ ...previous, currency: event.target.value.toUpperCase() }))} required /></Field>
          <Field label="Period"><input value={packageForm.period} onChange={(event) => setPackageForm((previous) => ({ ...previous, period: event.target.value }))} placeholder="/ month" /></Field>
          <Field label="CTA Label"><input value={packageForm.ctaLabel} onChange={(event) => setPackageForm((previous) => ({ ...previous, ctaLabel: event.target.value }))} required /></Field>
          <Field label="Checkout"><select value={packageForm.checkoutType} onChange={(event) => setPackageForm((previous) => ({ ...previous, checkoutType: event.target.value as PackageForm['checkoutType'] }))}><option value="razorpay">Razorpay</option><option value="whatsapp">WhatsApp</option></select></Field>
          <Field label="Display Order"><input type="number" min="0" value={packageForm.displayOrder} onChange={(event) => setPackageForm((previous) => ({ ...previous, displayOrder: event.target.value }))} /></Field>
          <Field label="Popular"><select value={String(packageForm.isPopular)} onChange={(event) => setPackageForm((previous) => ({ ...previous, isPopular: event.target.value === 'true' }))}><option value="false">No</option><option value="true">Yes</option></select></Field>
          <Field label="Status"><select value={String(packageForm.isActive)} onChange={(event) => setPackageForm((previous) => ({ ...previous, isActive: event.target.value === 'true' }))}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          <div className="admin-form-field full"><label>Features</label><div className="admin-feature-list">{packageForm.features.map((feature, index) => <div key={index} className="admin-feature-row"><input value={feature} onChange={(event) => setPackageForm((previous) => ({ ...previous, features: previous.features.map((item, itemIndex) => itemIndex === index ? event.target.value : item) }))} placeholder={`Feature ${index + 1}`} required /><button type="button" className="admin-danger-button" onClick={() => setPackageForm((previous) => { const nextFeatures = previous.features.filter((_, itemIndex) => itemIndex !== index); return { ...previous, features: nextFeatures.length ? nextFeatures : [''] }; })}><Trash2 size={14} /></button></div>)}</div><button type="button" className="admin-secondary-button" style={{ marginTop: 10 }} onClick={() => setPackageForm((previous) => ({ ...previous, features: [...previous.features, ''] }))}><Plus size={15} style={{ marginRight: 6 }} />Add Feature</button></div>
        </div></div><ModalActions submitting={submitting} editing={!!editingPackageId} createLabel="Create Package" updateLabel="Update Package" onCancel={closeModal} /></form></div></div>
      )}
    </div>
  );
};

export default AdminDashboard;


