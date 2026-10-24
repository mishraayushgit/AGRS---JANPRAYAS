import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  getDocFromServer,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with configured database ID
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot per Firebase Skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore client is offline or initializing.");
    }
  }
}
testConnection();

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({ prompt: "select_account" });

export const appleProvider = new OAuthProvider("apple.com");

export interface FirestoreUserProfile {
  uid: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: "citizen" | "officer" | "admin";
  ward?: string;
  department?: string;
  provider: "password" | "google.com" | "microsoft.com" | "apple.com" | "demo";
  photoURL?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Recursively strips undefined fields from an object to prevent Firestore errors
 */
export function sanitizeFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = sanitizeFirestoreData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Save or update user profile document in Firestore
 */
export async function syncUserProfileToFirestore(
  profile: FirestoreUserProfile
): Promise<void> {
  try {
    const userRef = doc(db, "users", profile.uid);
    const cleanedData = sanitizeFirestoreData({
      ...profile,
      photoURL: profile.photoURL || null,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(userRef, cleanedData, { merge: true });
  } catch (err) {
    console.error("Failed to sync profile to Firestore:", err);
  }
}

/**
 * Fetch user profile from Firestore by UID
 */
export async function fetchUserProfileFromFirestore(
  uid: string
): Promise<FirestoreUserProfile | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserProfile;
    }
  } catch (err) {
    console.error("Error fetching Firestore profile:", err);
  }
  return null;
}
