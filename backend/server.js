const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const https = require('https');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const multer = require('multer');
const sharp = require('sharp');
const firebaseAdmin = require('firebase-admin');
const { defaultYogaPrograms, yogaProgramsSection } = require('./data/defaultYogaPrograms');
const { defaultWorkfitChallenges } = require('./data/defaultWorkfitChallenges');
const { defaultYogaChallenges, yogaChallengesSection } = require('./data/defaultYogaChallenges');

const app = express();
app.use(express.json());
app.use(cors());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(imagesDir));

const EMAIL_FROM = process.env.EMAIL_USER || 'work.fit.wellnesss@gmail.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || EMAIL_FROM;
const INQUIRY_TO_EMAIL = process.env.INQUIRY_TO_EMAIL || 'Workfitbylivefit@gmail.com';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const ADMIN_ID = process.env.ADMIN_ID || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let firebaseAuth = null;
try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const serviceAccount = serviceAccountPath && fs.existsSync(serviceAccountPath)
    ? require(serviceAccountPath)
    : process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
      ? {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }
      : null;

  if (serviceAccount && !firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });
    firebaseAuth = firebaseAdmin.auth();
  }
} catch (err) {
  console.warn('Firebase Admin is not configured:', err.message);
}

const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    amount: 29,
    currency: 'INR',
    description: 'Live online sessions, video library access, community support, mobile app access',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    amount: 300,
    currency: 'INR',
    description: 'Everything in Monthly, best yearly value, continuity support, full LiveFit access',
  },
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_FROM,
    pass: process.env.EMAIL_PASS || 'your_app_password', // Needs real app password in .env
  },
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yoga_db';
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDefaultYogaProgramsIfNeeded();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firebaseUid: { type: String, default: '', index: true },
  authProvider: { type: String, enum: ['password', 'firebase', 'google'], default: 'password' },
  emailVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['livefit', 'workfit', 'admin'], default: 'livefit' },
  focusAreas: { type: [String], default: [] },
  membership: {
    isManualOverride: { type: Boolean, default: false },
    status: { type: String, enum: ['free', 'paid'], default: 'free' },
    product: { type: String, enum: ['livefit', 'workfit'], default: 'livefit' },
    planId: { type: String, default: '' },
    planName: { type: String, default: 'Free Access' },
    expiresAt: { type: Date, default: null },
    updatedAt: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
});

// Enforce unique combinations of email and role
// userSchema.index({ email: 1, role: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

const paymentSchema = new mongoose.Schema({
  product: { type: String, enum: ['livefit', 'workfit'], default: 'livefit' },
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'INR' },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  receipt: { type: String, required: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String, required: true, unique: true },
  razorpaySignature: { type: String, required: true },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'paid' },
  paidAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

const contentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

const yogaProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    tagline: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    iconKey: { type: String, default: 'sparkles' },
    overview: { type: String, required: true },
    details: { type: String, required: true },
    benefits: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const YogaProgram = mongoose.model('YogaProgram', yogaProgramSchema);

const yogaChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    iconKey: { type: String, default: 'target' },
    days: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, default: 'bg-orange-500' },
    overview: { type: String, required: true },
    follow: { type: [String], default: [] },
    bestFor: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const YogaChallenge = mongoose.model('YogaChallenge', yogaChallengeSchema);

const workfitChallengeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    stat: { type: String, required: true },
    statDesc: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const WorkfitChallenge = mongoose.model('WorkfitChallenge', workfitChallengeSchema);

const playlistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, default: 'Wellness' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);

const packageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    priceLabel: { type: String, required: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    period: { type: String, default: '' },
    features: { type: [String], default: [] },
    ctaLabel: { type: String, default: 'Buy Plan' },
    checkoutType: { type: String, enum: ['razorpay', 'whatsapp'], default: 'razorpay' },
    isPopular: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', packageSchema);

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['user', 'admin', 'system'], required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const chatThreadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    userName: { type: String, default: 'Guest User' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    messages: { type: [chatMessageSchema], default: [] },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    lastMessageAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

chatThreadSchema.index({ userId: 1 });
chatThreadSchema.index({ email: 1 });
chatThreadSchema.index({ lastMessageAt: -1 });

const ChatThread = mongoose.model('ChatThread', chatThreadSchema);

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true, unique: true },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
    visits: { type: Number, default: 1 },
    lastPath: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model('Visitor', visitorSchema);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

async function convertUploadToWebp(file, prefix = 'upload') {
  if (!file) {
    return '';
  }

  const originalExtension = path.extname(file.originalname || '').toLowerCase();
  const safeBaseName = path
    .basename(file.originalname || prefix, originalExtension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || prefix;

  const fileName = `${prefix}-${safeBaseName}-${Date.now()}.webp`;
  const absolutePath = path.join(uploadsDir, fileName);
  await sharp(file.buffer).webp({ quality: 82 }).toFile(absolutePath);
  return `/uploads/${fileName}`;
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    focusAreas: user.focusAreas,
    emailVerified: Boolean(user.emailVerified),
    authProvider: user.authProvider,
    createdAt: user.createdAt,
  };
}

function createUserToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
}

function buildAuthResponse(user) {
  return {
    token: createUserToken(user),
    user: sanitizeUser(user),
  };
}

function mapPaymentRecord(payment) {
  return {
    id: payment._id,
    product: payment.product,
    planId: payment.planId,
    planName: payment.planName,
    amount: payment.amount,
    currency: payment.currency,
    receipt: payment.receipt,
    razorpayOrderId: payment.razorpayOrderId,
    razorpayPaymentId: payment.razorpayPaymentId,
    status: payment.status,
    paidAt: payment.paidAt,
    expiresAt: payment.expiresAt,
    createdAt: payment.createdAt,
    customer: payment.customer,
  };
}

function isFutureOrOpenDate(value) {
  return !value || new Date(value).getTime() > Date.now();
}

function buildMembershipStatus(payment, productLabel) {
  if (!payment || !isFutureOrOpenDate(payment.expiresAt)) {
    return {
      product: productLabel,
      hasAccess: false,
      statusLabel: 'Free',
      planName: 'Free Access',
      paidAt: null,
      amount: null,
      currency: 'INR',
    };
  }

  return {
    product: productLabel,
    hasAccess: true,
    statusLabel: 'Paid',
    planName: payment.planName,
    paidAt: payment.paidAt,
    expiresAt: payment.expiresAt || null,
    amount: payment.amount,
    currency: payment.currency,
    receipt: payment.receipt,
    razorpayPaymentId: payment.razorpayPaymentId,
    source: payment.source || 'payment',
  };
}

function buildManualMembershipRecord(user, product) {
  const membership = user?.membership || {};
  if (!membership.isManualOverride || membership.product !== product) {
    return null;
  }

  if (membership.status !== 'paid' || !isFutureOrOpenDate(membership.expiresAt)) {
    return null;
  }

  return {
    product,
    planId: membership.planId || 'admin-assigned',
    planName: membership.planName || 'Admin Assigned Plan',
    amount: 0,
    currency: 'INR',
    paidAt: membership.updatedAt || user.updatedAt || user.createdAt,
    expiresAt: membership.expiresAt || null,
    receipt: 'admin-assigned',
    razorpayPaymentId: 'admin-assigned',
    source: 'admin',
  };
}

function resolveMembershipRecord(user, product, latestPayment) {
  const membership = user?.membership || {};
  if (membership.isManualOverride && membership.product === product) {
    return buildManualMembershipRecord(user, product);
  }

  return latestPayment && isFutureOrOpenDate(latestPayment.expiresAt) ? latestPayment : null;
}

function createAdminToken() {
  return jwt.sign(
    {
      adminId: ADMIN_ID,
      role: 'admin',
      scope: 'admin',
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '8h' }
  );
}

