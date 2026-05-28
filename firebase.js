import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, orderBy, serverTimestamp, onSnapshot,
} from "firebase/firestore";

const cfg = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(cfg);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ─── Auth helpers ────────────────────────────────────────────────────────────
export const login  = (email, pw) => signInWithEmailAndPassword(auth, email, pw);
export const logout = ()          => signOut(auth);
export const onAuth = (cb)        => onAuthStateChanged(auth, cb);

// ─── Firestore CRUD ──────────────────────────────────────────────────────────
export const COLS = {
  gallery:   "gallery",
  events:    "events",
  sermons:   "sermons",
  blogs:     "blogs",
};

export async function getAll(col) {
  try {
    const q    = query(collection(db, col), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export const addItem    = (col, data)     => addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
export const updateItem = (col, id, data) => updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });
export const deleteItem = (col, id)       => deleteDoc(doc(db, col, id));

export function subscribe(col, cb) {
  const q = query(collection(db, col), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}
