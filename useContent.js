import { useState, useEffect } from "react";
import { getAll } from "./firebase.js";

// Each hook fetches the Firestore collection and falls back to the
// static data already defined in each page if Firebase isn't set up yet.

function useCollection(col, fallback = []) {
  const [data,    setData]    = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAll(col)
      .then((rows) => { if (rows.length > 0) setData(rows); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [col]);

  return { data, loading };
}

export const useGalleryItems  = (fallback) => useCollection("gallery",  fallback);
export const useEventsData    = (fallback) => useCollection("events",   fallback);
export const useSermonsData   = (fallback) => useCollection("sermons",  fallback);
export const useBlogData      = (fallback) => useCollection("blogs",    fallback);