function parseBenefits(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeYogaProgramPayload(body, imagePath) {
  const normalizedTitle = String(body.title || '').trim();
  const normalizedTagline = String(body.tagline || '').trim();
  const normalizedDesc = String(body.desc || '').trim();
  const normalizedOverview = String(body.overview || '').trim();
  const normalizedDetails = String(body.details || '').trim();
  const normalizedImage = imagePath || String(body.image || body.imagePath || '').trim();

  return {
    title: normalizedTitle,
    tagline: normalizedTagline,
    desc: normalizedDesc,
    image: normalizedImage,
    iconKey: String(body.iconKey || 'sparkles').trim() || 'sparkles',
    overview: normalizedOverview,
    details: normalizedDetails,
    benefits: parseBenefits(body.benefits),
    displayOrder: Number(body.displayOrder || 0) || 0,
    isActive: String(body.isActive ?? 'true') !== 'false',
  };
}

function sanitizeYogaProgram(program) {
  return {
    id: program._id,
    title: program.title,
    tagline: program.tagline,
    desc: program.desc,
    image: program.image,
    iconKey: program.iconKey,
    overview: program.overview,
    details: program.details,
    benefits: program.benefits,
    displayOrder: program.displayOrder,
    isActive: program.isActive,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt,
  };
}

function normalizeYogaChallengePayload(body, imagePath) {
  const title = String(body.title || '').trim();
  return {
    title,
    desc: String(body.desc || '').trim(),
    image: imagePath || String(body.image || body.imagePath || '').trim(),
    iconKey: String(body.iconKey || 'target').trim() || 'target',
    days: String(body.days || '').trim(),
    level: String(body.level || '').trim(),
    category: String(body.category || '').trim(),
    color: String(body.color || 'bg-orange-500').trim() || 'bg-orange-500',
    overview: String(body.overview || '').trim(),
    follow: parseBenefits(body.follow),
    bestFor: parseBenefits(body.bestFor),
    displayOrder: Number(body.displayOrder || 0) || 0,
    isActive: normalizeBoolean(body.isActive, true),
  };
}

function sanitizeYogaChallenge(challenge) {
  return {
    id: challenge._id,
    title: challenge.title,
    desc: challenge.desc,
    image: challenge.image,
    iconKey: challenge.iconKey,
    days: challenge.days,
    level: challenge.level,
    category: challenge.category,
    color: challenge.color,
    overview: challenge.overview,
    follow: challenge.follow,
    bestFor: challenge.bestFor,
    displayOrder: challenge.displayOrder,
    isActive: challenge.isActive,
    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt,
  };
}

function createSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return String(value) === 'true';
}

function normalizeWorkfitChallengePayload(body, imagePath) {
  const title = String(body.title || '').trim();
  const slug = createSlug(body.slug || title);

  return {
    slug,
    title,
    desc: String(body.desc || '').trim(),
    image: imagePath || String(body.image || body.imagePath || '').trim(),
    stat: String(body.stat || '').trim(),
    statDesc: String(body.statDesc || '').trim(),
    displayOrder: Number(body.displayOrder || 0) || 0,
    isActive: normalizeBoolean(body.isActive, true),
  };
}

function sanitizeWorkfitChallenge(challenge) {
  return {
    id: challenge._id,
    slug: challenge.slug,
    title: challenge.title,
    desc: challenge.desc,
    image: challenge.image,
    stat: challenge.stat,
    statDesc: challenge.statDesc,
    displayOrder: challenge.displayOrder,
    isActive: challenge.isActive,
    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt,
  };
}

function normalizePlaylistPayload(body, imagePath) {
  return {
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    videoUrl: String(body.videoUrl || '').trim(),
    thumbnail: imagePath || String(body.thumbnail || body.thumbnailPath || '').trim(),
    category: String(body.category || 'Wellness').trim() || 'Wellness',
    displayOrder: Number(body.displayOrder || 0) || 0,
    isActive: normalizeBoolean(body.isActive, true),
  };
}

function sanitizePlaylist(playlist) {
  return {
    id: playlist._id,
    title: playlist.title,
    description: playlist.description,
    videoUrl: playlist.videoUrl,
    thumbnail: playlist.thumbnail,
    category: playlist.category,
    displayOrder: playlist.displayOrder,
    isActive: playlist.isActive,
    createdAt: playlist.createdAt,
    updatedAt: playlist.updatedAt,
  };
}

const defaultPackages = [
  {
    slug: 'monthly',
    name: 'Monthly',
    priceLabel: '29',
    amount: 29,
    currency: 'INR',
    period: '/ month',
    features: ['Live online sessions', 'Video library access', 'Community support', 'Mobile app access'],
    ctaLabel: 'Buy Plan',
    checkoutType: 'razorpay',
    isPopular: false,
    displayOrder: 1,
    isActive: true,
  },
  {
    slug: 'yearly',
    name: 'Yearly',
    priceLabel: '300',
    amount: 300,
    currency: 'INR',
    period: '/ year',
    features: ['Everything in Monthly', 'Best yearly value', 'Continuity support', 'Full LiveFit access'],
    ctaLabel: 'Buy Plan',
    checkoutType: 'razorpay',
    isPopular: true,
    displayOrder: 2,
    isActive: true,
  },
  {
    slug: 'one-on-one',
    name: 'One On One',
    priceLabel: 'Custom',
    amount: 0,
    currency: 'INR',
    period: '',
    features: ['Private guidance with your coach', 'Custom goals and flexible timing', 'Personal wellness roadmap', 'Direct WhatsApp planning support'],
    ctaLabel: 'Buy on WhatsApp',
    checkoutType: 'whatsapp',
    isPopular: false,
    displayOrder: 3,
    isActive: true,
  },
];

function normalizePackagePayload(body) {
  const name = String(body.name || '').trim();
  const slug = createSlug(body.slug || name);
  const checkoutType = body.checkoutType === 'whatsapp' ? 'whatsapp' : 'razorpay';
  const amount = Number(body.amount || 0);

  return {
    slug,
    name,
    priceLabel: String(body.priceLabel || (amount > 0 ? amount : 'Custom')).trim(),
    amount: Number.isFinite(amount) ? amount : 0,
    currency: String(body.currency || 'INR').trim().toUpperCase() || 'INR',
    period: String(body.period || '').trim(),
    features: parseBenefits(body.features),
    ctaLabel: String(body.ctaLabel || (checkoutType === 'whatsapp' ? 'Buy on WhatsApp' : 'Buy Plan')).trim(),
    checkoutType,
    isPopular: normalizeBoolean(body.isPopular, false),
    displayOrder: Number(body.displayOrder || 0) || 0,
    isActive: normalizeBoolean(body.isActive, true),
  };
}

