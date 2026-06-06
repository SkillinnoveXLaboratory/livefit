import { initializeApp } from 'firebase/app';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const firebaseAuth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const createFirebaseUser = async (name: string, email: string, password: string) => {
  if (!firebaseAuth) {
    throw new Error('Firebase is not configured');
  }

  const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await updateProfile(credentials.user, { displayName: name });
  return credentials.user;
};

export const signInFirebaseUser = async (email: string, password: string) => {
  if (!firebaseAuth) {
    throw new Error('Firebase is not configured');
  }

  const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
  await credentials.user.reload();
  return credentials.user;
};

export const signInWithGoogle = async () => {
  if (!firebaseAuth) {
    throw new Error('Firebase is not configured');
  }

  const credentials = await signInWithPopup(firebaseAuth, googleProvider);
  return credentials.user;
};

export const linkGoogleUserWithPassword = async (email: string, password: string) => {
  if (!firebaseAuth?.currentUser) {
    throw new Error('Google account is not signed in');
  }

  const trimmedEmail = String(email || '').trim();
  const trimmedPassword = String(password || '').trim();

  if (!trimmedEmail || !trimmedPassword) {
    throw new Error('Email and password are required');
  }

  const credential = EmailAuthProvider.credential(trimmedEmail, trimmedPassword);
  const response = await linkWithCredential(firebaseAuth.currentUser, credential);
  return response.user;
};

export const signOutFirebaseUser = async () => {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
  }
};
