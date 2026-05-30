/**
 * AppRouter — single file where every route in the app is defined.
 * Import a new page here and add a <Route> to register it.
 */
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage }  from "./church.jsx";
import AboutPage     from "./AboutPage.jsx";
import GalleryPage   from "./GalleryPage.jsx";
import SermonsPage   from "./SermonsPage.jsx";
import EventsPage    from "./EventsPage.jsx";
import ContactPage   from "./ContactPage.jsx";
import BlogPage    from "./BlogPage.jsx";
import AdminApp, {
  Guard,
  AdminLogin,
  AdminDashboard,
  AdminGallery,
  AdminEvents,
  AdminSermons,
  AdminBlog,
} from "./AdminApp.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/"        element={<HomePage />} />
      <Route path="/about"   element={<AboutPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/sermons" element={<SermonsPage />} />
      <Route path="/events"  element={<EventsPage />} />
      <Route path="/contact"  element={<ContactPage />} />
      <Route path="/blog/:id" element={<BlogPage />} />

      {/* ── Admin routes ── */}
      <Route path="/admin" element={<AdminApp />}>
        <Route index                element={<Navigate to="/admin/login" replace />} />
        <Route path="login"         element={<AdminLogin />} />
        <Route path="dashboard"     element={<Guard><AdminDashboard /></Guard>} />
        <Route path="gallery"       element={<Guard><AdminGallery /></Guard>} />
        <Route path="events"        element={<Guard><AdminEvents /></Guard>} />
        <Route path="sermons"       element={<Guard><AdminSermons /></Guard>} />
        <Route path="blog"          element={<Guard><AdminBlog /></Guard>} />
        <Route path="*"             element={<Navigate to="/admin/login" replace />} />
      </Route>
    </Routes>
  );
}