function sanitizePackage(plan) {
  return {
    id: plan._id,
    slug: plan.slug,
    name: plan.name,
    priceLabel: plan.priceLabel,
    amount: plan.amount,
    currency: plan.currency,
    period: plan.period,
    features: plan.features,
    ctaLabel: plan.ctaLabel,
    checkoutType: plan.checkoutType,
    isPopular: plan.isPopular,
    displayOrder: plan.displayOrder,
    isActive: plan.isActive,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

const defaultGalleryImages = [
  { title: 'Quick Wellness Practice', image: '/images/Gal3.webp', alt: 'Guided wellness video session', displayOrder: 1, isActive: true },
  { title: 'Community Yoga Moment', image: '/images/Gal4.webp', alt: 'Yoga and wellness community moment', displayOrder: 2, isActive: true },
  { title: 'Mindful Practice', image: '/images/3.webp', alt: 'Mindful yoga practice', displayOrder: 3, isActive: true },
  { title: 'Outdoor Wellness', image: '/images/7.webp', alt: 'Outdoor wellness lifestyle', displayOrder: 4, isActive: true },
];

function normalizeGalleryImagePayload(body, imagePath) {
  const title = String(body.title || '').trim();
  return {
    title,
    image: imagePath || String(body.image || body.imagePath || '').trim(),
    alt: String(body.alt || title).trim(),
    displayOrder: Number(body.displayOrder || 0) || 0,
    isActive: normalizeBoolean(body.isActive, true),
  };
}

function sanitizeGalleryImage(item) {
  return {
    id: item._id,
    title: item.title,
    image: item.image,
    alt: item.alt,
    displayOrder: item.displayOrder,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function sanitizeChatThread(thread) {
  return {
    id: thread._id,
    userId: thread.userId,
    userName: thread.userName,
    email: thread.email,
    phone: thread.phone,
    status: thread.status,
    lastMessageAt: thread.lastMessageAt,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    messages: thread.messages.map((message) => ({
      id: message._id,
      sender: message.sender,
      text: message.text,
      createdAt: message.createdAt,
    })),
  };
}

function removeUploadedFile(filePath) {
  if (!filePath || !String(filePath).startsWith('/uploads/')) {
    return;
  }

  const absolutePath = path.join(uploadsDir, path.basename(filePath));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

async function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    const error = new Error('No authorization token provided');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (tokenErr) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function getOptionalAuthenticatedUser(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    return await getAuthenticatedUser(req);
  } catch (_err) {
    return null;
  }
}

function getAdminSession(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    const error = new Error('No authorization token provided');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (_tokenErr) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 401;
    throw error;
  }

  if (decoded.scope !== 'admin' || decoded.adminId !== ADMIN_ID) {
    const error = new Error('Access denied: Admin permissions required');
    error.statusCode = 403;
    throw error;
  }

  return {
    adminId: decoded.adminId,
    role: decoded.role,
  };
}

function requireAdminAccess(req) {
  return getAdminSession(req);
}

async function getChatSettings() {
  const defaultSettings = {
    autoReplyEnabled: true,
    autoReplyMessage: 'Thanks for reaching out. A wellness expert will reply shortly.',
  };

  const settings = await Content.findOne({ page: 'chat-settings' });
  if (!settings) {
    await Content.create({ page: 'chat-settings', data: defaultSettings, updatedAt: new Date() });
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...(settings.data || {}),
  };
}

async function findOrCreateChatThread({ user, name, email, phone }) {
  const normalizedEmail = String(email || user?.email || '').trim().toLowerCase();
  const normalizedPhone = String(phone || user?.phone || '').trim();
  const displayName = String(name || user?.name || normalizedEmail || 'Guest User').trim();
  let thread = null;

  if (user?._id) {
    thread = await ChatThread.findOne({ userId: user._id });
  }

  if (!thread && normalizedEmail) {
    thread = await ChatThread.findOne({ email: normalizedEmail });
  }

  if (!thread) {
    thread = new ChatThread({
      userId: user?._id || null,
      userName: displayName,
      email: normalizedEmail,
      phone: normalizedPhone,
      messages: [],
      lastMessageAt: new Date(),
    });
  }

  thread.userId = thread.userId || user?._id || null;
  thread.userName = displayName || thread.userName;
  thread.email = normalizedEmail || thread.email;
  thread.phone = normalizedPhone || thread.phone;

  return thread;
}

async function buildAccountOverviewForUser(user) {
  const normalizedEmail = String(user.email || '').trim().toLowerCase();
  const payments = await Payment.find({ 'customer.email': normalizedEmail }).sort({ paidAt: -1, createdAt: -1 });
  const paidPayments = payments.filter((payment) => payment.status === 'paid');
  const latestLiveFitPayment = paidPayments.find((payment) => payment.product === 'livefit') || null;
  const latestWorkFitPayment = paidPayments.find((payment) => payment.product === 'workfit') || null;
  const effectiveLiveFitMembership = resolveMembershipRecord(user, 'livefit', latestLiveFitPayment);
  const effectiveWorkFitMembership = resolveMembershipRecord(user, 'workfit', latestWorkFitPayment);
  const activeMemberships = [effectiveLiveFitMembership, effectiveWorkFitMembership].filter(Boolean);
  const latestMembership = activeMemberships
    .slice()
    .sort((a, b) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime())[0] || null;

  return {
    user: sanitizeUser(user),
    hasPaidAccess: activeMemberships.length > 0,
    totalActivePlans: activeMemberships.length,
    activePlanNames: activeMemberships.map((payment) => payment.planName),
    membershipStatus: {
      livefit: buildMembershipStatus(effectiveLiveFitMembership, 'LiveFit'),
      workfit: buildMembershipStatus(effectiveWorkFitMembership, 'WorkFit'),
    },
    latestMembership: latestMembership
      ? {
          product: latestMembership.product,
          planName: latestMembership.planName,
          amount: latestMembership.amount,
          currency: latestMembership.currency,
          paidAt: latestMembership.paidAt,
          expiresAt: latestMembership.expiresAt || null,
          receipt: latestMembership.receipt,
        }
      : null,
    paymentHistory: payments.map(mapPaymentRecord),
  };
}

function sanitizePaidUser(user, payments = []) {
  const paidPayments = payments.filter((payment) => payment.status === 'paid');
  const latestLiveFitPayment = paidPayments.find((payment) => payment.product === 'livefit') || null;
  const latestWorkFitPayment = paidPayments.find((payment) => payment.product === 'workfit') || null;
  const effectiveLiveFitMembership = resolveMembershipRecord(user, 'livefit', latestLiveFitPayment);
  const effectiveWorkFitMembership = resolveMembershipRecord(user, 'workfit', latestWorkFitPayment);
  const activeMemberships = [effectiveLiveFitMembership, effectiveWorkFitMembership].filter(Boolean);
  const latestMembership = activeMemberships
    .slice()
    .sort((a, b) => new Date(b.paidAt || 0).getTime() - new Date(a.paidAt || 0).getTime())[0] || null;
  const membership = user.membership || {};

  return {
    ...sanitizeUser(user),
    paid: Boolean(latestMembership),
    planId: latestMembership?.planId || '',
    planName: latestMembership?.planName || 'Free Access',
    product: latestMembership?.product || membership.product || 'livefit',
    source: latestMembership?.source || (latestMembership ? 'payment' : membership.isManualOverride ? 'admin' : 'none'),
    expiresAt: latestMembership?.expiresAt || membership.expiresAt || null,
    manualMembership: {
      isManualOverride: Boolean(membership.isManualOverride),
      status: membership.status || 'free',
      product: membership.product || 'livefit',
      planId: membership.planId || '',
      planName: membership.planName || 'Free Access',
      expiresAt: membership.expiresAt || null,
      updatedAt: membership.updatedAt || null,
    },
    totalPayments: paidPayments.length,
    latestPayment: paidPayments[0] ? mapPaymentRecord(paidPayments[0]) : null,
  };
}

async function buildAdminOverview() {
  const [totalPrograms, activePrograms, totalUsers, uniqueVisitors, totalPayments, earningsSummary, usersByRole, recentPrograms] = await Promise.all([
    YogaProgram.countDocuments(),
    YogaProgram.countDocuments({ isActive: true }),
    User.countDocuments({ role: { $in: ['livefit', 'workfit'] } }),
    Visitor.countDocuments(),
    Payment.countDocuments({ status: 'paid' }),
    Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalEarned: { $sum: '$amount' } } },
    ]),
    Promise.all([
      User.countDocuments({ role: 'livefit' }),
      User.countDocuments({ role: 'workfit' }),
    ]),
    YogaProgram.find().sort({ updatedAt: -1, createdAt: -1 }).limit(5),
  ]);

  const totalEarned = Number(earningsSummary[0]?.totalEarned || 0);

  return {
    admin: {
      adminId: ADMIN_ID,
      displayName: 'LiveFit Admin',
      joinedLabel: 'Environment Protected',
      location: 'LiveFit Admin Console',
    },
    stats: {
      totalPrograms,
      activePrograms,
      totalUsers,
      uniqueVisitors,
      totalPayments,
      totalEarned,
      usersByRole: {
        livefit: usersByRole[0],
        workfit: usersByRole[1],
      },
    },
    recentPrograms: recentPrograms.map(sanitizeYogaProgram),
  };
}

async function seedDefaultYogaProgramsIfNeeded() {
  try {
    const existingProgramsCount = await YogaProgram.countDocuments();
    if (existingProgramsCount === 0) {
      await YogaProgram.insertMany(defaultYogaPrograms);
      console.log(`Seeded ${defaultYogaPrograms.length} default yoga programs.`);
    }

    const existingYogaChallengesCount = await YogaChallenge.countDocuments();
    if (existingYogaChallengesCount === 0) {
      await YogaChallenge.insertMany(defaultYogaChallenges);
      console.log(`Seeded ${defaultYogaChallenges.length} default yoga challenges.`);
    }

    const existingWorkfitChallengesCount = await WorkfitChallenge.countDocuments();
    if (existingWorkfitChallengesCount === 0) {
      await WorkfitChallenge.insertMany(defaultWorkfitChallenges);
      console.log(`Seeded ${defaultWorkfitChallenges.length} default WorkFit challenges.`);
    }

    const existingSectionContent = await Content.findOne({ page: 'yoga-programs-section' });
    if (!existingSectionContent) {
      await Content.create({
        page: 'yoga-programs-section',
        data: yogaProgramsSection,
        updatedAt: new Date(),
      });
      console.log('Seeded default yoga-programs-section content.');
    }

    const existingYogaChallengesSection = await Content.findOne({ page: 'yoga-challenges-section' });
    if (!existingYogaChallengesSection) {
      await Content.create({
        page: 'yoga-challenges-section',
        data: yogaChallengesSection,
        updatedAt: new Date(),
      });
      console.log('Seeded default yoga-challenges-section content.');
    }

    const existingPackageCount = await Package.countDocuments();
    if (existingPackageCount === 0) {
      await Package.insertMany(defaultPackages);
      console.log(`Seeded ${defaultPackages.length} default packages.`);
    }

    const existingGalleryCount = await GalleryImage.countDocuments();
    if (existingGalleryCount === 0) {
      await GalleryImage.insertMany(defaultGalleryImages);
      console.log(`Seeded ${defaultGalleryImages.length} default gallery images.`);
    }

    await getChatSettings();
  } catch (error) {
    console.error('Error while seeding default yoga programs:', error);
  }
}

function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

async function getPlanById(_product, planId, includeInactive = false) {
  const normalizedPlanId = String(planId || '').trim();
  if (!normalizedPlanId) {
    return null;
  }

  const filter = includeInactive ? { slug: normalizedPlanId } : { slug: normalizedPlanId, isActive: true };
  const managedPlan = await Package.findOne(filter);
  if (managedPlan) {
    return {
      id: managedPlan.slug,
      name: managedPlan.name,
      amount: managedPlan.amount,
      currency: managedPlan.currency || 'INR',
      description: managedPlan.features.join(', '),
      checkoutType: managedPlan.checkoutType,
    };
  }

  return PLANS[normalizedPlanId] || null;
}

