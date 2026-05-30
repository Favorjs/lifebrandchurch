import { useState, useEffect, useContext, createContext, useRef } from "react";
import { Route, NavLink, Navigate, useNavigate, Outlet } from "react-router-dom";
import { auth, db, login, logout, onAuth, addItem, updateItem, deleteItem, subscribe, subscribeSetting, setSetting, COLS } from "./firebase.js";
import { uploadFile } from "./cloudinaryUpload.js";

// ─── Auth context ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
function useAdmin() { return useContext(AuthCtx); }

function AuthProvider({ children }) {
  const [user, setUser]     = useState(undefined); // undefined = loading
  useEffect(() => onAuth(setUser), []);
  return <AuthCtx.Provider value={user}>{children}</AuthCtx.Provider>;
}

export function Guard({ children }) {
  const user = useAdmin();
  if (user === undefined) return <AdminSpinner />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

// ─── Admin CSS ────────────────────────────────────────────────────────────────
const ADMIN_CSS = `
  .ar * { box-sizing: border-box; margin: 0; padding: 0; }
  .ar { font-family: 'Inter', 'DM Sans', system-ui, sans-serif; display: flex; min-height: 100vh; background: #f1f5f9; }

  /* Sidebar */
  .ar-side { width: 240px; background: #0f172a; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; z-index: 50; }
  .ar-logo { padding: 24px 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .ar-logo img { height: 36px; object-fit: contain; }
  .ar-logo-name { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-top: 4px; letter-spacing: 0.08em; }
  .ar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .ar-link { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 6px; color: rgba(255,255,255,0.55); font-size: 0.85rem; font-weight: 500; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
  .ar-link:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
  .ar-link.active, .ar-link[data-active="true"] { background: rgba(229,69,43,0.15); color: #ff6b4a; border-left: 2px solid #e5452b; }
  .ar-link svg { flex-shrink: 0; }
  .ar-section-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.25); padding: 12px 12px 4px; margin-top: 8px; }
  .ar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); }
  .ar-user-email { font-size: 0.72rem; color: rgba(255,255,255,0.35); margin-bottom: 10px; padding: 0 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ar-logout { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 6px; color: rgba(255,100,80,0.8); font-size: 0.82rem; cursor: pointer; border: none; background: rgba(229,69,43,0.1); width: 100%; transition: all 0.2s; }
  .ar-logout:hover { background: rgba(229,69,43,0.2); color: #ff6b4a; }

  /* Main */
  .ar-main { flex: 1; margin-left: 240px; display: flex; flex-direction: column; min-height: 100vh; }
  .ar-topbar { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 28px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 40; }
  .ar-page-title { font-size: 1.05rem; font-weight: 600; color: #0f172a; }
  .ar-content { padding: 28px; flex: 1; }

  /* Cards */
  .ar-card { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; }
  .ar-card-header { padding: 18px 22px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
  .ar-card-title { font-size: 0.95rem; font-weight: 600; color: #1e293b; }
  .ar-card-body { padding: 22px; }

  /* Stat cards */
  .ar-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .ar-stat { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 20px; }
  .ar-stat-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 8px; }
  .ar-stat-value { font-size: 1.8rem; font-weight: 700; color: #0f172a; }
  .ar-stat-sub { font-size: 0.75rem; color: #94a3b8; margin-top: 4px; }

  /* Buttons */
  .ar-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 6px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; font-family: inherit; }
  .ar-btn-primary { background: #e5452b; color: #fff; }
  .ar-btn-primary:hover { background: #c73d26; }
  .ar-btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
  .ar-btn-secondary:hover { background: #e2e8f0; }
  .ar-btn-danger { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .ar-btn-danger:hover { background: #fee2e2; }
  .ar-btn-sm { padding: 5px 11px; font-size: 0.76rem; }
  .ar-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Table */
  .ar-table { width: 100%; border-collapse: collapse; }
  .ar-table th { padding: 10px 14px; text-align: left; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
  .ar-table td { padding: 13px 14px; font-size: 0.85rem; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
  .ar-table tr:hover td { background: #f8fafc; }
  .ar-table img { width: 48px; height: 36px; object-fit: cover; border-radius: 4px; }

  /* Form */
  .ar-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ar-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .ar-label { font-size: 0.76rem; font-weight: 600; color: #475569; letter-spacing: 0.04em; }
  .ar-input { padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.88rem; color: #1e293b; font-family: inherit; outline: none; transition: border-color 0.2s; width: 100%; background: #fff; }
  .ar-input:focus { border-color: #e5452b; box-shadow: 0 0 0 3px rgba(229,69,43,0.1); }
  .ar-textarea { min-height: 120px; resize: vertical; }
  .ar-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px; }
  .ar-checkbox-row { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .ar-checkbox-row input { width: 16px; height: 16px; accent-color: #e5452b; cursor: pointer; }

  /* Upload zone */
  .ar-upload-zone { border: 2px dashed #e2e8f0; border-radius: 8px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: #f8fafc; }
  .ar-upload-zone:hover, .ar-upload-zone.drag { border-color: #e5452b; background: #fff5f3; }
  .ar-upload-zone-icon { font-size: 2rem; margin-bottom: 10px; }
  .ar-upload-zone-text { font-size: 0.85rem; color: #64748b; }
  .ar-upload-zone-sub { font-size: 0.75rem; color: #94a3b8; margin-top: 4px; }
  .ar-progress { height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin-top: 10px; }
  .ar-progress-bar { height: 100%; background: linear-gradient(to right, #00468c, #e5452b); transition: width 0.3s; }

  /* Gallery grid */
  .ar-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
  .ar-gallery-item { position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 4/3; }
  .ar-gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ar-gallery-item-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .ar-gallery-item:hover .ar-gallery-item-overlay { opacity: 1; }
  .ar-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
  .ar-badge-blue { background: #dbeafe; color: #1d4ed8; }
  .ar-badge-red { background: #fee2e2; color: #dc2626; }
  .ar-badge-green { background: #dcfce7; color: #16a34a; }
  .ar-badge-yellow { background: #fef9c3; color: #ca8a04; }

  /* Modal */
  .ar-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.6); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .ar-modal { background: #fff; border-radius: 12px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
  .ar-modal-header { padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; }
  .ar-modal-title { font-size: 1rem; font-weight: 600; color: #0f172a; }
  .ar-modal-close { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 1.4rem; line-height: 1; padding: 2px; }
  .ar-modal-close:hover { color: #e5452b; }
  .ar-modal-body { padding: 24px; }
  .ar-modal-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }

  /* Alert */
  .ar-alert { padding: 12px 16px; border-radius: 6px; font-size: 0.84rem; margin-bottom: 16px; }
  .ar-alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .ar-alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

  /* Custom dialog (replaces window.alert / window.confirm) */
  .ar-dialog-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.65); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .ar-dialog { background: #fff; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 24px 64px rgba(0,0,0,0.3); overflow: hidden; animation: ar-dialog-in 0.18s cubic-bezier(.22,1,.36,1); }
  @keyframes ar-dialog-in { from { opacity: 0; transform: scale(0.93) translateY(12px); } to { opacity: 1; transform: none; } }
  .ar-dialog-header { padding: 18px 22px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; }
  .ar-dialog-title { font-size: 0.98rem; font-weight: 600; color: #0f172a; }
  .ar-dialog-close { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 1.4rem; line-height: 1; padding: 2px 4px; border-radius: 4px; }
  .ar-dialog-close:hover { color: #e5452b; background: #fef2f2; }
  .ar-dialog-body { padding: 22px 24px; }
  .ar-dialog-icon { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .ar-dialog-icon-danger { background: #fef2f2; }
  .ar-dialog-icon-warn   { background: #fffbeb; }
  .ar-dialog-icon-info   { background: #eff6ff; }
  .ar-dialog-msg { font-size: 0.9rem; color: #475569; line-height: 1.65; margin: 0; }
  .ar-dialog-footer { padding: 14px 22px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }

  /* Login */
  .ar-login-wrap { min-height: 100vh; background: #0f172a; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .ar-login-box { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 40px; width: 100%; max-width: 380px; }
  .ar-login-logo { text-align: center; margin-bottom: 28px; }
  .ar-login-title { font-size: 1.1rem; font-weight: 600; color: #f1f5f9; margin-bottom: 6px; }
  .ar-login-sub { font-size: 0.8rem; color: #64748b; }
  .ar-login-field { margin-bottom: 16px; }
  .ar-login-label { display: block; font-size: 0.76rem; font-weight: 600; color: #94a3b8; margin-bottom: 6px; }
  .ar-login-input { width: 100%; padding: 10px 14px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #f1f5f9; font-size: 0.9rem; outline: none; font-family: inherit; transition: border-color 0.2s; }
  .ar-login-input:focus { border-color: #e5452b; }
  .ar-login-btn { width: 100%; padding: 11px; background: #e5452b; color: #fff; border: none; border-radius: 6px; font-size: 0.9rem; font-weight: 600; cursor: pointer; margin-top: 6px; transition: background 0.2s; font-family: inherit; }
  .ar-login-btn:hover { background: #c73d26; }
  .ar-login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .ar-login-error { background: rgba(229,69,43,0.1); border: 1px solid rgba(229,69,43,0.3); color: #ff6b4a; padding: 10px 14px; border-radius: 6px; font-size: 0.82rem; margin-bottom: 16px; }

  /* Spinner */
  @keyframes ar-spin { to { transform: rotate(360deg); } }
  .ar-spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #e5452b; border-radius: 50%; animation: ar-spin 0.7s linear infinite; }
  .ar-center { display: flex; align-items: center; justify-content: center; flex: 1; min-height: 200px; }

  /* Thumb preview */
  .ar-thumb { width: 80px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0; display: block; }
  .ar-thumb-placeholder { width: 80px; height: 60px; background: #f1f5f9; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }

  /* Hamburger button */
  .ar-hamburger { display: none; flex-direction: column; justify-content: center; gap: 5px; cursor: pointer; padding: 6px 8px; background: none; border: none; border-radius: 6px; flex-shrink: 0; }
  .ar-hamburger:hover { background: #f1f5f9; }
  .ar-hamburger span { display: block; width: 20px; height: 2px; background: #334155; border-radius: 2px; transition: transform 0.25s, opacity 0.2s; }
  .ar-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .ar-hamburger.open span:nth-child(2) { opacity: 0; }
  .ar-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Sidebar overlay (mobile only) */
  .ar-overlay { display: none; }

  /* Responsive */
  @media (max-width: 768px) {
    .ar { overflow-x: hidden; }
    .ar-hamburger { display: flex; }
    .ar-overlay { display: block; position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 48; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; }
    .ar-overlay.show { opacity: 1; visibility: visible; }
    .ar-side { transform: translateX(-100%); transition: transform 0.3s; }
    .ar-side.open { transform: translateX(0); }
    .ar-main { margin-left: 0 !important; min-width: 0; width: 100%; max-width: 100vw; }
    .ar-form-row { grid-template-columns: 1fr; }
    .ar-content { padding: 16px; }
    .ar-topbar { padding: 0 16px; gap: 10px; }
    .ar-topbar-meta { display: none; }
    .ar-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .ar-card-header { flex-wrap: wrap; gap: 8px; }
    .ar-card-body { padding: 14px; }
    .ar-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }
    .ar-table { min-width: 500px; font-size: 0.82rem; }
    .ar-table th, .ar-table td { padding: 10px 10px; white-space: nowrap; }
    .ar-gallery-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
    .ar-modal-body { padding: 16px; }
    .ar-modal-footer { padding: 12px 16px; }
  }

  @media (max-width: 480px) {
    .ar-content { padding: 12px; }
    .ar-topbar { height: 52px; }
    .ar-stat-value { font-size: 1.4rem; }
    .ar-modal-backdrop { padding: 0; align-items: flex-end; }
    .ar-modal { border-radius: 12px 12px 0 0; max-width: 100%; max-height: 92vh; }
    .ar-upload-zone { padding: 20px; }
  }
`;

function AdminSpinner() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0f172a" }}><div className="ar-spinner" /></div>;
}

