import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiXCircle,
} from "react-icons/fi";
import {
  getDashboardStats,
  getBookings,
  approveBooking,
  rejectBooking,
} from "../services/adminApi";
import BookingDetailsModal from "../components/BookingDetailsModal";
import RejectModal from "../components/RejectModal";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "Pending Verification", label: "Pending Verification" },
  { value: "Paid", label: "Paid" },
  { value: "Rejected", label: "Rejected" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "customerName:asc", label: "Customer A-Z" },
  { value: "customerName:desc", label: "Customer Z-A" },
  { value: "totalAmount:desc", label: "Amount High-Low" },
  { value: "totalAmount:asc", label: "Amount Low-High" },
];

const fmt = {
  currency: (n) =>
    typeof n === "number"
      ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 })
      : "$0.00",
  date: (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-",
  shortId: (id) => (id ? id.toString().slice(-8).toUpperCase() : "-"),
};

const PaymentBadge = ({ status }) => {
  const map = {
    "Pending Verification": "bg-amber-100 text-amber-700",
    Pending: "bg-orange-100 text-orange-700",
    Paid: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-600",
    Failed: "bg-red-100 text-red-600",
  };
  const cls = map[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold " + cls}>
      {status || "Pending"}
    </span>
  );
};

const BookingBadge = ({ status }) => {
  const map = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    Completed: "bg-sky-100 text-sky-700",
    Cancelled: "bg-red-100 text-red-600",
    Pending: "bg-gray-100 text-gray-600",
  };
  const cls = map[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={"inline-flex rounded-full px-2.5 py-1 text-xs font-semibold " + cls}>
      {status || "Pending"}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {Array.from({ length: 9 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-3.5 animate-pulse rounded bg-gray-100" />
      </td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="rounded-2xl bg-white p-6 shadow-sm">
    <div className="flex justify-between">
      <div className="space-y-3">
        <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
        <div className="h-8 w-16 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="h-14 w-14 animate-pulse rounded-xl bg-gray-100" />
    </div>
  </div>
);

export default function Bookings() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortValue, setSortValue] = useState("createdAt:desc");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [approving, setApproving] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [rejecting, setRejecting] = useState(false);

  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await getDashboardStats();
      setStats(data.stats || null);
    } catch (err) {
      console.error("[loadStats]", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);
    setBookingsError("");
    try {
      const [sortField, sortDir] = sortValue.split(":");
      const params = { page, limit, sort: sortField, order: sortDir };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.paymentStatus = statusFilter;
      const data = await getBookings(params);
      setBookings(data.bookings || []);
      setTotalBookings(data.pagination?.totalBookings ?? data.count ?? 0);
    } catch (err) {
      console.error("[loadBookings]", err);
      setBookingsError("Unable to load bookings.");
      toast.error("Unable to load bookings.");
    } finally {
      setLoadingBookings(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, sortValue]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadBookings(); }, [loadBookings]);

  const handleRefresh = async () => {
    await Promise.all([loadStats(), loadBookings()]);
    toast.success("Updated.");
  };

  const handleApprove = useCallback(async (bookingId) => {
    setApproving(true);
    try {
      await approveBooking(bookingId);
      toast.success("Payment approved successfully.");
      setModalOpen(false);
      setSelectedBooking(null);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, paymentStatus: "Paid", bookingStatus: "Confirmed" }
            : b
        )
      );
      loadStats();
    } catch (err) {
      console.error("[handleApprove]", err);
      toast.error(err?.response?.data?.message || "Failed to approve payment.");
    } finally {
      setApproving(false);
    }
  }, [loadStats]);

  const handleRejectClick = useCallback((bookingId) => {
    setRejectTargetId(bookingId);
    setRejectModalOpen(true);
    setModalOpen(false);
    setSelectedBooking(null);
  }, []);

  const handleRejectConfirm = useCallback(async (reason) => {
    if (!rejectTargetId) return;
    setRejecting(true);
    try {
      await rejectBooking(rejectTargetId, reason);
      toast.success("Payment rejected successfully.");
      setRejectModalOpen(false);
      setRejectTargetId(null);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === rejectTargetId
            ? {
                ...b,
                paymentStatus: "Rejected",
                bookingStatus: "Pending",
                rejectionReason: reason,
                rejectedAt: new Date().toISOString(),
              }
            : b
        )
      );
      loadStats();
    } catch (err) {
      console.error("[handleRejectConfirm]", err);
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      if (status === 400) toast.error(message || "Invalid request.");
      else if (status === 401 || status === 403) toast.error("Not authorized.");
      else if (status === 404) toast.error("Booking not found.");
      else if (status === 409) toast.error(message || "Cannot reject this booking.");
      else toast.error("Failed to reject payment. Please try again.");
    } finally {
      setRejecting(false);
    }
  }, [rejectTargetId, loadStats]);

  const handleCopyRef = async (booking) => {
    const ref = booking.bookingReference || fmt.shortId(booking._id);
    try {
      await navigator.clipboard.writeText(ref);
      toast.success("Reference copied.");
    } catch {
      toast.error("Could not copy.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalBookings / limit));
  const hasFilters = !!(debouncedSearch || statusFilter);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: <FiCalendar />,
      color: "bg-blue-600",
    },
    {
      title: "Pending Verification",
      value: stats?.pendingVerification ?? 0,
      icon: <FiClock />,
      color: "bg-yellow-500",
    },
    {
      title: "Confirmed",
      value: stats?.confirmedBookings ?? 0,
      icon: <FiCheckCircle />,
      color: "bg-green-600",
    },
    {
      title: "Today Revenue",
      value: fmt.currency(stats?.todayRevenue ?? 0),
      icon: <FiDollarSign />,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Bookings</h1>
          <p className="mt-1 text-gray-500">Manage customer bookings and payment verification.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loadingBookings}
          className="flex items-center gap-2 self-start rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60 sm:self-auto"
        >
          <FiRefreshCw className={loadingBookings ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {loadingStats
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card) => (
              <div key={card.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <h2 className="mt-3 text-4xl font-bold text-slate-800">{card.value}</h2>
                  </div>
                  <div className={"flex h-14 w-14 items-center justify-center rounded-xl text-2xl text-white " + card.color}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference, customer, email, phone..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-slate-400 sm:w-52"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={sortValue}
          onChange={(e) => { setSortValue(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-slate-400 sm:w-44"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {bookingsError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FiXCircle className="mb-3 text-4xl text-red-400" />
            <p className="font-semibold text-gray-700">Failed to load bookings</p>
            <button
              onClick={loadBookings}
              className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Reference","Customer","Therapist","Service","Amount","Payment","Status","Date","Actions"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loadingBookings ? (
                    Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={9}>
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <FiCalendar className="mb-3 text-4xl text-gray-200" />
                          <p className="font-semibold text-gray-600">No bookings found</p>
                          {hasFilters && (
                            <button
                              onClick={() => { setSearch(""); setStatusFilter(""); }}
                              className="mt-3 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => {
                      const isRejected = booking.paymentStatus === "Rejected";
                      const isApproved = booking.paymentStatus === "Paid";
                      return (
                        <tr key={booking._id} className="border-b border-gray-50 transition hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-slate-700">
                                {booking.bookingReference || fmt.shortId(booking._id)}
                              </span>
                              <button
                                onClick={() => handleCopyRef(booking)}
                                className="text-gray-300 hover:text-gray-600"
                                aria-label="Copy reference"
                              >
                                <FiCopy className="text-xs" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-gray-800">{booking.customerName || "-"}</p>
                            <p className="text-xs text-gray-400">{booking.email}</p>
                          </td>
                          <td className="px-4 py-4 text-gray-700">{booking.therapist?.name || "-"}</td>
                          <td className="px-4 py-4 text-gray-700">{booking.service?.name || "-"}</td>
                          <td className="px-4 py-4 font-bold text-purple-700">
                            {fmt.currency(booking.totalAmount)}
                          </td>
                          <td className="px-4 py-4">
                            <PaymentBadge status={booking.paymentStatus} />
                          </td>
                          <td className="px-4 py-4">
                            <BookingBadge status={booking.bookingStatus} />
                          </td>
                          <td className="px-4 py-4 text-gray-500">{fmt.date(booking.createdAt)}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => { setSelectedBooking(booking); setModalOpen(true); }}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                              >
                                <FiEye /> View
                              </button>
                              {isRejected ? (
                                <span className="flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-500">
                                  <FiXCircle /> Rejected
                                </span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleApprove(booking._id)}
                                    disabled={approving || isApproved}
                                    className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiCheckCircle /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectClick(booking._id)}
                                    disabled={rejecting || isApproved}
                                    className="flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <FiXCircle /> Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!loadingBookings && bookings.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {(page - 1) * limit + 1}-{Math.min(page * limit, totalBookings)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">{totalBookings}</span>
                  </span>
                  <select
                    value={limit}
                    onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                    className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs outline-none"
                  >
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s} / page</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronLeft />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={"e" + i} className="px-1 text-xs text-gray-400">...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={"flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition " + (p === page ? "bg-slate-900 text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50")}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BookingDetailsModal
        open={modalOpen}
        booking={selectedBooking}
        loading={approving}
        onClose={() => { setModalOpen(false); setSelectedBooking(null); }}
        onApprove={handleApprove}
        onReject={handleRejectClick}
      />

      <RejectModal
        open={rejectModalOpen}
        loading={rejecting}
        onCancel={() => { setRejectModalOpen(false); setRejectTargetId(null); }}
        onConfirm={handleRejectConfirm}
      />

    </div>
  );
}