function calculatePlanExpiry(plan) {
  const planId = String(plan?.id || '').toLowerCase();
  const planName = String(plan?.name || '').toLowerCase();
  const now = new Date();

  if (planId.includes('year') || planName.includes('year')) {
    now.setFullYear(now.getFullYear() + 1);
    return now;
  }

  if (planId.includes('month') || planName.includes('month')) {
    now.setMonth(now.getMonth() + 1);
    return now;
  }

  return null;
}

async function sendRegistrationConfirmationEmail({ name, phone, email, role }) {
  try {
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Registration Confirmation - LiveFit',
      text: `Hi ${name},\n\nThank you for registering with LiveFit! Your account has been successfully created.\n\nWelcome to our wellness community!`,
    };

    const adminMailOptions = {
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: 'New User Registration - LiveFit',
      text: `A new user has registered on LiveFit.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nRole: ${role}`,
    };

    transporter.sendMail(mailOptions).catch((err) => console.error('Error sending user email:', err));
    transporter.sendMail(adminMailOptions).catch((err) => console.error('Error sending admin email:', err));
  } catch (err) {
    console.error('Email error:', err);
  }
}

function createRazorpayOrder(options) {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return Promise.reject(new Error('Razorpay credentials are missing'));
  }

  const body = JSON.stringify(options);
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.razorpay.com',
        path: '/v1/orders',
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody || '{}');
            if (res.statusCode >= 400) {
              return reject(new Error(parsed.error?.description || parsed.error?.reason || 'Failed to create Razorpay order'));
            }
            resolve(parsed);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function buildPaymentEmail(payment) {
  const paymentDate = new Date(payment.paidAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const lines = [
    `Hi ${payment.customer.name},`,
    '',
    'Your payment has been received successfully.',
    '',
    `Plan: ${payment.planName}`,
    `Amount: ${formatCurrency(payment.amount, payment.currency)}`,
    `Payment ID: ${payment.razorpayPaymentId}`,
    `Order ID: ${payment.razorpayOrderId}`,
    `Receipt: ${payment.receipt}`,
    `Status: ${payment.status}`,
    `Paid At: ${paymentDate}`,
    '',
    'Thank you for choosing LiveFit.',
  ];

  const adminLines = [
    'A new payment has been completed.',
    '',
    `Customer Name: ${payment.customer.name}`,
    `Customer Email: ${payment.customer.email}`,
    `Customer Phone: ${payment.customer.phone}`,
    `Plan: ${payment.planName}`,
    `Amount: ${formatCurrency(payment.amount, payment.currency)}`,
    `Payment ID: ${payment.razorpayPaymentId}`,
    `Order ID: ${payment.razorpayOrderId}`,
    `Receipt: ${payment.receipt}`,
    `Status: ${payment.status}`,
    `Paid At: ${paymentDate}`,
  ];

  return {
    userMailOptions: {
      from: EMAIL_FROM,
      to: payment.customer.email,
      subject: `Payment Received - LiveFit ${payment.planName} Plan`,
      text: lines.join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin: 0 0 16px;">Payment Received</h2>
          <p>Hi ${payment.customer.name},</p>
          <p>Your payment has been received successfully.</p>
          <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 560px;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Plan</td><td>${payment.planName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Amount</td><td>${formatCurrency(payment.amount, payment.currency)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Payment ID</td><td>${payment.razorpayPaymentId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Order ID</td><td>${payment.razorpayOrderId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Receipt</td><td>${payment.receipt}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Status</td><td>${payment.status}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Paid At</td><td>${paymentDate}</td></tr>
          </table>
          <p style="margin-top: 20px;">Thank you for choosing LiveFit.</p>
        </div>
      `,
    },
    adminMailOptions: {
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `Payment Completed - ${payment.customer.name} - ${payment.planName}`,
      text: adminLines.join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin: 0 0 16px;">New Payment Completed</h2>
          <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 640px;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Customer Name</td><td>${payment.customer.name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Customer Email</td><td>${payment.customer.email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Customer Phone</td><td>${payment.customer.phone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Plan</td><td>${payment.planName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Amount</td><td>${formatCurrency(payment.amount, payment.currency)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Payment ID</td><td>${payment.razorpayPaymentId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Order ID</td><td>${payment.razorpayOrderId}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Receipt</td><td>${payment.receipt}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Status</td><td>${payment.status}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Paid At</td><td>${paymentDate}</td></tr>
          </table>
        </div>
      `,
    },
  };
}

async function sendPaymentNotifications(payment) {
  const { userMailOptions, adminMailOptions } = buildPaymentEmail(payment);
  await Promise.allSettled([transporter.sendMail(userMailOptions), transporter.sendMail(adminMailOptions)]);
}

function getRequestIp(req) {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const rawIp = forwardedFor || req.ip || req.socket?.remoteAddress || 'unknown';
  return rawIp.replace(/^::ffff:/, '');
}

app.use((req, _res, next) => {
  if (req.path.startsWith('/api/admin') || req.path.startsWith('/uploads') || req.path.startsWith('/images')) {
    return next();
  }

  const ip = getRequestIp(req);
  if (ip && ip !== 'unknown') {
    Visitor.updateOne(
      { ip },
      {
        $set: {
          lastSeen: new Date(),
          lastPath: req.originalUrl || req.path,
          userAgent: String(req.headers['user-agent'] || '').slice(0, 500),
        },
        $setOnInsert: { firstSeen: new Date() },
        $inc: { visits: 1 },
      },
      { upsert: true }
    ).catch((error) => console.error('Visitor tracking error:', error.message));
  }

  return next();
});

// Auth Routes
app.post('/api/admin/login', async (req, res) => {
  try {
    const adminId = String(req.body.adminId || '').trim();
    const password = String(req.body.password || '');

    if (!adminId || !password) {
      return res.status(400).json({ message: 'Admin ID and password are required' });
    }

    if (adminId !== ADMIN_ID || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    res.json({
      token: createAdminToken(),
      admin: {
        adminId: ADMIN_ID,
        displayName: 'LiveFit Admin',
        role: 'admin',
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role, focusAreas } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const normalizedPhone = phone ? String(phone).trim() : '';

    if (!name || !normalizedEmail || !normalizedPhone || !password) {
      return res.status(400).json({ message: 'Name, email, phone, and password are required' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists. Please login instead.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRole = role === 'workfit' ? 'workfit' : 'livefit';
    const user = new User({
      name: String(name).trim(),
      phone: normalizedPhone,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
      focusAreas: Array.isArray(focusAreas) ? focusAreas : [],
      authProvider: 'password',
    });
    await user.save();
    await sendRegistrationConfirmationEmail({
      name: user.name,
      phone: user.phone,
      email: normalizedEmail,
      role: user.role,
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const userByEmail = await User.findOne({ email: normalizedEmail });
    if (!userByEmail) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const user = userByEmail;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json(buildAuthResponse(user));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/firebase', async (req, res) => {
  try {
    if (!firebaseAuth) {
      return res.status(503).json({ message: 'Firebase authentication is not configured on the server' });
    }

    const idToken = String(req.body.idToken || '').trim();
    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const normalizedEmail = String(decodedToken.email || '').trim().toLowerCase();
    const provider = decodedToken.firebase?.sign_in_provider === 'google.com' ? 'google' : 'firebase';

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Firebase account email is required' });
    }

    if (provider !== 'google' && decodedToken.email_verified !== true) {
      return res.status(403).json({ message: 'Please verify your email before signing in' });
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), salt);
      user = new User({
        name: String(req.body.name || decodedToken.name || normalizedEmail.split('@')[0]).trim(),
        phone: String(req.body.phone || '').trim(),
        email: normalizedEmail,
        password: randomPassword,
        role: req.body.role === 'workfit' ? 'workfit' : 'livefit',
        focusAreas: [],
        firebaseUid: decodedToken.uid,
        authProvider: provider,
        emailVerified: Boolean(decodedToken.email_verified),
      });
      await user.save();
      await sendRegistrationConfirmationEmail({
        name: user.name,
        phone: user.phone,
        email: normalizedEmail,
        role: user.role,
      });
    } else {
      user.firebaseUid = user.firebaseUid || decodedToken.uid;
      user.authProvider = provider;
      user.emailVerified = Boolean(decodedToken.email_verified);
      if (!user.name && (req.body.name || decodedToken.name)) {
        user.name = String(req.body.name || decodedToken.name).trim();
      }
      if (!user.phone && req.body.phone) {
        user.phone = String(req.body.phone).trim();
      }
      await user.save();
    }

    res.json(buildAuthResponse(user));
  } catch (err) {
    console.error('Firebase auth error:', err);
    res.status(401).json({ message: 'Invalid Firebase authentication token' });
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password must be different from your current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
});

app.get('/api/account/overview', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    const overview = await buildAccountOverviewForUser(user);
    res.json(overview);
  } catch (err) {
    console.error('Account overview error:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to load account overview' });
  }
});

app.get('/api/admin/overview', async (req, res) => {
  try {
    requireAdminAccess(req);
    const overview = await buildAdminOverview();
    res.json(overview);
  } catch (err) {
    console.error('Admin overview error:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to load admin overview' });
  }
});

app.get('/api/yoga-programs', async (_req, res) => {
  try {
    const programs = await YogaProgram.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json(programs.map(sanitizeYogaProgram));
  } catch (err) {
    console.error('Error fetching yoga programs:', err);
    res.status(500).json({ message: 'Failed to fetch yoga programs' });
  }
});

app.get('/api/admin/yoga-programs', async (req, res) => {
  try {
    requireAdminAccess(req);
    const programs = await YogaProgram.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json(programs.map(sanitizeYogaProgram));
  } catch (err) {
    console.error('Error fetching admin yoga programs:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch yoga programs' });
  }
});

app.post('/api/admin/yoga-programs', upload.single('image'), async (req, res) => {
  let uploadedImage = '';
  try {
    requireAdminAccess(req);
    uploadedImage = await convertUploadToWebp(req.file, 'yoga-program');
    const payload = normalizeYogaProgramPayload(req.body, uploadedImage);
    if (!payload.title || !payload.tagline || !payload.desc || !payload.overview || !payload.details || !payload.image) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(400).json({
        message: 'Title, tagline, short description, overview, details, and image are required',
      });
    }

    const yogaProgram = await YogaProgram.create(payload);
    res.status(201).json({ message: 'Yoga program created successfully', data: sanitizeYogaProgram(yogaProgram) });
  } catch (err) {
    if (uploadedImage) {
      removeUploadedFile(uploadedImage);
    }

    console.error('Error creating yoga program:', err);
    res.status(500).json({ message: err.code === 11000 ? 'Program title already exists' : 'Failed to create yoga program' });
  }
});

app.put('/api/admin/yoga-programs/:id', upload.single('image'), async (req, res) => {
  let uploadedImage = '';
  try {
    requireAdminAccess(req);

    const existingProgram = await YogaProgram.findById(req.params.id);
    if (!existingProgram) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(404).json({ message: 'Yoga program not found' });
    }

    uploadedImage = await convertUploadToWebp(req.file, 'yoga-program');
    const payload = normalizeYogaProgramPayload(req.body, uploadedImage);
    const updatedPayload = {
      ...payload,
      image: payload.image || existingProgram.image,
    };

    if (!updatedPayload.title || !updatedPayload.tagline || !updatedPayload.desc || !updatedPayload.overview || !updatedPayload.details || !updatedPayload.image) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(400).json({
        message: 'Title, tagline, short description, overview, details, and image are required',
      });
    }

    const previousImage = existingProgram.image;
    Object.assign(existingProgram, updatedPayload);
    await existingProgram.save();

    if (uploadedImage && previousImage !== existingProgram.image) {
      removeUploadedFile(previousImage);
    }

    res.json({ message: 'Yoga program updated successfully', data: sanitizeYogaProgram(existingProgram) });
  } catch (err) {
    if (uploadedImage) {
      removeUploadedFile(uploadedImage);
    }

    console.error('Error updating yoga program:', err);
    res.status(500).json({ message: err.code === 11000 ? 'Program title already exists' : 'Failed to update yoga program' });
  }
});

app.delete('/api/admin/yoga-programs/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const existingProgram = await YogaProgram.findByIdAndDelete(req.params.id);

    if (!existingProgram) {
      return res.status(404).json({ message: 'Yoga program not found' });
    }

    removeUploadedFile(existingProgram.image);
    res.json({ message: 'Yoga program deleted successfully' });
  } catch (err) {
    console.error('Error deleting yoga program:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to delete yoga program' });
  }
});

app.get('/api/yoga-challenges', async (_req, res) => {
  try {
    const challenges = await YogaChallenge.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json(challenges.map(sanitizeYogaChallenge));
  } catch (err) {
    console.error('Error fetching yoga challenges:', err);
    res.status(500).json({ message: 'Failed to fetch yoga challenges' });
  }
});

app.get('/api/admin/yoga-challenges', async (req, res) => {
  try {
    requireAdminAccess(req);
    const challenges = await YogaChallenge.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json(challenges.map(sanitizeYogaChallenge));
  } catch (err) {
    console.error('Error fetching admin yoga challenges:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch yoga challenges' });
  }
});