// ─── Custom dialog (replaces window.alert / window.confirm) ───────────────────
const DialogCtx = createContext(null);
export function useDialog() { return useContext(DialogCtx); }

const DlgIcons = {
  danger: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  warn:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

function DialogProvider({ children }) {
  const [dlg, setDlg] = useState(null);

  const openDlg = (opts) => new Promise((resolve) => setDlg({ ...opts, resolve }));

  const dialog = {
    confirm: (opts)                         => openDlg({ type: "confirm", ...opts }),
    alert:   (message, title, icon = "info")=> openDlg({ type: "alert", title: title || "Notice", message, icon }),
  };

  const close = (result) => { dlg?.resolve(result); setDlg(null); };

  return (
    <DialogCtx.Provider value={dialog}>
      {children}
      {dlg && (
        <div className="ar-dialog-backdrop">
          <div className="ar-dialog">
            <div className="ar-dialog-header">
              <span className="ar-dialog-title">{dlg.title || "Confirm"}</span>
              <button className="ar-dialog-close" onClick={() => close(false)}>×</button>
            </div>
            <div className="ar-dialog-body">
              {dlg.icon && (
                <div className={`ar-dialog-icon ar-dialog-icon-${dlg.icon}`}>
                  {DlgIcons[dlg.icon] || DlgIcons.info}
                </div>
              )}
              <p className="ar-dialog-msg">{dlg.message}</p>
            </div>
            <div className="ar-dialog-footer">
              {dlg.type === "confirm" && (
                <button className="ar-btn ar-btn-secondary" onClick={() => close(false)}>
                  {dlg.cancelLabel || "Cancel"}
                </button>
              )}
              <button
                className={`ar-btn ${dlg.confirmStyle === "danger" ? "ar-btn-danger" : "ar-btn-primary"}`}
                onClick={() => close(true)}
              >
                {dlg.confirmLabel || "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogCtx.Provider>
  );
}

// ─── Nav icons ────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  gallery:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  events:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  sermons:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  blog:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  logout:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  upload:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  plus:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
};

// ─── Admin Login ──────────────────────────────────────────────────────────────
export function AdminLogin() {
  const user = useAdmin();
  const [email, setEmail]     = useState("");
  const [pw, setPw]           = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in → go straight to dashboard
  if (user) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await login(email, pw);
      // Don't navigate here — onAuthStateChanged will fire, update user,
      // re-render this component, hit the redirect above, and go to dashboard.
    } catch (ex) {
      setErr(ex.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ar-login-wrap">
      <div className="ar-login-box">
        <div className="ar-login-logo">
          <img src="/images/header/logo.png" alt="Life Brand Church" style={{ height: 48, objectFit: "contain" }} />
          <div style={{ marginTop: 16 }}>
            <div className="ar-login-title">Admin Portal</div>
            <div className="ar-login-sub">Life Brand Church — Giving Light</div>
          </div>
        </div>
        {err && <div className="ar-login-error">{err}</div>}
        <form onSubmit={submit}>
          <div className="ar-login-field">
            <label className="ar-login-label">Email Address</label>
            <input className="ar-login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@lifebrandchurch.com" required autoFocus />
          </div>
          <div className="ar-login-field">
            <label className="ar-login-label">Password</label>
            <input className="ar-login-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" required />
          </div>
          <button className="ar-login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────
function AdminLayout({ children, title }) {
  const user     = useAdmin();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);
  const closeSide = () => setSideOpen(false);

  const NAV = [
    { to: "/admin/dashboard", icon: Icons.dashboard, label: "Dashboard" },
    { to: "/admin/gallery",   icon: Icons.gallery,   label: "Gallery"   },
    { to: "/admin/events",    icon: Icons.events,    label: "Events"    },
    { to: "/admin/sermons",   icon: Icons.sermons,   label: "Sermons"   },
    { to: "/admin/blog",      icon: Icons.blog,      label: "Blog Posts"},
  ];

  return (
    <div className="ar">
      {/* Mobile overlay — tap outside to close */}
      <div className={`ar-overlay${sideOpen ? " show" : ""}`} onClick={closeSide} />

      {/* Sidebar */}
      <aside className={`ar-side${sideOpen ? " open" : ""}`}>
        <div className="ar-logo">
          <img src="/images/header/logo.png" alt="Life Brand Church" />
          <div className="ar-logo-name">Admin Dashboard</div>
        </div>
        <nav className="ar-nav">
          <div className="ar-section-label">Content</div>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} onClick={closeSide} className={({ isActive }) => `ar-link${isActive ? " active" : ""}`}>
              {icon} {label}
            </NavLink>
          ))}
          <div className="ar-section-label">Site</div>
          <button className="ar-link" onClick={() => { window.open("/", "_blank"); closeSide(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            View Website
          </button>
        </nav>
        <div className="ar-footer">
          <div className="ar-user-email">{user?.email}</div>
          <button className="ar-logout" onClick={() => logout().then(() => navigate("/admin/login"))}>
            {Icons.logout} Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ar-main">
        <header className="ar-topbar">
          <button
            className={`ar-hamburger${sideOpen ? " open" : ""}`}
            onClick={() => setSideOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
          <span className="ar-page-title">{title}</span>
          <span className="ar-topbar-meta" style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Life Brand Church Admin</span>
        </header>
        <div className="ar-content">{children}</div>
      </main>
    </div>
  );
}

// ─── Upload Helper Component ───────────────────────────────────────────────────
function UploadZone({ onUpload, accept = "image/*", folder = "life-brand-church", label = "Click or drag to upload image" }) {
  const [drag, setDrag]       = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();
  const dialog   = useDialog();

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true); setProgress(0);
    try {
      const result = await uploadFile(file, folder, setProgress);
      onUpload(result);
    } catch (e) {
      dialog?.alert("Upload failed: " + e.message, "Upload Error", "danger");
    } finally {
      setUploading(false); setProgress(0);
    }
  };

  return (
    <div
      className={`ar-upload-zone${drag ? " drag" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
      <div className="ar-upload-zone-icon">📤</div>
      <div className="ar-upload-zone-text">{uploading ? `Uploading… ${progress}%` : label}</div>
      <div className="ar-upload-zone-sub">Uploads directly to Cloudinary</div>
      {uploading && (
        <div className="ar-progress" style={{ marginTop: 12 }}>
          <div className="ar-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [counts, setCounts] = useState({ gallery: 0, events: 0, sermons: 0, blogs: 0 });

  useEffect(() => {
    const cols = ["gallery", "events", "sermons", "blogs"];
    Promise.all(cols.map((c) =>
      import("./firebase.js").then(({ getAll }) => getAll(c).then((d) => [c, d.length]))
    )).then((res) => setCounts(Object.fromEntries(res)));
  }, []);

  const stats = [
    { label: "Gallery Photos",  value: counts.gallery,  sub: "Published images",  color: "#3b82f6" },
    { label: "Events",          value: counts.events,   sub: "Upcoming & past",   color: "#e5452b" },
    { label: "Sermons",         value: counts.sermons,  sub: "Video messages",    color: "#8b5cf6" },
    { label: "Blog Posts",      value: counts.blogs,    sub: "Articles published", color: "#10b981" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="ar-stats">
        {stats.map((s) => (
          <div className="ar-stat" key={s.label}>
            <div className="ar-stat-label">{s.label}</div>
            <div className="ar-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="ar-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="ar-card">
        <div className="ar-card-header"><span className="ar-card-title">Quick Actions</span></div>
        <div className="ar-card-body" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Upload Photo",    to: "/admin/gallery"  },
            { label: "Add Event",       to: "/admin/events"   },
            { label: "Add Sermon",      to: "/admin/sermons"  },
            { label: "Write Blog Post", to: "/admin/blog"     },
          ].map(({ label, to }) => (
            <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
              <button className="ar-btn ar-btn-primary">{Icons.plus} {label}</button>
            </NavLink>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── Gallery Admin ─────────────────────────────────────────────────────────────
const DEFAULT_GALLERY_CATS = ["Worship", "Events", "Outreach", "Youth", "Community"];

export function AdminGallery() {
  const [items,    setItems]    = useState([]);
  const [queue,    setQueue]    = useState([]);
  const [cats,     setCats]     = useState(DEFAULT_GALLERY_CATS);
  const [category, setCategory] = useState(DEFAULT_GALLERY_CATS[0]);
  const [newCat,   setNewCat]   = useState("");
  const [uploading,setUploading]= useState(false);
  const [msg,      setMsg]      = useState("");
  const [drag,     setDrag]     = useState(false);
  const [catError, setCatError] = useState("");
  const inputRef = useRef();
  const dialog   = useDialog();

  useEffect(() => subscribe(COLS.gallery, setItems), []);
  useEffect(() => subscribeSetting("gallery_cats", (d) => {
    if (d?.cats?.length) { setCats(d.cats); setCategory((c) => d.cats.includes(c) ? c : d.cats[0]); }
  }), []);

  const addCat = async () => {
    const t = newCat.trim();
    if (!t || cats.includes(t)) return;
    const prev = cats;
    const next = [...cats, t];
    setCats(next); setNewCat(""); setCatError("");
    try { await setSetting("gallery_cats", { cats: next }); }
    catch { setCats(prev); setNewCat(t); setCatError('Save failed — add the "settings" collection to your Firestore security rules.'); }
  };

  const removeCat = async (cat) => {
    const count = items.filter((i) => i.category === cat).length;
    if (count > 0) {
      await dialog.alert(`"${cat}" has ${count} photo${count !== 1 ? "s" : ""} attached. Delete those photos first before removing this tab.`, "Cannot Remove Tab", "warn");
      return;
    }
    if (!await dialog.confirm({ title: "Remove Tab", message: `Remove the "${cat}" tab? This cannot be undone.`, confirmLabel: "Remove", confirmStyle: "danger", cancelLabel: "Keep It", icon: "warn" })) return;
    const prev = cats;
    const next = cats.filter((c) => c !== cat);
    const saved = next.length ? next : DEFAULT_GALLERY_CATS;
    setCats(saved); setCatError("");
    try { await setSetting("gallery_cats", { cats: saved }); }
    catch { setCats(prev); setCatError('Save failed — add the "settings" collection to your Firestore security rules.'); }
  };

  const addFiles = (files) => {
    const next = Array.from(files).map((file) => ({
      id:         Math.random().toString(36).slice(2),
      file,
      previewUrl: URL.createObjectURL(file),
      alt:        "",
      progress:   0,
      status:     "pending",
    }));
    setQueue((q) => [...q, ...next]);
  };

  const removeQueued = (id) => {
    setQueue((q) => {
      const item = q.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return q.filter((i) => i.id !== id);
    });
  };

  const uploadAll = async () => {
    const pending = queue.filter((i) => i.status === "pending");
    if (!pending.length) return;
    setUploading(true);

    for (const item of pending) {
      setQueue((q) => q.map((i) => i.id === item.id ? { ...i, status: "uploading" } : i));
      try {
        const result = await uploadFile(
          item.file,
          "life-brand-church/gallery",
          (pct) => setQueue((q) => q.map((i) => i.id === item.id ? { ...i, progress: pct } : i)),
        );
        await addItem(COLS.gallery, {
          url:      result.secure_url,
          publicId: result.public_id,
          alt:      item.alt || "Church photo",
          category,
        });
        setQueue((q) => q.map((i) => i.id === item.id ? { ...i, status: "done", progress: 100 } : i));
      } catch {
        setQueue((q) => q.map((i) => i.id === item.id ? { ...i, status: "error" } : i));
      }
    }

    setUploading(false);
    const count = pending.length;
    setMsg(`${count} photo${count > 1 ? "s" : ""} uploaded!`);
    setTimeout(() => {
      setMsg("");
      setQueue((q) => q.filter((i) => i.status !== "done"));
    }, 3000);
  };

  const remove = async (id) => {
    if (!await dialog.confirm({ title: "Delete Photo", message: "Delete this photo permanently? This cannot be undone.", confirmLabel: "Delete", confirmStyle: "danger", cancelLabel: "Cancel", icon: "danger" })) return;
    await deleteItem(COLS.gallery, id);
  };

  const pendingCount = queue.filter((i) => i.status === "pending").length;

  return (
    <AdminLayout title="Gallery">
      {/* ── Category manager ── */}
      <div className="ar-card" style={{ marginBottom: 24 }}>
        <div className="ar-card-header">
          <span className="ar-card-title">Filter Tabs</span>
          <span style={{ fontSize: "0.74rem", color: "#64748b" }}>These appear as tabs on the public Gallery page</span>
        </div>
        <div className="ar-card-body">
          {catError && <div className="ar-alert ar-alert-error" style={{ marginBottom: 14 }}>{catError}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {cats.map((cat) => (
              <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 20, fontSize: "0.82rem", color: "#334155", fontWeight: 500 }}>
                {cat}
                <button onClick={() => removeCat(cat)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1, padding: 0 }} title="Remove tab">×</button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, maxWidth: 360 }}>
            <input className="ar-input" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCat()} placeholder="New tab name…" />
            <button className="ar-btn ar-btn-primary" onClick={addCat} disabled={!newCat.trim()}>+ Add</button>
          </div>
        </div>
      </div>

      {/* ── Upload card ── */}
      <div className="ar-card" style={{ marginBottom: 24 }}>
        <div className="ar-card-header">
          <span className="ar-card-title">Upload Photos</span>
          {queue.length > 0 && (
            <span style={{ fontSize: "0.76rem", color: "#64748b" }}>
              {pendingCount} pending · {queue.filter((i) => i.status === "done").length} done
            </span>
          )}
        </div>
        <div className="ar-card-body">
          {msg && <div className="ar-alert ar-alert-success">{msg}</div>}

          {/* Drop zone */}
          <div
            className={`ar-upload-zone${drag ? " drag" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
            />
            <div className="ar-upload-zone-icon">🖼️</div>
            <div className="ar-upload-zone-text">Click or drag to select multiple photos</div>
            <div className="ar-upload-zone-sub">PNG, JPG, WEBP — select as many as you want</div>
          </div>

          {/* Queue */}
          {queue.length > 0 && (
            <div style={{ marginTop: 20 }}>
              {/* Category applies to all */}
              <div className="ar-field" style={{ marginBottom: 16 }}>
                <label className="ar-label">Category (applies to all)</label>
                <select
                  className="ar-input ar-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={uploading}
                >
                  {cats.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Per-image rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {queue.map((item) => {
                  const bg     = item.status === "done" ? "#f0fdf4" : item.status === "error" ? "#fef2f2" : "#f8fafc";
                  const border = item.status === "done" ? "#bbf7d0" : item.status === "error" ? "#fecaca" : "#e2e8f0";
                  return (
                    <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", background: bg, border: `1px solid ${border}`, borderRadius: 8 }}>
                      <img src={item.previewUrl} alt="" style={{ width: 60, height: 44, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input
                          className="ar-input"
                          value={item.alt}
                          onChange={(e) => setQueue((q) => q.map((i) => i.id === item.id ? { ...i, alt: e.target.value } : i))}
                          placeholder="Caption / alt text (optional)"
                          disabled={item.status !== "pending"}
                          style={{ marginBottom: item.status === "uploading" ? 6 : 0 }}
                        />
                        {item.status === "uploading" && (
                          <div className="ar-progress">
                            <div className="ar-progress-bar" style={{ width: `${item.progress}%` }} />
                          </div>
                        )}
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {item.status === "done"  && <span style={{ color: "#16a34a", fontSize: "1.1rem", fontWeight: 700 }}>✓</span>}
                        {item.status === "error" && <span style={{ color: "#dc2626", fontSize: "0.76rem", fontWeight: 600 }}>Failed</span>}
                        {item.status === "pending" && (
                          <button className="ar-btn ar-btn-danger ar-btn-sm" onClick={() => removeQueued(item.id)}>✕</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {pendingCount > 0 && (
                <button className="ar-btn ar-btn-primary" onClick={uploadAll} disabled={uploading}>
                  {Icons.upload} {uploading ? "Uploading…" : `Upload ${pendingCount} Photo${pendingCount > 1 ? "s" : ""}`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Photos grouped by category ── */}
      <div className="ar-card">
        <div className="ar-card-header">
          <span className="ar-card-title">All Photos ({items.length})</span>
        </div>
        <div className="ar-card-body">
          {items.length === 0 && (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "32px 0" }}>No photos yet. Upload your first photo above.</p>
          )}
          {cats.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            if (!catItems.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
                  <span className="ar-badge ar-badge-blue" style={{ fontSize: "0.75rem" }}>{cat}</span>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{catItems.length} photo{catItems.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="ar-gallery-grid">
                  {catItems.map((item) => (
                    <div className="ar-gallery-item" key={item.id}>
                      <img src={item.url} alt={item.alt} />
                      <div className="ar-gallery-item-overlay">
                        <button className="ar-btn ar-btn-danger ar-btn-sm" onClick={() => remove(item.id)}>{Icons.trash}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* Photos whose category was deleted — show under "Other" */}
          {(() => {
            const other = items.filter((i) => !cats.includes(i.category));
            if (!other.length) return null;
            return (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f1f5f9" }}>
                  <span className="ar-badge ar-badge-yellow" style={{ fontSize: "0.75rem" }}>Other</span>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{other.length} photo{other.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="ar-gallery-grid">
                  {other.map((item) => (
                    <div className="ar-gallery-item" key={item.id}>
                      <img src={item.url} alt={item.alt} />
                      <div className="ar-gallery-item-overlay">
                        <button className="ar-btn ar-btn-danger ar-btn-sm" onClick={() => remove(item.id)}>{Icons.trash}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── Events Admin ──────────────────────────────────────────────────────────────
const DEFAULT_EVENT_CATS = ["Worship", "Youth", "Outreach", "Study", "Arts", "Fellowship"];
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

export function AdminEvents() {
  const [items,  setItems]  = useState([]);
  const [modal,  setModal]  = useState(false);
  const [cats,   setCats]   = useState(DEFAULT_EVENT_CATS);
  const [newCat, setNewCat] = useState("");
  const [form,   setForm]   = useState({ title: "", month: "JUN", day: "01", time: "", location: "", desc: "", category: DEFAULT_EVENT_CATS[0], featured: false, image: "" });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [catError, setCatError] = useState("");
  const dialog   = useDialog();

  useEffect(() => subscribe(COLS.events, setItems), []);
  useEffect(() => subscribeSetting("event_cats", (d) => {
    if (d?.cats?.length) setCats(d.cats);
  }), []);

  const addCat = async () => {
    const t = newCat.trim();
    if (!t || cats.includes(t)) return;
    const prev = cats;
    const next = [...cats, t];
    setCats(next); setNewCat(""); setCatError("");
    try { await setSetting("event_cats", { cats: next }); }
    catch { setCats(prev); setNewCat(t); setCatError('Save failed — add the "settings" collection to your Firestore security rules.'); }
  };

  const removeCat = async (cat) => {
    const count = items.filter((i) => i.category === cat).length;
    if (count > 0) {
      await dialog.alert(`"${cat}" has ${count} event${count !== 1 ? "s" : ""} attached. Delete those events first before removing this tab.`, "Cannot Remove Tab", "warn");
      return;
    }
    if (!await dialog.confirm({ title: "Remove Tab", message: `Remove the "${cat}" tab? This cannot be undone.`, confirmLabel: "Remove", confirmStyle: "danger", cancelLabel: "Keep It", icon: "warn" })) return;
    const prev = cats;
    const next = cats.filter((c) => c !== cat);
    const saved = next.length ? next : DEFAULT_EVENT_CATS;
    setCats(saved); setCatError("");
    try { await setSetting("event_cats", { cats: saved }); }
    catch { setCats(prev); setCatError('Save failed — add the "settings" collection to your Firestore security rules.'); }
  };

  const [activeFilter, setActiveFilter] = useState("All");

  const openAdd  = ()      => { setForm({ title: "", month: "JUN", day: "01", time: "", location: "", desc: "", category: cats[0] || "Worship", featured: false, image: "" }); setEditId(null); setModal(true); };
  const openEdit = (item)  => { setForm({ ...item }); setEditId(item.id); setModal(true); };
  const close    = ()      => setModal(false);

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updateItem(COLS.events, editId, form);
      else        await addItem(COLS.events, form);
      close();
    } finally { setSaving(false); }
  };

  return (
    <AdminLayout title="Events">
      {/* ── Category manager ── */}
      <div className="ar-card" style={{ marginBottom: 24 }}>
        <div className="ar-card-header">
          <span className="ar-card-title">Filter Tabs</span>
          <span style={{ fontSize: "0.74rem", color: "#64748b" }}>These appear as tabs on the public Events page</span>
        </div>
        <div className="ar-card-body">
          {catError && <div className="ar-alert ar-alert-error" style={{ marginBottom: 14 }}>{catError}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {cats.map((cat) => (
              <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 20, fontSize: "0.82rem", color: "#334155", fontWeight: 500 }}>
                {cat}
                <button onClick={() => removeCat(cat)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1, padding: 0 }} title="Remove tab">×</button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, maxWidth: 360 }}>
            <input className="ar-input" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCat()} placeholder="New tab name…" />
            <button className="ar-btn ar-btn-primary" onClick={addCat} disabled={!newCat.trim()}>+ Add</button>
          </div>
        </div>
      </div>

      <div className="ar-card">
        <div className="ar-card-header">
          <span className="ar-card-title">Events ({items.length})</span>
          <button className="ar-btn ar-btn-primary" onClick={openAdd}>{Icons.plus} Add Event</button>
        </div>
        {/* Category filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "12px 22px", borderBottom: "1px solid #f1f5f9" }}>
          {["All", ...cats].map((cat) => {
            const count = cat === "All" ? items.length : items.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                className={`ar-btn ar-btn-sm ${activeFilter === cat ? "ar-btn-primary" : "ar-btn-secondary"}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat} <span style={{ opacity: 0.65, marginLeft: 4 }}>({count})</span>
              </button>
            );
          })}
        </div>
        <div className="ar-table-wrap" style={{ overflowX: "auto" }}>
          <table className="ar-table">
            <thead><tr><th>Image</th><th>Date</th><th>Title</th><th>Category</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {(activeFilter === "All" ? items : items.filter((e) => e.category === activeFilter)).map((e) => (
                <tr key={e.id}>
                  <td>{e.image ? <img src={e.image} alt="" /> : <div className="ar-thumb-placeholder">📅</div>}</td>
                  <td><strong>{e.month} {e.day}</strong></td>
                  <td>{e.title}</td>
                  <td><span className="ar-badge ar-badge-blue">{e.category}</span></td>
                  <td>{e.featured ? <span className="ar-badge ar-badge-green">Yes</span> : <span className="ar-badge ar-badge-yellow">No</span>}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="ar-btn ar-btn-secondary ar-btn-sm" onClick={() => openEdit(e)}>{Icons.edit} Edit</button>
                    <button className="ar-btn ar-btn-danger ar-btn-sm" onClick={async () => { if (await dialog.confirm({ title: "Delete Event", message: `Delete "${e.title}"? This cannot be undone.`, confirmLabel: "Delete", confirmStyle: "danger", cancelLabel: "Cancel", icon: "danger" })) deleteItem(COLS.events, e.id); }}>{Icons.trash}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{ color: "#94a3b8", textAlign: "center", padding: "32px" }}>No events yet.</p>}
        </div>
      </div>

      {modal && (
        <div className="ar-modal-backdrop">
          <div className="ar-modal">
            <div className="ar-modal-header">
              <span className="ar-modal-title">{editId ? "Edit Event" : "Add Event"}</span>
              <button className="ar-modal-close" onClick={close}>×</button>
            </div>
            <div className="ar-modal-body">
              <div className="ar-field">
                <label className="ar-label">Event Title *</label>
                <input className="ar-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sunday Worship Service" />
              </div>
              <div className="ar-form-row">
                <div className="ar-field">
                  <label className="ar-label">Month</label>
                  <select className="ar-input ar-select" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>
                    {MONTHS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="ar-field">
                  <label className="ar-label">Day</label>
                  <input className="ar-input" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} placeholder="01" />
                </div>
              </div>
              <div className="ar-form-row">
                <div className="ar-field">
                  <label className="ar-label">Time</label>
                  <input className="ar-input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="8:00 AM – 11:00 AM" />
                </div>
                <div className="ar-field">
                  <label className="ar-label">Category</label>
                  <select className="ar-input ar-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {cats.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="ar-field">
                <label className="ar-label">Location</label>
                <input className="ar-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Main Auditorium, Life Brand Church" />
              </div>
              <div className="ar-field">
                <label className="ar-label">Description</label>
                <textarea className="ar-input ar-textarea" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Event description…" />
              </div>
              <div className="ar-field">
                <label className="ar-label">Event Image</label>
                <UploadZone folder="life-brand-church/events" onUpload={(r) => setForm({ ...form, image: r.secure_url })} />
                {form.image && <img src={form.image} alt="" className="ar-thumb" style={{ marginTop: 8 }} />}
              </div>
              <label className="ar-checkbox-row">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                <span style={{ fontSize: "0.85rem", color: "#475569" }}>Featured event (shown as card)</span>
              </label>
            </div>
            <div className="ar-modal-footer">
              <button className="ar-btn ar-btn-secondary" onClick={close}>Cancel</button>
              <button className="ar-btn ar-btn-primary" onClick={save} disabled={saving || !form.title}>
                {saving ? "Saving…" : editId ? "Update Event" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── Sermons Admin ────────────────────────────────────────────────────────────
const DEFAULT_SERMON_CATS = ["Grace", "Faith", "Prayer", "Holy Spirit", "Evangelism", "Healing", "Worship"];

export function AdminSermons() {
  const [items,        setItems]        = useState([]);
  const [modal,        setModal]        = useState(false);
  const [cats,         setCats]         = useState(DEFAULT_SERMON_CATS);
  const [newCat,       setNewCat]       = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [form,         setForm]         = useState({ title: "", pastor: "Apostle Olusayo Oyebola Ajao", date: "", duration: "", category: DEFAULT_SERMON_CATS[0], youtubeId: "", thumbnail: "" });
  const [editId,       setEditId]       = useState(null);
  const [saving,       setSaving]       = useState(false);

  const [catError, setCatError] = useState("");
  const dialog   = useDialog();

  useEffect(() => subscribe(COLS.sermons, setItems), []);
  useEffect(() => subscribeSetting("sermon_cats", (d) => {
    if (d?.cats?.length) setCats(d.cats);
  }), []);

  const addCat = async () => {
    const t = newCat.trim();
    if (!t || cats.includes(t)) return;
    const prev = cats;
    const next = [...cats, t];
    setCats(next); setNewCat(""); setCatError("");
    try { await setSetting("sermon_cats", { cats: next }); }
    catch { setCats(prev); setNewCat(t); setCatError('Save failed — add the "settings" collection to your Firestore security rules.'); }
  };

  const removeCat = async (cat) => {
    const count = items.filter((i) => i.category === cat).length;
    if (count > 0) {
      await dialog.alert(`"${cat}" has ${count} sermon${count !== 1 ? "s" : ""} attached. Delete those sermons first before removing this tab.`, "Cannot Remove Tab", "warn");
      return;
    }
    if (!await dialog.confirm({ title: "Remove Tab", message: `Remove the "${cat}" tab? This cannot be undone.`, confirmLabel: "Remove", confirmStyle: "danger", cancelLabel: "Keep It", icon: "warn" })) return;
    const prev = cats;
    const next = cats.filter((c) => c !== cat);
    const saved = next.length ? next : DEFAULT_SERMON_CATS;
    setCats(saved); setCatError("");
    try { await setSetting("sermon_cats", { cats: saved }); }
    catch { setCats(prev); setCatError('Save failed — add the "settings" collection to your Firestore security rules.'); }
  };

  const openAdd  = ()     => { setForm({ title: "", pastor: "Apostle Olusayo Oyebola Ajao", date: "", duration: "", category: cats[0] || "Grace", youtubeId: "", thumbnail: "" }); setEditId(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...item }); setEditId(item.id); setModal(true); };
  const close    = ()     => setModal(false);

  const save = async () => {
    setSaving(true);
    try {
      if (editId) await updateItem(COLS.sermons, editId, form);
      else        await addItem(COLS.sermons, form);
      close();
    } finally { setSaving(false); }
  };

  const visible = activeFilter === "All" ? items : items.filter((s) => s.category === activeFilter);

  return (
    <AdminLayout title="Sermons">
      {/* ── Category manager ── */}
      <div className="ar-card" style={{ marginBottom: 24 }}>
        <div className="ar-card-header">
          <span className="ar-card-title">Sermon Categories</span>
          <span style={{ fontSize: "0.74rem", color: "#64748b" }}>These appear as filter tabs on the public Sermons page</span>
        </div>
        <div className="ar-card-body">
          {catError && <div className="ar-alert ar-alert-error" style={{ marginBottom: 14 }}>{catError}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {cats.map((cat) => (
              <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 20, fontSize: "0.82rem", color: "#334155", fontWeight: 500 }}>
                {cat}
                <button onClick={() => removeCat(cat)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1, padding: 0 }} title="Remove tab">×</button>
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, maxWidth: 360 }}>
            <input className="ar-input" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCat()} placeholder="New category…" />
            <button className="ar-btn ar-btn-primary" onClick={addCat} disabled={!newCat.trim()}>+ Add</button>
          </div>
        </div>
      </div>

      {/* ── Sermons list ── */}
      <div className="ar-card">
        <div className="ar-card-header">
          <span className="ar-card-title">Sermons ({items.length})</span>
          <button className="ar-btn ar-btn-primary" onClick={openAdd}>{Icons.plus} Add Sermon</button>
        </div>
        {/* Category filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "12px 22px", borderBottom: "1px solid #f1f5f9" }}>
          {["All", ...cats].map((cat) => {
            const count = cat === "All" ? items.length : items.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                className={`ar-btn ar-btn-sm ${activeFilter === cat ? "ar-btn-primary" : "ar-btn-secondary"}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat} <span style={{ opacity: 0.65, marginLeft: 4 }}>({count})</span>
              </button>
            );
          })}
        </div>
        <div className="ar-table-wrap" style={{ overflowX: "auto" }}>
          <table className="ar-table">
            <thead><tr><th>Thumbnail</th><th>Title</th><th>Pastor</th><th>Date</th><th>Category</th><th>Actions</th></tr></thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s.id}>
                  <td>{s.thumbnail ? <img src={s.thumbnail} alt="" /> : <div className="ar-thumb-placeholder">🎙️</div>}</td>
                  <td style={{ maxWidth: 220 }}>{s.title}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{s.pastor}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{s.date}</td>
                  <td><span className="ar-badge ar-badge-blue">{s.category}</span></td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="ar-btn ar-btn-secondary ar-btn-sm" onClick={() => openEdit(s)}>{Icons.edit} Edit</button>
                    <button className="ar-btn ar-btn-danger ar-btn-sm" onClick={async () => { if (await dialog.confirm({ title: "Delete Sermon", message: `Delete "${s.title}"? This cannot be undone.`, confirmLabel: "Delete", confirmStyle: "danger", cancelLabel: "Cancel", icon: "danger" })) deleteItem(COLS.sermons, s.id); }}>{Icons.trash}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{ color: "#94a3b8", textAlign: "center", padding: "32px" }}>No sermons yet.</p>}
        </div>
      </div>

      {modal && (
        <div className="ar-modal-backdrop">
          <div className="ar-modal">
            <div className="ar-modal-header">
              <span className="ar-modal-title">{editId ? "Edit Sermon" : "Add Sermon"}</span>
              <button className="ar-modal-close" onClick={close}>×</button>
            </div>
            <div className="ar-modal-body">
              <div className="ar-field">
                <label className="ar-label">Sermon Title *</label>
                <input className="ar-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="The Law Demands, but Grace Supplies" />
              </div>
              <div className="ar-form-row">
                <div className="ar-field">
                  <label className="ar-label">Pastor</label>
                  <input className="ar-input" value={form.pastor} onChange={(e) => setForm({ ...form, pastor: e.target.value })} />
                </div>
                <div className="ar-field">
                  <label className="ar-label">Date</label>
                  <input className="ar-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="ar-form-row">
                <div className="ar-field">
                  <label className="ar-label">Duration</label>
                  <input className="ar-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="45 min" />
                </div>
                <div className="ar-field">
                  <label className="ar-label">Category</label>
                  <select className="ar-input ar-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {cats.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="ar-field">
                <label className="ar-label">YouTube Video ID</label>
                <input className="ar-input" value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} placeholder="xImpyYRVGOc  (the part after ?v=)" />
                <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 4 }}>From youtube.com/watch?v=<strong>THIS_PART</strong></span>
              </div>
              <div className="ar-field">
                <label className="ar-label">Sermon Thumbnail</label>
                <UploadZone folder="life-brand-church/sermons" onUpload={(r) => setForm({ ...form, thumbnail: r.secure_url })} />
                {form.thumbnail && <img src={form.thumbnail} alt="" className="ar-thumb" style={{ marginTop: 8 }} />}
              </div>
            </div>
            <div className="ar-modal-footer">
              <button className="ar-btn ar-btn-secondary" onClick={close}>Cancel</button>
              <button className="ar-btn ar-btn-primary" onClick={save} disabled={saving || !form.title}>
                {saving ? "Saving…" : editId ? "Update" : "Add Sermon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── Rich Text Editor ─────────────────────────────────────────────────────────
const TbSep = () => <div style={{ width: 1, height: 20, background: "#e2e8f0", margin: "0 3px", flexShrink: 0 }} />;

function RichEditor({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
  }, []); // initialise once on mount

  const exec = (cmd, arg) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg ?? null);
    onChange(ref.current?.innerHTML || "");
  };

  const btn = (cmd, arg, title, child) => (
    <button
      key={title}
      title={title}
      onMouseDown={(e) => { e.preventDefault(); exec(cmd, arg); }}
      style={{ border: "none", background: "none", cursor: "pointer", padding: "5px 7px", borderRadius: 4, color: "#334155", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
    >{child}</button>
  );

  const SvgIcon = ({ d, d2, pts, circle }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {pts  && pts.map((p, i) => <line key={i} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} />)}
      {d    && <path d={d} />}
      {d2   && <path d={d2} />}
      {circle && <circle cx={circle[0]} cy={circle[1]} r={circle[2]} fill="currentColor" stroke="none" />}
    </svg>
  );

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 6, overflow: "hidden", background: "#fff" }}>
      {/* ── Toolbar ── */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "6px 10px", display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>

        {/* Text style */}
        {btn("bold",          null, "Bold",        <b style={{ fontFamily: "Georgia,serif", fontSize: "0.88rem" }}>B</b>)}
        {btn("italic",        null, "Italic",      <i style={{ fontFamily: "Georgia,serif", fontSize: "0.88rem" }}>I</i>)}
        {btn("underline",     null, "Underline",   <u style={{ fontFamily: "Georgia,serif", fontSize: "0.88rem" }}>U</u>)}
        {btn("strikeThrough", null, "Strikethrough", <s style={{ fontFamily: "Georgia,serif", fontSize: "0.88rem" }}>S</s>)}
        <TbSep />

        {/* Headings */}
        {btn("formatBlock", "h2", "Heading 2",   <span style={{ fontSize: "0.72rem", fontWeight: 800 }}>H2</span>)}
        {btn("formatBlock", "h3", "Heading 3",   <span style={{ fontSize: "0.72rem", fontWeight: 800 }}>H3</span>)}
        {btn("formatBlock", "p",  "Normal Text", <span style={{ fontSize: "0.72rem", fontWeight: 700 }}>P</span>)}
        <TbSep />

        {/* Lists */}
        {btn("insertUnorderedList", null, "Bullet List",
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="4" cy="6"  r="1.5" fill="currentColor" stroke="none"/>
            <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/>
            <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>
            <line x1="9" y1="6"  x2="21" y2="6"/>
            <line x1="9" y1="12" x2="21" y2="12"/>
            <line x1="9" y1="18" x2="21" y2="18"/>
          </svg>
        )}
        {btn("insertOrderedList", null, "Numbered List",
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <line x1="10" y1="6"  x2="21" y2="6"/>
            <line x1="10" y1="12" x2="21" y2="12"/>
            <line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 4v4" strokeWidth="1.5"/><line x1="3" y1="8" x2="5" y2="8" strokeWidth="1.5"/>
            <path d="M3 13h2v1l-2 1.5h2" strokeWidth="1.2"/>
            <path d="M3 19h2l-2 3h2" strokeWidth="1.2"/>
          </svg>
        )}
        <TbSep />

        {/* Alignment */}
        {btn("justifyLeft",   null, "Align Left",
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="15" y2="12"/>
            <line x1="3" y1="18" x2="18" y2="18"/>
          </svg>
        )}
        {btn("justifyCenter", null, "Align Center",
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="6" y1="12" x2="18" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        )}
        {btn("justifyRight",  null, "Align Right",
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3"  y1="6"  x2="21" y2="6"/>
            <line x1="9"  y1="12" x2="21" y2="12"/>
            <line x1="6"  y1="18" x2="21" y2="18"/>
          </svg>
        )}
        {btn("justifyFull",   null, "Justify",
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
        <TbSep />

        {/* Divider */}
        {btn("insertHorizontalRule", null, "Divider Line", <span style={{ fontSize: "1rem", lineHeight: 1 }}>—</span>)}
        <TbSep />

        {/* Undo / Redo */}
        {btn("undo", null, "Undo",
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
          </svg>
        )}
        {btn("redo", null, "Redo",
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
          </svg>
        )}
      </div>

      {/* ── Editable area ── */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || "")}
        style={{
          minHeight: 300,
          maxHeight: 480,
          overflowY: "auto",
          padding: "18px 20px",
          outline: "none",
          fontSize: "0.93rem",
          lineHeight: 1.85,
          color: "#1e293b",
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
    </div>
  );
}

// ─── Blog Admin ───────────────────────────────────────────────────────────────
const EMPTY_BLOG = { title: "", author: "Apostle Olusayo Oyebola Ajao", date: "", image: "", excerpt: "", content: "" };

export function AdminBlog() {
  const [items,  setItems]  = useState([]);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(EMPTY_BLOG);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const dialog   = useDialog();

  useEffect(() => subscribe(COLS.blogs, setItems), []);

  const openAdd  = ()     => { setForm(EMPTY_BLOG); setEditId(null); setModal(true); };
  const openEdit = (item) => { setForm({ ...item }); setEditId(item.id); setModal(true); };
  const close    = ()     => setModal(false);

  const save = async () => {
    setSaving(true);
    try {
      const dateStr = form.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      if (editId) await updateItem(COLS.blogs, editId, { ...form, date: dateStr });
      else        await addItem(COLS.blogs, { ...form, date: dateStr });
      close();
    } finally { setSaving(false); }
  };

  return (
    <AdminLayout title="Blog Posts">
      <div className="ar-card">
        <div className="ar-card-header">
          <span className="ar-card-title">Blog Posts ({items.length})</span>
          <button className="ar-btn ar-btn-primary" onClick={openAdd}>{Icons.plus} New Post</button>
        </div>
        <div className="ar-table-wrap" style={{ overflowX: "auto" }}>
          <table className="ar-table">
            <thead><tr><th>Image</th><th>Title</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>{b.image ? <img src={b.image} alt="" /> : <div className="ar-thumb-placeholder">✍️</div>}</td>
                  <td style={{ maxWidth: 260 }}>{b.title}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{b.author}</td>
                  <td style={{ fontSize: "0.8rem", color: "#64748b" }}>{b.date}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="ar-btn ar-btn-secondary ar-btn-sm" onClick={() => openEdit(b)}>{Icons.edit} Edit</button>
                    <button className="ar-btn ar-btn-danger ar-btn-sm" onClick={async () => { if (await dialog.confirm({ title: "Delete Post", message: `Delete "${b.title}"? This cannot be undone.`, confirmLabel: "Delete", confirmStyle: "danger", cancelLabel: "Cancel", icon: "danger" })) deleteItem(COLS.blogs, b.id); }}>{Icons.trash}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p style={{ color: "#94a3b8", textAlign: "center", padding: "32px" }}>No blog posts yet.</p>}
        </div>
      </div>

      {modal && (
        <div className="ar-modal-backdrop">
          <div className="ar-modal" style={{ maxWidth: 780 }}>
            <div className="ar-modal-header">
              <span className="ar-modal-title">{editId ? "Edit Post" : "New Blog Post"}</span>
              <button className="ar-modal-close" onClick={close}>×</button>
            </div>
            <div className="ar-modal-body">
              <div className="ar-field">
                <label className="ar-label">Title *</label>
                <input className="ar-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Lord of Our Life & Our Salvation" />
              </div>
              <div className="ar-form-row">
                <div className="ar-field">
                  <label className="ar-label">Author</label>
                  <input className="ar-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                </div>
                <div className="ar-field">
                  <label className="ar-label">Date (leave blank for today)</label>
                  <input className="ar-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="ar-field">
                <label className="ar-label">Featured Image</label>
                <UploadZone folder="life-brand-church/blog" onUpload={(r) => setForm({ ...form, image: r.secure_url })} />
                {form.image && <img src={form.image} alt="" className="ar-thumb" style={{ marginTop: 8 }} />}
              </div>
              <div className="ar-field">
                <label className="ar-label">Excerpt (short preview)</label>
                <textarea className="ar-input" style={{ minHeight: 70 }} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="A short summary shown on the blog list…" />
              </div>
              <div className="ar-field">
                <label className="ar-label">Full Content</label>
                <RichEditor
                  key={editId || "new"}
                  value={form.content}
                  onChange={(html) => setForm({ ...form, content: html })}
                />
              </div>
            </div>
            <div className="ar-modal-footer">
              <button className="ar-btn ar-btn-secondary" onClick={close}>Cancel</button>
              <button className="ar-btn ar-btn-primary" onClick={save} disabled={saving || !form.title}>
                {saving ? "Saving…" : editId ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─── Admin App (auth wrapper) ─────────────────────────────────────────────────
export default function AdminApp() {
  return (
    <AuthProvider>
      <style>{ADMIN_CSS}</style>
      <DialogProvider>
        <Outlet />
      </DialogProvider>
    </AuthProvider>
  );
}
