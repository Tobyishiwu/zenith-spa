import React, { useState, useEffect, useCallback } from "react";
import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaSync,
  FaEye,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  getDashboardStats,
  approveBooking,
  rejectBooking,
} from "../services/adminApi";
import BookingDetailsModal from "../components/BookingDetailsModal";
import RejectModal from "../components/RejectModal";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingVerification: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    todayRevenue: 0,
  });
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await getDashboardStats();
      if (data.success) {
        setStats(data.stats);
        setPendingBookings(data.pendingBookings || []);
        if (isRefresh) toast.success("Dashboard metrics updated.");
      } else {
        toast.error("Failed to load dashboard statistics.");
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      toast.error(error.response?.data?.message || "Error connecting to server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleApprovePayment = async (bookingId) => {
    try {
      await approveBooking(bookingId);
      toast.success("Payment verified and booking confirmed!");
      if (selectedBooking && selectedBooking._id === bookingId) {
        setIsModalOpen(false);
        setSelectedBooking(null);
      }
      fetchDashboardData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve payment.");
    }
  };

  // Opens the RejectModal — same pattern as Bookings page
  const handleRejectClick = (bookingId) => {
    setRejectTargetId(bookingId);
    setRejectModalOpen(true);
    // Close details modal if open for this booking
    if (selectedBooking && selectedBooking._id === bookingId) {
      setIsModalOpen(false);
      setSelectedBooking(null);
    }
  };

  // Called by RejectModal with the entered reason
  const handleRejectConfirm = async (reason) => {
    if (!rejectTargetId) return;
    setRejecting(true);
    try {
      await rejectBooking(rejectTargetId, reason);
      toast.success("Payment rejected successfully.");
      setRejectModalOpen(false);
      setRejectTargetId(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Reject Error:", error);
      toast.error(error?.response?.data?.message || "Failed to reject payment.");
    } finally {
      setRejecting(false);
    }
  };

  const cardData = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <FaCalendarCheck />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-100",
    },
    {
      title: "Pending Verification",
      value: stats.pendingVerification,
      icon: <FaClock />,
      color: "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-100",
    },
    {
      title: "Confirmed Bookings",
      value: stats.confirmedBookings,
      icon: <FaCheckCircle />,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-100",
    },
    {
      title: "Completed Bookings",
      value: stats.completedBookings,
      icon: <FaTimesCircle className="rotate-180" />,
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-100",
    },
    {
      title: "Today's Revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(stats.todayRevenue),
      icon: <FaMoneyBillWave />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <FaSync className="animate-spin text-4xl text-slate-600" />
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-[1600px] mx-auto">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Welcome back. <span className="text-slate-400 font-normal">Today's overview.</span>
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-60"
        >
          <FaSync className={`${refreshing ? "animate-spin" : ""} text-sm`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200"
          >
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">
                {card.title}
              </span>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                {card.value}
              </h2>
            </div>
            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-md`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Pending Payment Verification</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Review and verify client payment submissions.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-bold tracking-wider uppercase">
                <th className="p-4 pl-6">Booking Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Therapist</th>
                <th className="p-4">Service</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Booking Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {pendingBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16 text-slate-400 font-medium">
                    No pending verifications currently require attention.
                  </td>
                </tr>
              ) : (
                pendingBookings.map((booking) => (
                  <tr key={booking._id || booking.bookingReference} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                      {booking.bookingReference || `REF-${booking._id?.slice(-6).toUpperCase()}`}
                    </td>
                    <td className="p-4 font-medium text-slate-900">
                      {booking.customerName || "N/A"}
                    </td>
                    <td className="p-4 text-slate-500">
                      {booking.therapist?.name || "Unassigned"}
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {booking.service?.name || "Spa Treatment"}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      }).format(booking.totalAmount || 0)}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {booking.paymentStatus || "Pending Verification"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {booking.bookingStatus || "Pending"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          title="View Details"
                          className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => handleApprovePayment(booking._id)}
                          title="Approve Payment"
                          className="p-2 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-lg transition-all"
                        >
                          <FaCheck size={12} />
                        </button>
                        <button
                          onClick={() => handleRejectClick(booking._id)}
                          title="Reject Payment"
                          className="p-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg transition-all"
                        >
                          <FaTimes size={12} />
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

      {isModalOpen && (
        <BookingDetailsModal
          open={isModalOpen}
          booking={selectedBooking}
          loading={refreshing}
          onClose={() => { setIsModalOpen(false); setSelectedBooking(null); }}
          onApprove={handleApprovePayment}
          onReject={handleRejectClick}
        />
      )}

      <RejectModal
        open={rejectModalOpen}
        loading={rejecting}
        onCancel={() => { setRejectModalOpen(false); setRejectTargetId(null); }}
        onConfirm={handleRejectConfirm}
      />

    </div>
  );
}