app.post('/api/admin/yoga-challenges', upload.single('image'), async (req, res) => {
  let uploadedImage = '';
  try {
    requireAdminAccess(req);
    uploadedImage = await convertUploadToWebp(req.file, 'yoga-challenge');
    const payload = normalizeYogaChallengePayload(req.body, uploadedImage);

    if (!payload.title || !payload.desc || !payload.image || !payload.days || !payload.level || !payload.category || !payload.overview) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(400).json({ message: 'Title, description, image, days, level, category, and overview are required' });
    }

    const challenge = await YogaChallenge.create(payload);
    res.status(201).json({ message: 'Yoga challenge created successfully', data: sanitizeYogaChallenge(challenge) });
  } catch (err) {
    if (uploadedImage) {
      removeUploadedFile(uploadedImage);
    }

    console.error('Error creating yoga challenge:', err);
    res.status(500).json({ message: err.code === 11000 ? 'Challenge title already exists' : 'Failed to create yoga challenge' });
  }
});

app.put('/api/admin/yoga-challenges/:id', upload.single('image'), async (req, res) => {
  let uploadedImage = '';
  try {
    requireAdminAccess(req);
    const existingChallenge = await YogaChallenge.findById(req.params.id);
    if (!existingChallenge) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(404).json({ message: 'Yoga challenge not found' });
    }

    uploadedImage = await convertUploadToWebp(req.file, 'yoga-challenge');
    const payload = normalizeYogaChallengePayload(req.body, uploadedImage);
    const updatedPayload = {
      ...payload,
      image: payload.image || existingChallenge.image,
    };

    if (!updatedPayload.title || !updatedPayload.desc || !updatedPayload.image || !updatedPayload.days || !updatedPayload.level || !updatedPayload.category || !updatedPayload.overview) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(400).json({ message: 'Title, description, image, days, level, category, and overview are required' });
    }

    const previousImage = existingChallenge.image;
    Object.assign(existingChallenge, updatedPayload);
    await existingChallenge.save();

    if (uploadedImage && previousImage !== existingChallenge.image) {
      removeUploadedFile(previousImage);
    }

    res.json({ message: 'Yoga challenge updated successfully', data: sanitizeYogaChallenge(existingChallenge) });
  } catch (err) {
    if (uploadedImage) {
      removeUploadedFile(uploadedImage);
    }

    console.error('Error updating yoga challenge:', err);
    res.status(500).json({ message: err.code === 11000 ? 'Challenge title already exists' : 'Failed to update yoga challenge' });
  }
});

app.delete('/api/admin/yoga-challenges/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const existingChallenge = await YogaChallenge.findByIdAndDelete(req.params.id);

    if (!existingChallenge) {
      return res.status(404).json({ message: 'Yoga challenge not found' });
    }

    removeUploadedFile(existingChallenge.image);
    res.json({ message: 'Yoga challenge deleted successfully' });
  } catch (err) {
    console.error('Error deleting yoga challenge:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to delete yoga challenge' });
  }
});

app.get('/api/workfit-challenges', async (_req, res) => {
  try {
    const challenges = await WorkfitChallenge.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json(challenges.map(sanitizeWorkfitChallenge));
  } catch (err) {
    console.error('Error fetching WorkFit challenges:', err);
    res.status(500).json({ message: 'Failed to fetch WorkFit challenges' });
  }
});

app.get('/api/admin/workfit-challenges', async (req, res) => {
  try {
    requireAdminAccess(req);
    const challenges = await WorkfitChallenge.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json(challenges.map(sanitizeWorkfitChallenge));
  } catch (err) {
    console.error('Error fetching admin WorkFit challenges:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch WorkFit challenges' });
  }
});

app.post('/api/admin/workfit-challenges', upload.single('image'), async (req, res) => {
  let uploadedImage = '';
  try {
    requireAdminAccess(req);
    uploadedImage = await convertUploadToWebp(req.file, 'workfit-challenge');
    const payload = normalizeWorkfitChallengePayload(req.body, uploadedImage);

    if (!payload.slug || !payload.title || !payload.desc || !payload.image || !payload.stat || !payload.statDesc) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(400).json({ message: 'Title, description, image, stat, and stat description are required' });
    }

    const challenge = await WorkfitChallenge.create(payload);
    res.status(201).json({ message: 'WorkFit challenge created successfully', data: sanitizeWorkfitChallenge(challenge) });
  } catch (err) {
    if (uploadedImage) {
      removeUploadedFile(uploadedImage);
    }

    console.error('Error creating WorkFit challenge:', err);
    res.status(500).json({ message: err.code === 11000 ? 'Challenge slug already exists' : 'Failed to create WorkFit challenge' });
  }
});

