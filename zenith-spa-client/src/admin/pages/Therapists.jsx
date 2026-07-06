import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaUserTie,
  FaStar,
  FaBriefcase,
  FaSync,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getTherapists } from "../services/adminApi";
import { imageUrl } from "../../utils/imageUrl";
import defaultAvatar from "../../assets/images/default-avatar.png";
import TherapistModal from "../components/TherapistModal";
import DeleteTherapistModal from "../components/DeleteTherapistModal";

export default function Therapists() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadTherapists = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await getTherapists();
      if (response && response.success) {
        setTherapists(response.data || []);
        if (isRefresh) toast.success("Therapists refreshed successfully.");
      } else {
        toast.error("Failed to load therapists.");
      }
    } catch (error) {
      console.error("Therapists Fetch Error:", error);
      toast.error(error.response?.data?.message || "Error connecting to server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTherapists();
  }, [loadTherapists]);

  const filteredTherapists = useMemo(() => {
    if (!search.trim()) return therapists;
    const query = search.toLowerCase();
    return therapists.filter((t) =>
      (t.name || "").toLowerCase().includes(query) ||
      (t.specialization || "").toLowerCase().includes(query)
    );
  }, [search, therapists]);

  const stats = useMemo(() => {
    const total = therapists.length;
    const featured = therapists.filter((t) => t.featured).length;
    const validRatings = therapists.filter((t) => typeof t.rating === "number");
    const avgRating = validRatings.length
      ? (validRatings.reduce((acc, t) => acc + t.rating, 0) / validRatings.length).toFixed(1)
      : "0.0";
    const validExp = therapists.filter((t) => typeof t.experience === "number");
    const avgExp = validExp.length
      ? Math.round(validExp.reduce((acc, t) => acc + t.experience, 0) / validExp.length)
      : 0;
    return { total, featured, avgRating, avgExp };
  }, [therapists]);

  const cardData = [
    {
      title: "Total Therapists",
      value: stats.total,
      icon: <FaUserTie />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-100",
    },
    {
      title: "Featured Therapists",
      value: stats.featured,
      icon: <FaCheckCircle />,
      color: "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-100",
    },
    {
      title: "Average Rating",
      value: `${stats.avgRating} / 5.0`,
      icon: <FaStar />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-100",
    },
    {
      title: "Average Experience",
      value: `${stats.avgExp} Yrs`,
      icon: <FaBriefcase />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <FaSync className="animate-spin text-4xl text-slate-600" />
        <p className="text-gray-500 font-medium">Loading therapists...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-[1600px] mx-auto">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Therapists</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage therapists. <span className="text-slate-400 font-normal">Staff directory.</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadTherapists(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-60"
          >
            <FaSync className={`${refreshing ? "animate-spin" : ""} text-sm`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => { setSelectedTherapist(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <FaPlus size={12} />
            Add Therapist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200"
          >
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
                {card.title}
              </span>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{card.value}</h2>
            </div>
            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-md`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center max-w-md">
        <FaSearch className="text-slate-400 mr-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search therapists by name or specialization..."
          className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-bold tracking-wider uppercase">
                <th className="p-4 pl-6">Photo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Featured</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {filteredTherapists.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-slate-400 font-medium">
                    <p className="text-slate-500 font-semibold">No therapists found.</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Add Therapist" to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredTherapists.map((therapist) => (
                  <tr key={therapist._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      {/* imageUrl() resolves relative /uploads/... paths to full URLs */}
                      <img
                        src={imageUrl(therapist.image) || defaultAvatar}
                        alt={therapist.name || "Therapist"}
                        onError={(e) => { e.target.src = defaultAvatar; }}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm"
                      />
                    </td>
                    <td className="p-4 font-medium text-slate-900">{therapist.name || "N/A"}</td>
                    <td className="p-4 text-slate-600 font-medium">
                      {therapist.specialization || "General Practitioner"}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{therapist.experience || 0} Yrs</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1 text-amber-500 font-bold">
                        <FaStar size={14} />
                        <span>{(therapist.rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {therapist.featured ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                          <FaCheckCircle size={12} /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-100">
                          <FaTimesCircle size={12} /> No
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedTherapist(therapist); setShowModal(true); }}
                          title="Edit Profile"
                          className="p-2 text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-all"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => { setSelectedTherapist(therapist); setShowDeleteModal(true); }}
                          title="Delete Therapist"
                          className="p-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg transition-all"
                        >
                          <FaTrash size={12} />
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
        <TherapistModal
          open={showModal}
          therapist={selectedTherapist}
          onClose={() => { setShowModal(false); setSelectedTherapist(null); }}
          onRefresh={loadTherapists}
        />
      )}

      {showDeleteModal && (
        <DeleteTherapistModal
          open={showDeleteModal}
          therapist={selectedTherapist}
          onClose={() => { setShowDeleteModal(false); setSelectedTherapist(null); }}
          onDeleted={loadTherapists}
        />
      )}

    </div>
  );
}
