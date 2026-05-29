/**
 * AppRouter — single file where every route in the app is defined.
 * Import a new page here and add a <Route> to register it.
 */
import { Routes, Route } from "react-router-dom";
import { HomePage }  from "./church.jsx";
import AboutPage     from "./AboutPage.jsx";
import GalleryPage   from "./GalleryPage.jsx";
import SermonsPage   from "./SermonsPage.jsx";
import EventsPage    from "./EventsPage.jsx";
import ContactPage   from "./ContactPage.jsx";
import AdminApp      from "./AdminApp.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/"         element={<HomePage />} />
      <Route path="/about"    element={<AboutPage />} />
      <Route path="/gallery"  element={<GalleryPage />} />
      <Route path="/sermons"  element={<SermonsPage />} />
      <Route path="/events"   element={<EventsPage />} />
      <Route path="/contact"  element={<ContactPage />} />
      <Route path="/admin/*"  element={<AdminApp />} />
    </Routes>
  );
}