app.put('/api/admin/workfit-challenges/:id', upload.single('image'), async (req, res) => {
  let uploadedImage = '';
  try {
    requireAdminAccess(req);
    const existingChallenge = await WorkfitChallenge.findById(req.params.id);
    if (!existingChallenge) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(404).json({ message: 'WorkFit challenge not found' });
    }

    uploadedImage = await convertUploadToWebp(req.file, 'workfit-challenge');
    const payload = normalizeWorkfitChallengePayload(req.body, uploadedImage);
    const updatedPayload = {
      ...payload,
      image: payload.image || existingChallenge.image,
    };

    if (!updatedPayload.slug || !updatedPayload.title || !updatedPayload.desc || !updatedPayload.image || !updatedPayload.stat || !updatedPayload.statDesc) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(400).json({ message: 'Title, description, image, stat, and stat description are required' });
    }

    const previousImage = existingChallenge.image;
    Object.assign(existingChallenge, updatedPayload);
    await existingChallenge.save();

    if (uploadedImage && previousImage !== existingChallenge.image) {
      removeUploadedFile(previousImage);
    }

    res.json({ message: 'WorkFit challenge updated successfully', data: sanitizeWorkfitChallenge(existingChallenge) });
  } catch (err) {
    if (uploadedImage) {
      removeUploadedFile(uploadedImage);
    }

    console.error('Error updating WorkFit challenge:', err);
    res.status(500).json({ message: err.code === 11000 ? 'Challenge slug already exists' : 'Failed to update WorkFit challenge' });
  }
});

app.delete('/api/admin/workfit-challenges/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const existingChallenge = await WorkfitChallenge.findByIdAndDelete(req.params.id);

    if (!existingChallenge) {
      return res.status(404).json({ message: 'WorkFit challenge not found' });
    }

    removeUploadedFile(existingChallenge.image);
    res.json({ message: 'WorkFit challenge deleted successfully' });
  } catch (err) {
    console.error('Error deleting WorkFit challenge:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to delete WorkFit challenge' });
  }
});

app.get('/api/playlists', async (_req, res) => {
  try {
    const playlists = await Playlist.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json(playlists.map(sanitizePlaylist));
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ message: 'Failed to fetch playlists' });
  }
});

app.get('/api/admin/playlists', async (req, res) => {
  try {
    requireAdminAccess(req);
    const playlists = await Playlist.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(playlists.map(sanitizePlaylist));
  } catch (err) {
    console.error('Error fetching admin playlists:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch playlists' });
  }
});

app.post('/api/admin/playlists', upload.single('thumbnail'), async (req, res) => {
  let uploadedThumbnail = '';
  try {
    requireAdminAccess(req);
    uploadedThumbnail = await convertUploadToWebp(req.file, 'playlist-thumbnail');
    const payload = normalizePlaylistPayload(req.body, uploadedThumbnail);

    if (!payload.title || !payload.description || !payload.videoUrl || !payload.thumbnail) {
      if (uploadedThumbnail) {
        removeUploadedFile(uploadedThumbnail);
      }

      return res.status(400).json({ message: 'Title, description, video URL, and thumbnail are required' });
    }

    const playlist = await Playlist.create(payload);
    res.status(201).json({ message: 'Playlist created successfully', data: sanitizePlaylist(playlist) });
  } catch (err) {
    if (uploadedThumbnail) {
      removeUploadedFile(uploadedThumbnail);
    }

    console.error('Error creating playlist:', err);
    res.status(500).json({ message: 'Failed to create playlist' });
  }
});

app.put('/api/admin/playlists/:id', upload.single('thumbnail'), async (req, res) => {
  let uploadedThumbnail = '';
  try {
    requireAdminAccess(req);
    const existingPlaylist = await Playlist.findById(req.params.id);
    if (!existingPlaylist) {
      if (uploadedThumbnail) {
        removeUploadedFile(uploadedThumbnail);
      }

      return res.status(404).json({ message: 'Playlist not found' });
    }

    uploadedThumbnail = await convertUploadToWebp(req.file, 'playlist-thumbnail');
    const payload = normalizePlaylistPayload(req.body, uploadedThumbnail);
    const updatedPayload = {
      ...payload,
      thumbnail: payload.thumbnail || existingPlaylist.thumbnail,
    };

    if (!updatedPayload.title || !updatedPayload.description || !updatedPayload.videoUrl || !updatedPayload.thumbnail) {
      if (uploadedThumbnail) {
        removeUploadedFile(uploadedThumbnail);
      }

      return res.status(400).json({ message: 'Title, description, video URL, and thumbnail are required' });
    }

    const previousThumbnail = existingPlaylist.thumbnail;
    Object.assign(existingPlaylist, updatedPayload);
    await existingPlaylist.save();

    if (uploadedThumbnail && previousThumbnail !== existingPlaylist.thumbnail) {
      removeUploadedFile(previousThumbnail);
    }

    res.json({ message: 'Playlist updated successfully', data: sanitizePlaylist(existingPlaylist) });
  } catch (err) {
    if (uploadedThumbnail) {
      removeUploadedFile(uploadedThumbnail);
    }

    console.error('Error updating playlist:', err);
    res.status(500).json({ message: 'Failed to update playlist' });
  }
});

app.delete('/api/admin/playlists/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const existingPlaylist = await Playlist.findByIdAndDelete(req.params.id);

    if (!existingPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    removeUploadedFile(existingPlaylist.thumbnail);
    res.json({ message: 'Playlist deleted successfully' });
  } catch (err) {
    console.error('Error deleting playlist:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to delete playlist' });
  }
});

app.get('/api/gallery', async (_req, res) => {
  try {
    const images = await GalleryImage.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.json(images.map(sanitizeGalleryImage));
  } catch (err) {
    console.error('Error fetching gallery images:', err);
    res.status(500).json({ message: 'Failed to fetch gallery images' });
  }
});

app.get('/api/admin/gallery', async (req, res) => {
  try {
    requireAdminAccess(req);
    const images = await GalleryImage.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(images.map(sanitizeGalleryImage));
  } catch (err) {
    console.error('Error fetching admin gallery:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch gallery images' });
  }
});

app.post('/api/admin/gallery', upload.single('image'), async (req, res) => {
  let uploadedImage = '';
  try {
    requireAdminAccess(req);
    uploadedImage = await convertUploadToWebp(req.file, 'gallery-image');
    const payload = normalizeGalleryImagePayload(req.body, uploadedImage);

    if (!payload.title || !payload.image) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(400).json({ message: 'Title and image are required' });
    }

    const image = await GalleryImage.create(payload);
    res.status(201).json({ message: 'Gallery image created successfully', data: sanitizeGalleryImage(image) });
  } catch (err) {
    if (uploadedImage) {
      removeUploadedFile(uploadedImage);
    }

    console.error('Error creating gallery image:', err);
    res.status(500).json({ message: 'Failed to create gallery image' });
  }
});

app.put('/api/admin/gallery/:id', upload.single('image'), async (req, res) => {
  let uploadedImage = '';
  try {
    requireAdminAccess(req);
    const existingImage = await GalleryImage.findById(req.params.id);
    if (!existingImage) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(404).json({ message: 'Gallery image not found' });
    }

    uploadedImage = await convertUploadToWebp(req.file, 'gallery-image');
    const payload = normalizeGalleryImagePayload(req.body, uploadedImage);
    const updatedPayload = {
      ...payload,
      image: payload.image || existingImage.image,
    };

    if (!updatedPayload.title || !updatedPayload.image) {
      if (uploadedImage) {
        removeUploadedFile(uploadedImage);
      }

      return res.status(400).json({ message: 'Title and image are required' });
    }

    const previousImage = existingImage.image;
    Object.assign(existingImage, updatedPayload);
    await existingImage.save();

    if (uploadedImage && previousImage !== existingImage.image) {
      removeUploadedFile(previousImage);
    }

    res.json({ message: 'Gallery image updated successfully', data: sanitizeGalleryImage(existingImage) });
  } catch (err) {
    if (uploadedImage) {
      removeUploadedFile(uploadedImage);
    }

    console.error('Error updating gallery image:', err);
    res.status(500).json({ message: 'Failed to update gallery image' });
  }
});

app.delete('/api/admin/gallery/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const existingImage = await GalleryImage.findByIdAndDelete(req.params.id);

    if (!existingImage) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    removeUploadedFile(existingImage.image);
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (err) {
    console.error('Error deleting gallery image:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to delete gallery image' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    requireAdminAccess(req);
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);
    const search = String(req.query.search || '').trim();
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      users: users.map(sanitizeUser),
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (err) {
    console.error('Error fetching admin users:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch users' });
  }
});

