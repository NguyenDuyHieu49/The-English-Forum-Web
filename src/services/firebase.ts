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

export function getFirebaseAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Email không hợp lệ.";
      case "auth/user-disabled":
        return "Tài khoản đã bị vô hiệu hóa.";
      case "auth/user-not-found":
        return "Không tìm thấy tài khoản với email này.";
      case "auth/wrong-password":
        return "Mật khẩu không đúng.";
      case "auth/invalid-credential":
        return "Email hoặc mật khẩu không đúng.";
      case "auth/email-already-in-use":
        return "Email đã được đăng ký.";
      case "auth/weak-password":
        return "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
      case "auth/popup-closed-by-user":
        return "Đã hủy đăng nhập Google.";
      case "auth/popup-blocked":
        return "Trình duyệt chặn popup. Hãy cho phép popup cho localhost.";
      case "auth/operation-not-allowed":
        return "Phương thức đăng nhập chưa được bật trong Firebase Console.";
      case "auth/too-many-requests":
        return "Quá nhiều lần thử. Vui lòng thử lại sau.";
      default:
        return error.message || "Đăng nhập thất bại.";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Đăng nhập thất bại.";
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
