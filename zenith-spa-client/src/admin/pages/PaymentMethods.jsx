import { useState, useEffect, useCallback, useMemo } from "react";
import { FaSync, FaPlus, FaEdit, FaSearch, FaToggleOn, FaToggleOff, FaCreditCard } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getPaymentMethods, updatePaymentMethod } from "../services/paymentMethodApi";
import PaymentMethodModal from "../components/PaymentMethodModal";

export default function PaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await getPaymentMethods();
      if (res && res.success) {
        setMethods(res.data || []);
        if (isRefresh) toast.success("Payment methods refreshed.");
      } else {
        toast.error("Failed to load payment methods.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error connecting to server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!search.trim()) return methods;
    const kw = search.toLowerCase();
    return methods.filter(
      (m) =>
        (m.name || "").toLowerCase().includes(kw) ||
        (m.accountName || "").toLowerCase().includes(kw)
    );
  }, [methods, search]);

  const stats = useMemo(() => ({
    total: methods.length,
    available: methods.filter((m) => m.active).length,
    unavailable: methods.filter((m) => !m.active).length,
  }), [methods]);

  const handleToggle = async (method) => {
    setToggling(method._id);
    try {
      const res = await updatePaymentMethod(method._id, { ...method, active: !method.active });
      if (res && res.success) {
        setMethods((prev) => prev.map((m) => m._id === method._id ? { ...m, active: !m.active } : m));
        toast.success(!method.active ? "Payment method is now available." : "Payment method hidden from customers.");
      }
    } catch {
      toast.error("Failed to toggle availability.");
    } finally {
      setToggling(null);
    }
  };

  const cardData = [
    { title: "Total Methods", value: stats.total, icon: <FaCreditCard />, color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white" },
    { title: "Available", value: stats.available, icon: <FaToggleOn />, color: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white" },
    { title: "Unavailable", value: stats.unavailable, icon: <FaToggleOff />, color: "bg-gradient-to-br from-slate-400 to-slate-500 text-white" },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <FaSync className="animate-spin text-4xl text-slate-600" />
        <p className="text-gray-500 font-medium">Loading payment methods...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-[1600px] mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment Methods</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage the payment methods available to customers.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => load(true)} disabled={refreshing}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-60"
          >
            <FaSync className={"text-sm " + (refreshing ? "animate-spin" : "")} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button onClick={() => { setSelected(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <FaPlus size={12} />
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cardData.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">{card.title}</span>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{card.value}</h2>
            </div>
            <div className={"w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-md " + card.color}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center max-w-md">
        <FaSearch className="text-slate-400 mr-3" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by payment method or account name..."
          className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-bold tracking-wider uppercase">
                <th className="p-4 pl-6">Payment Method</th>
                <th className="p-4">Account Name</th>
                <th className="p-4">Account Details</th>
                <th className="p-4">Availability</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-slate-400">
                    <p className="text-slate-500 font-semibold">No payment methods found.</p>
                    <p className="text-xs mt-1">Click "Add Payment Method" to get started.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((method) => (
                  <tr key={method._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-semibold text-slate-900">{method.name || "—"}</td>
                    <td className="p-4 text-slate-600">{method.accountName || "—"}</td>
                    <td className="p-4 font-mono text-xs text-slate-500 max-w-[220px] truncate">{method.accountDetails || "—"}</td>
                    <td className="p-4">
                      {method.active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-100">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => { setSelected(method); setShowModal(true); }} title="Edit"
                          className="p-2 text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-all"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => handleToggle(method)} disabled={toggling === method._id} title={method.active ? "Hide from customers" : "Make available"}
                          className={"p-2 rounded-lg transition-all disabled:opacity-50 " + (method.active ? "text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-500" : "text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600")}
                        >
                          {method.active ? <FaToggleOff size={16} /> : <FaToggleOn size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <PaymentMethodModal
          open={showModal}
          method={selected}
          onClose={() => { setShowModal(false); setSelected(null); }}
          onRefresh={load}
        />
      )}

    </div>
  );
}