app.put('/api/admin/users/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').trim();
    const role = req.body.role === 'workfit' || req.body.role === 'admin' ? req.body.role : 'livefit';

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists on another account' });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.role = role;
    user.focusAreas = parseBenefits(req.body.focusAreas);

    if (req.body.password) {
      if (String(req.body.password).length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(String(req.body.password), salt);
    }

    await user.save();
    res.json({ message: 'User updated successfully', data: sanitizeUser(user) });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to update user' });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const existingUser = await User.findByIdAndDelete(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to delete user' });
  }
});

app.get('/api/admin/paid-users', async (req, res) => {
  try {
    requireAdminAccess(req);
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);
    const search = String(req.query.search || '').trim();
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { role: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);
    const emails = users.map((user) => String(user.email || '').trim().toLowerCase()).filter(Boolean);
    const payments = await Payment.find({ status: 'paid', 'customer.email': { $in: emails } }).sort({ paidAt: -1, createdAt: -1 });
    const paymentsByEmail = payments.reduce((acc, payment) => {
      const email = String(payment.customer?.email || '').trim().toLowerCase();
      if (!acc[email]) {
        acc[email] = [];
      }
      acc[email].push(payment);
      return acc;
    }, {});

    res.json({
      users: users.map((user) => sanitizePaidUser(user, paymentsByEmail[String(user.email || '').trim().toLowerCase()] || [])),
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (err) {
    console.error('Error fetching paid users:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch paid users' });
  }
});

app.put('/api/admin/paid-users/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const status = req.body.status === 'paid' ? 'paid' : 'free';
    const product = req.body.product === 'workfit' ? 'workfit' : 'livefit';
    const planId = String(req.body.planId || '').trim();
    const planName = String(req.body.planName || '').trim();
    const expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;

    if (status === 'paid' && !planName) {
      return res.status(400).json({ message: 'Plan name is required for paid access' });
    }

    user.membership = {
      isManualOverride: true,
      status,
      product,
      planId: status === 'paid' ? (planId || createSlug(planName) || 'admin-assigned') : '',
      planName: status === 'paid' ? planName : 'Free Access',
      expiresAt: status === 'paid' ? expiresAt : null,
      updatedAt: new Date(),
    };

    await user.save();
    const payments = await Payment.find({ status: 'paid', 'customer.email': user.email }).sort({ paidAt: -1, createdAt: -1 });
    res.json({ message: 'Paid access updated successfully', data: sanitizePaidUser(user, payments) });
  } catch (err) {
    console.error('Error updating paid user:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to update paid user' });
  }
});

app.get('/api/packages', async (_req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json(packages.map(sanitizePackage));
  } catch (err) {
    console.error('Error fetching packages:', err);
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
});

app.get('/api/admin/packages', async (req, res) => {
  try {
    requireAdminAccess(req);
    const packages = await Package.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json(packages.map(sanitizePackage));
  } catch (err) {
    console.error('Error fetching admin packages:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch packages' });
  }
});

app.post('/api/admin/packages', async (req, res) => {
  try {
    requireAdminAccess(req);
    const payload = normalizePackagePayload(req.body);

    if (!payload.slug || !payload.name || !payload.priceLabel || !payload.currency || payload.features.length === 0) {
      return res.status(400).json({ message: 'Name, price label, currency, and at least one feature are required' });
    }

    if (payload.checkoutType === 'razorpay' && payload.amount <= 0) {
      return res.status(400).json({ message: 'Razorpay packages must have an amount greater than 0' });
    }

    const plan = await Package.create(payload);
    res.status(201).json({ message: 'Package created successfully', data: sanitizePackage(plan) });
  } catch (err) {
    console.error('Error creating package:', err);
    res.status(500).json({ message: err.code === 11000 ? 'Package slug already exists' : 'Failed to create package' });
  }
});

app.put('/api/admin/packages/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const plan = await Package.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const payload = normalizePackagePayload(req.body);
    if (!payload.slug || !payload.name || !payload.priceLabel || !payload.currency || payload.features.length === 0) {
      return res.status(400).json({ message: 'Name, price label, currency, and at least one feature are required' });
    }

    if (payload.checkoutType === 'razorpay' && payload.amount <= 0) {
      return res.status(400).json({ message: 'Razorpay packages must have an amount greater than 0' });
    }

    Object.assign(plan, payload);
    await plan.save();
    res.json({ message: 'Package updated successfully', data: sanitizePackage(plan) });
  } catch (err) {
    console.error('Error updating package:', err);
    res.status(500).json({ message: err.code === 11000 ? 'Package slug already exists' : 'Failed to update package' });
  }
});

app.delete('/api/admin/packages/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const plan = await Package.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json({ message: 'Package deleted successfully' });
  } catch (err) {
    console.error('Error deleting package:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to delete package' });
  }
});

app.get('/api/chat/thread', async (req, res) => {
  try {
    const user = await getOptionalAuthenticatedUser(req);
    const thread = await findOrCreateChatThread({
      user,
      name: req.query.name,
      email: req.query.email,
      phone: req.query.phone,
    });

    await thread.save();
    res.json(sanitizeChatThread(thread));
  } catch (err) {
    console.error('Error fetching chat thread:', err);
    res.status(500).json({ message: 'Failed to load chat' });
  }
});

app.post('/api/chat/messages', async (req, res) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await getOptionalAuthenticatedUser(req);
    const thread = await findOrCreateChatThread({
      user,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });

    const isFirstUserMessage = thread.messages.length === 0;
    thread.messages.push({ sender: 'user', text, createdAt: new Date() });
    thread.lastMessageAt = new Date();
    thread.status = 'open';

    const settings = await getChatSettings();
    if (isFirstUserMessage && settings.autoReplyEnabled && settings.autoReplyMessage) {
      thread.messages.push({ sender: 'system', text: String(settings.autoReplyMessage), createdAt: new Date() });
    }

    await thread.save();
    res.status(201).json(sanitizeChatThread(thread));
  } catch (err) {
    console.error('Error sending chat message:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

app.get('/api/admin/chats', async (req, res) => {
  try {
    requireAdminAccess(req);
    const threads = await ChatThread.find().sort({ lastMessageAt: -1, updatedAt: -1 }).limit(100);
    res.json(threads.map(sanitizeChatThread));
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch chats' });
  }
});

app.get('/api/admin/chats/:id', async (req, res) => {
  try {
    requireAdminAccess(req);
    const thread = await ChatThread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.json(sanitizeChatThread(thread));
  } catch (err) {
    console.error('Error fetching chat:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch chat' });
  }
});

app.post('/api/admin/chats/:id/messages', async (req, res) => {
  try {
    requireAdminAccess(req);
    const text = String(req.body.text || '').trim();
    if (!text) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const thread = await ChatThread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    thread.messages.push({ sender: 'admin', text, createdAt: new Date() });
    thread.lastMessageAt = new Date();
    thread.status = 'open';
    await thread.save();
    res.status(201).json(sanitizeChatThread(thread));
  } catch (err) {
    console.error('Error replying to chat:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to reply to chat' });
  }
});

app.get('/api/admin/chat-settings', async (req, res) => {
  try {
    requireAdminAccess(req);
    res.json(await getChatSettings());
  } catch (err) {
    console.error('Error fetching chat settings:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to fetch chat settings' });
  }
});

app.put('/api/admin/chat-settings', async (req, res) => {
  try {
    requireAdminAccess(req);
    const data = {
      autoReplyEnabled: normalizeBoolean(req.body.autoReplyEnabled, true),
      autoReplyMessage: String(req.body.autoReplyMessage || '').trim() || 'Thanks for reaching out. A wellness expert will reply shortly.',
    };

    const settings = await Content.findOneAndUpdate(
      { page: 'chat-settings' },
      { data, updatedAt: new Date() },
      { returnDocument: 'after', upsert: true }
    );

    res.json({ message: 'Chat settings updated successfully', data: settings.data });
  } catch (err) {
    console.error('Error updating chat settings:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to update chat settings' });
  }
});

