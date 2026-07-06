import { useState, useEffect, useCallback } from "react";
import { FaTimes, FaSync } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { createPaymentMethod, updatePaymentMethod } from "../services/paymentMethodApi";

const PAYMENT_NAMES = [
  "Bitcoin (BTC)",
  "USDT (TRC20)",
  "USDT (ERC20)",
  "Zelle",
  "Cash App",
  "Bank Transfer",
  "PayPal",
];

const PLACEHOLDERS = {
  "Bitcoin (BTC)": "Wallet Address (e.g. bc1q...)",
  "USDT (TRC20)": "Wallet Address (e.g. T...)",
  "USDT (ERC20)": "Wallet Address (e.g. 0x...)",
  "Zelle": "Registered Email or Phone",
  "Cash App": "Cashtag (e.g. $username)",
  "Bank Transfer": "Bank Name + Account Number",
  "PayPal": "PayPal Email Address",
};

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-300 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400 disabled:opacity-60";

export default function PaymentMethodModal({ open, method, onClose, onRefresh }) {
  const [name, setName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountDetails, setAccountDetails] = useState("");
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(method);

  useEffect(() => {
    if (open) {
      if (method) {
        setName(method.name || "");
        setAccountName(method.accountName || "");
        setAccountDetails(method.accountDetails || "");
        setActive(method.active !== false);
      } else {
        setName("");
        setAccountName("");
        setAccountDetails("");
        setActive(true);
      }
    }
  }, [open, method]);

  const handleClose = useCallback(() => {
    if (submitting) return;
    onClose();
  }, [onClose, submitting]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open && !submitting) handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submitting, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Payment method name is required.");
    if (!accountName.trim()) return toast.error("Account name is required.");
    if (!accountDetails.trim()) return toast.error("Account details are required.");

    setSubmitting(true);
    try {
      const payload = { name: name.trim(), accountName: accountName.trim(), accountDetails: accountDetails.trim(), active };
      let res;
      if (isEdit) {
        res = await updatePaymentMethod(method._id, payload);
      } else {
        res = await createPaymentMethod(payload);
      }
      if (res && res.success) {
        toast.success(isEdit ? "Payment method updated." : "Payment method created.");
        onRefresh();
        handleClose();
      } else {
        toast.error(res?.message || "Operation failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-100 bg-white shadow-xl my-auto">

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{isEdit ? "Edit Payment Method" : "Add Payment Method"}</h2>
            <p className="mt-0.5 text-sm text-slate-400">{isEdit ? "Update payment method details." : "Add a new payment method for customers."}</p>
          </div>
          <button onClick={handleClose} disabled={submitting} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-40">
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Method</label>
            <select value={name} onChange={(e) => setName(e.target.value)} disabled={submitting} className={inputCls}>
              <option value="">Select a payment method...</option>
              {PAYMENT_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Name</label>
            <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} disabled={submitting} placeholder="Display name for this account" className={inputCls} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Details</label>
            <input type="text" value={accountDetails} onChange={(e) => setAccountDetails(e.target.value)} disabled={submitting}
              placeholder={name ? (PLACEHOLDERS[name] || "Account details") : "Select a method first"}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Availability</label>
            <div className="flex items-center gap-3 h-[46px]">
              <button type="button" onClick={() => setActive((v) => !v)} disabled={submitting}
                className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 " + (active ? "bg-emerald-600" : "bg-slate-200")}
              >
                <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 " + (active ? "translate-x-6" : "translate-x-1")} />
              </button>
              <span className="text-sm font-semibold text-slate-700">{active ? "Available to Customers" : "Hidden from Customers"}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={handleClose} disabled={submitting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all active:scale-95 disabled:opacity-60"
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-75"
            >
              {submitting && <FaSync className="animate-spin text-xs" />}
              {submitting ? "Saving..." : isEdit ? "Update Method" : "Create Method"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
