import { FirebaseError } from "firebase/app";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  type Auth,
} from "firebase/auth";
import type { Locale } from "@/constants/app";
import { getDictionary } from "@/i18n";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

export function getFirebaseAuthErrorMessage(error: unknown, locale: Locale = "vi"): string {
  const errors = getDictionary(locale).auth.errors;
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return errors.invalidEmail;
      case "auth/user-disabled":
        return errors.userDisabled;
      case "auth/user-not-found":
        return errors.userNotFound;
      case "auth/wrong-password":
        return errors.wrongPassword;
      case "auth/invalid-credential":
        return errors.invalidCredential;
      case "auth/email-already-in-use":
        return errors.emailInUse;
      case "auth/weak-password":
        return errors.weakPassword;
      case "auth/popup-closed-by-user":
        return errors.popupClosed;
      case "auth/popup-blocked":
        return errors.popupBlocked;
      case "auth/operation-not-allowed":
        return errors.operationNotAllowed;
      case "auth/too-many-requests":
        return errors.tooManyRequests;
      default:
        return error.message || errors.default;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return errors.default;
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getFirebaseAuth(), provider);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(getFirebaseAuth(), email);
}

export async function logout() {
  return signOut(getFirebaseAuth());
}