// Payment Routes
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { planId, customer, product = 'livefit' } = req.body;
    const plan = await getPlanById(product, planId);

    if (!plan || plan.checkoutType === 'whatsapp') {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    let planAmount = plan.amount;
    const planCurrency = plan.currency || 'INR';

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ message: 'Customer name, email, and phone are required' });
    }

    const receiptPrefix = product === 'workfit' ? 'workfit' : 'livefit';
    const receipt = `${receiptPrefix}_${planId}_${Date.now()}`;
    const order = await createRazorpayOrder({
      amount: Math.round(planAmount * 100),
      currency: planCurrency,
      receipt,
      payment_capture: 1,
      notes: {
        product,
        planId: plan.id,
        planName: plan.name,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
      },
    });

    res.json({
      keyId: RAZORPAY_KEY_ID,
      product,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      plan: {
        id: plan.id,
        name: plan.name,
        amount: planAmount,
        currency: planCurrency,
      },
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      customer,
      receipt,
      product = 'livefit',
    } = req.body;

    const plan = await getPlanById(product, planId);
    if (!plan || plan.checkoutType === 'whatsapp') {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const paymentRecord = await Payment.findOneAndUpdate(
      { razorpayPaymentId: razorpay_payment_id },
      {
        product,
        planId: plan.id,
        planName: plan.name,
        amount: plan.amount,
        currency: plan.currency || 'INR',
        customer: {
          name: customer?.name || 'Customer',
          email: customer?.email || '',
          phone: customer?.phone || '',
        },
        receipt: receipt || razorpay_order_id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        paidAt: new Date(),
        expiresAt: calculatePlanExpiry(plan),
      },
      {
        upsert: true,
        returnDocument: 'after',
        setDefaultsOnInsert: true,
      }
    );

    await sendPaymentNotifications(paymentRecord);

    res.json({
      message: 'Payment verified successfully',
      payment: {
        product: paymentRecord.product,
        planId: paymentRecord.planId,
        planName: paymentRecord.planName,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency,
        customer: paymentRecord.customer,
        receipt: paymentRecord.receipt,
        razorpayOrderId: paymentRecord.razorpayOrderId,
        razorpayPaymentId: paymentRecord.razorpayPaymentId,
        status: paymentRecord.status,
        paidAt: paymentRecord.paidAt,
        expiresAt: paymentRecord.expiresAt,
      },
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

app.get('/api/payment/access-status', async (req, res) => {
  try {
    const { email, product = 'livefit' } = req.query;
    const normalizedEmail = email ? String(email).trim().toLowerCase() : '';

    if (!normalizedEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (user?.membership?.isManualOverride && user.membership.product === product) {
      const manualMembership = buildManualMembershipRecord(user, product);
      if (!manualMembership) {
        return res.json({ hasAccess: false });
      }

      return res.json({
        hasAccess: true,
        payment: {
          product: manualMembership.product,
          planId: manualMembership.planId,
          planName: manualMembership.planName,
          amount: manualMembership.amount,
          currency: manualMembership.currency,
          customer: {
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
          receipt: manualMembership.receipt,
          paidAt: manualMembership.paidAt,
          expiresAt: manualMembership.expiresAt,
          source: manualMembership.source,
        },
      });
    }

    const payment = await Payment.findOne({
      product,
      status: 'paid',
      'customer.email': normalizedEmail,
    }).sort({ paidAt: -1, createdAt: -1 });

    if (!payment || !isFutureOrOpenDate(payment.expiresAt)) {
      return res.json({ hasAccess: false });
    }

    res.json({
      hasAccess: true,
      payment: {
        product: payment.product,
        planId: payment.planId,
        planName: payment.planName,
        amount: payment.amount,
        currency: payment.currency,
        customer: payment.customer,
        receipt: payment.receipt,
        paidAt: payment.paidAt,
        expiresAt: payment.expiresAt,
      },
    });
  } catch (err) {
    console.error('Access status error:', err);
    res.status(500).json({ message: 'Failed to check access status' });
  }
});

app.post('/api/contact/inquiry', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body;
    const productLabel = String(source || '').toLowerCase().includes('workfit') ? 'WorkFit' : 'LiveFit';

    const userMailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: `Inquiry Received - ${productLabel}`,
      text: `Hi ${name},\n\nYour inquiry request has been sent successfully!\n\nDetails provided:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\n\nOur team will review your request and get back to you shortly.\n\nBest regards,\n${productLabel} Team`,
    };

    const adminMailOptions = {
      from: EMAIL_FROM,
      to: INQUIRY_TO_EMAIL,
      subject: `New Inquiry - ${productLabel}`,
      text: `A new ${productLabel} inquiry has been submitted.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: 'Inquiry sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send inquiry' });
  }
});

app.post('/api/contact/schedule', async (req, res) => {
  try {
    const { inquiryFor, timezone, time, email, phone, message } = req.body;

    const userMailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Schedule Request Received - LiveFit',
      text: `Hi,\n\nYour schedule/booking request has been sent successfully!\n\nDetails provided:\nInquiry For: ${inquiryFor}\nTimezone: ${timezone}\nPreferred Time: ${time}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage: ${message}\n\nWe will contact you within 24 hours to confirm your session details.\n\nBest regards,\nLiveFit Team`,
    };

    const adminMailOptions = {
      from: EMAIL_FROM,
      to: INQUIRY_TO_EMAIL,
      subject: 'New Schedule Request - LiveFit',
      text: `A new schedule request has been submitted.\n\nInquiry For: ${inquiryFor}\nTimezone: ${timezone}\nPreferred Time: ${time}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage: ${message}`,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: 'Schedule request sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send schedule request' });
  }
});
// Content Management API Routes
app.get('/api/content/:page', async (req, res) => {
  try {
    const { page } = req.params;
    let content = await Content.findOne({ page });
    
    // If not found in database, seed default values and return them
    if (!content) {
      let defaultData = {};
      if (page === 'home') {
        defaultData = {
          heroTitle: 'Yoga For Corporate Wellness & Personal Health',
          heroSubtitle: 'Elevate Mind, Body & Focus',
          heroDescription: 'Transforming corporate productivity and personal lifestyle with evidence-based yoga practices, habit coaching, and active restoration.',
          heroImage: '/images/globall.webp',
          whyUsTitle: 'Why Choose LiveFit',
          whyUsText: 'We bridge the gap between traditional yoga wisdom and modern lifestyle needs, focusing on ergonomic alignment, stress mitigation, and sustainable habits.',
          ourStoryTitle: 'Our Story & Philosophy',
          ourStoryText: 'Founded with a single mission: to make wellness accessible, engaging, and transformational. We integrate clinical insights, expert guidance, and custom challenges to support teams globally.',
          ourStoryImage: '/images/flowerlogo2.webp'
        };
      } else if (page === 'solutions') {
        defaultData = {
          'low-employee-engagement': {
            title: 'Low Employee Engagement',
            problem: 'Disconnected teams lead to low morale, low participation, and weak culture.',
            image: '/images/Wc4.webp'
          },
          'hybrid-work-challenges': {
            title: 'Hybrid Work Challenges',
            problem: 'Remote & hybrid teams struggle with wellness, connection and routines.',
            image: '/images/Wc6.webp'
          },
          'high-healthcare-costs': {
            title: 'High Healthcare Costs',
            problem: 'Lifestyle issues lead to rising healthcare costs and sick leaves.',
            image: '/images/Wc7.webp'
          },
          'boring-wellness-programs': {
            title: 'Boring Wellness Programs',
            problem: 'Generic wellness programs fail to engage employees and deliver results.',
            image: '/images/Wc8.webp'
          }
        };
      } else if (page === 'testimonials') {
        defaultData = [
          {
            id: '1',
            author: 'Sarah Jenkins',
            role: 'VP of HR',
            company: 'TechCorp',
            text: 'LiveFit completely transformed our team dynamic. Burnout dropped by 40% and our remote employees feel connected again.',
            rating: 5,
            avatar: '/images/office2.webp'
          },
          {
            id: '2',
            author: 'David Chen',
            role: 'Operations Director',
            company: 'Innovate Solutions',
            text: 'The hybrid challenges got everyone moving! Simple, engaging, and incredibly positive for company culture.',
            rating: 5,
            avatar: '/images/office3.webp'
          },
          {
            id: '3',
            author: 'Amara Okafor',
            role: 'People Lead',
            company: 'Global Design',
            text: 'Highly professional instructors, seamless scheduling, and beautiful sessions that everyone looks forward to weekly.',
            rating: 5,
            avatar: '/images/office4.webp'
          }
        ];
      } else if (page === 'plans') {
        defaultData = {
          monthly: {
            price: 29,
            description: 'Live online sessions, Video library access, Community support, Mobile app access'
          },
          yearly: {
            price: 300,
            description: 'Everything in Monthly, Best yearly value, Continuity support, Full LiveFit access'
          }
        };
      } else if (page === 'yoga-programs-section') {
        defaultData = yogaProgramsSection;
      } else if (page === 'yoga-challenges-section') {
        defaultData = yogaChallengesSection;
      } else {
        defaultData = {
          title: 'Dynamic Page',
          description: 'Initial seeded description for page content.'
        };
      }
      
      content = new Content({ page, data: defaultData });
      await content.save();
    }
    
    res.json(content.data);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

app.put('/api/content/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const { data } = req.body;

    requireAdminAccess(req);
    
    const updatedContent = await Content.findOneAndUpdate(
      { page },
      { data, updatedAt: new Date() },
      { returnDocument: 'after', upsert: true }
    );
    
    res.json({ message: 'Content updated successfully', data: updatedContent.data });
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(err.statusCode || 500).json({ message: err.message || 'Failed to update content' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

