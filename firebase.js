import { initializeApp, getApps } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, setDoc, query, orderBy, serverTimestamp, onSnapshot,
} from "firebase/firestore";

// ─── Guard: only initialise when all required env vars are present ────────────
const cfg = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Object.values(cfg).every(Boolean);

let app, auth, db;

if (isConfigured) {
  // Avoid double-initialisation during hot-module reloads
  app  = getApps().length ? getApps()[0] : initializeApp(cfg);
  auth = getAuth(app);
  db   = getFirestore(app);
} else {
  // Provide dummy stubs so the rest of the app doesn't crash while
  // the .env file is being set up.
  auth = null;
  db   = null;
  if (import.meta.env.DEV) {
    console.warn(
      "[firebase.js] Firebase not configured — add your keys to .env.local\n" +
      "Missing:", Object.entries(cfg).filter(([,v]) => !v).map(([k]) => k).join(", ")
    );
  }
}

export { auth, db };

// ─── Auth helpers ────────────────────────────────────────────────────────────
export const login  = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
export const logout = ()          => signOut(auth);
export const onAuth = (cb) => {
  if (!auth) { cb(null); return () => {}; }
  return onAuthStateChanged(auth, cb);
};

// ─── Firestore CRUD ──────────────────────────────────────────────────────────
export const COLS = {
  gallery: "gallery",
  events:  "events",
  sermons: "sermons",
  blogs:   "blogs",
};

export async function getAll(col) {
  if (!db) return [];
  try {
    const q    = query(collection(db, col), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export const addItem = (col, data) => {
  if (!db) return Promise.reject(new Error("Firebase not configured"));
  return addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
};

export const updateItem = (col, id, data) => {
  if (!db) return Promise.reject(new Error("Firebase not configured"));
  return updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteItem = (col, id) => {
  if (!db) return Promise.reject(new Error("Firebase not configured"));
  return deleteDoc(doc(db, col, id));
};

// ─── Settings (key-value documents) ─────────────────────────────────────────
export function subscribeSetting(key, cb) {
  if (!db) { cb(null); return () => {}; }
  return onSnapshot(doc(db, "settings", key), (snap) => cb(snap.exists() ? snap.data() : null));
}

export function setSetting(key, data) {
  if (!db) return Promise.reject(new Error("Firebase not configured"));
  return setDoc(doc(db, "settings", key), data, { merge: true });
}

export function subscribe(col, cb) {
  if (!db) { cb([]); return () => {}; }
  const q = query(collection(db, col), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}
