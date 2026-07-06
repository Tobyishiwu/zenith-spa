import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaBuilding,
  FaPalette,
  FaClock,
  FaShareAlt,
  FaCalendarCheck,
  FaLock,
  FaExclamationTriangle,
  FaSave,
  FaUndo,
  FaSignOutAlt,
} from "react-icons/fa";

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-300 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400";
const labelCls = "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "UTC",
];

const DEFAULTS = {
  businessName: "Zenith Spa",
  supportEmail: "hello@zenithspa.com",
  phone: "",
  whatsapp: "",
  logoUrl: "",
  description: "Premium wellness delivered to your home, hotel, or office.",
  openTime: "08:00",
  closeTime: "22:00",
  timezone: "America/Los_Angeles",
  instagram: "",
  facebook: "",
  tiktok: "",
  linkedin: "",
  website: "",
  confirmationMessage: "Your booking has been received. We will verify your payment and confirm your appointment shortly.",
  paymentInstructions: "Please transfer the exact booking amount and upload a clear screenshot of your payment receipt.",
};

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon size={15} />
      </div>
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...DEFAULTS });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const setPw = (field) => (e) => setPasswords((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save — wire to backend when API is available
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Settings saved successfully.");
    setSaving(false);
  };

  const handleReset = () => {
    setForm({ ...DEFAULTS });
    toast("Settings reset to defaults.", { icon: "↩️" });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwords.current) return toast.error("Enter your current password.");
    if (passwords.next.length < 8) return toast.error("New password must be at least 8 characters.");
    if (passwords.next !== passwords.confirm) return toast.error("Passwords do not match.");
    setChangingPw(true);
    setTimeout(() => {
      toast.success("Password changed successfully.");
      setPasswords({ current: "", next: "", confirm: "" });
      setChangingPw(false);
    }, 700);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully.");
    navigate("/admin/login");
  };

  return (
    <div className="space-y-8 p-6 max-w-[900px] mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your business information and platform configuration.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm"
          >
            <FaUndo size={12} /> Reset
          </button>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm disabled:opacity-70"
          >
            <FaSave size={12} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Section 1 — Business Information */}
      <SectionCard icon={FaBuilding} title="Business Information">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Business Name</label>
            <input type="text" value={form.businessName} onChange={set("businessName")} placeholder="Zenith Spa" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Support Email</label>
            <input type="email" value={form.supportEmail} onChange={set("supportEmail")} placeholder="hello@zenithspa.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <input type="tel" value={form.whatsapp} onChange={set("whatsapp")} placeholder="+1 555 000 0000" className={inputCls} />
          </div>
        </div>
      </SectionCard>

      {/* Section 2 — Branding */}
      <SectionCard icon={FaPalette} title="Branding">
        <div className="space-y-5">
          <div>
            <label className={labelCls}>Logo URL</label>
            <input type="url" value={form.logoUrl} onChange={set("logoUrl")} placeholder="https://yourcdn.com/logo.png" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Business Description</label>
            <textarea value={form.description} onChange={set("description")} rows={3}
              placeholder="A short description of your business..."
              className={inputCls + " resize-none"}
            />
          </div>
        </div>
      </SectionCard>

      {/* Section 3 — Business Hours */}
      <SectionCard icon={FaClock} title="Business Hours">
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Open Time</label>
            <input type="time" value={form.openTime} onChange={set("openTime")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Close Time</label>
            <input type="time" value={form.closeTime} onChange={set("closeTime")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Timezone</label>
            <select value={form.timezone} onChange={set("timezone")} className={inputCls}>
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Section 4 — Social Media */}
      <SectionCard icon={FaShareAlt} title="Social Media">
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { field: "instagram", label: "Instagram", placeholder: "https://instagram.com/zenithspa" },
            { field: "facebook", label: "Facebook", placeholder: "https://facebook.com/zenithspa" },
            { field: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@zenithspa" },
            { field: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/zenithspa" },
            { field: "website", label: "Website", placeholder: "https://zenithspa.com" },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label className={labelCls}>{label}</label>
              <input type="url" value={form[field]} onChange={set(field)} placeholder={placeholder} className={inputCls} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 5 — Booking Settings */}
      <SectionCard icon={FaCalendarCheck} title="Booking Settings">
        <div className="space-y-5">
          <div>
            <label className={labelCls}>Booking Confirmation Message</label>
            <textarea value={form.confirmationMessage} onChange={set("confirmationMessage")} rows={3}
              placeholder="Message shown to customers after booking..."
              className={inputCls + " resize-none"}
            />
          </div>
          <div>
            <label className={labelCls}>Payment Instructions</label>
            <textarea value={form.paymentInstructions} onChange={set("paymentInstructions")} rows={3}
              placeholder="Instructions for customers on how to pay..."
              className={inputCls + " resize-none"}
            />
          </div>
        </div>
      </SectionCard>

      {/* Section 6 — Security */}
      <SectionCard icon={FaLock} title="Security — Change Password">
        <form onSubmit={handleChangePassword} className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Current Password</label>
            <input type="password" value={passwords.current} onChange={setPw("current")} placeholder="••••••••" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input type="password" value={passwords.next} onChange={setPw("next")} placeholder="••••••••" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Confirm Password</label>
            <input type="password" value={passwords.confirm} onChange={setPw("confirm")} placeholder="••••••••" className={inputCls} />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button type="submit" disabled={changingPw}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm disabled:opacity-70"
            >
              <FaLock size={11} /> {changingPw ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Section 7 — Danger Zone */}
      <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <FaExclamationTriangle size={16} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-rose-800">Danger Zone</h2>
            <p className="mt-1 text-sm text-rose-600">
              Logging out will end your current admin session. You will need to sign in again to access the dashboard.
            </p>
            <button onClick={handleLogout}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-95"
            >
              <FaSignOutAlt size={13} /> Logout
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
