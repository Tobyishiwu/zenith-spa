import {
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaUser,
  FaSpa,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function BookingDetailsModal({
  open,
  booking,
  loading,
  onClose,
  onApprove,
  onReject,
}) {
  if (!open || !booking) return null;

  const isRejected = booking.paymentStatus === "Rejected";
  const isApproved = booking.paymentStatus === "Paid";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Booking Details</h2>
            <p className="mt-1 text-gray-500">{booking.bookingReference}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-500">
            <FaTimes />
          </button>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-2">

          {/* LEFT */}
          <div className="space-y-6">

            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold">
                <FaUser /> Customer
              </h3>
              <p><strong>Name:</strong> {booking.customerName}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Address:</strong></p>
              <p className="whitespace-pre-line text-gray-600">{booking.address}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold">
                <FaSpa /> Appointment
              </h3>
              <p><strong>Therapist:</strong> {booking.therapist?.name}</p>
              <p><strong>Service:</strong> {booking.service?.name}</p>
              <p>
                <strong>Date:</strong>{" "}
                {booking.bookingDate
                  ? new Date(booking.bookingDate).toLocaleDateString()
                  : "-"}
              </p>
              <p><strong>Time:</strong> {booking.time}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold">
                <FaMoneyBillWave /> Payment
              </h3>
              <p><strong>Method:</strong> {booking.paymentMethod?.name}</p>
              <p><strong>Amount:</strong> ${booking.totalAmount}</p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={
                    isRejected
                      ? "font-semibold text-red-600"
                      : isApproved
                      ? "font-semibold text-green-600"
                      : "font-semibold text-amber-600"
                  }
                >
                  {booking.paymentStatus}
                </span>
              </p>
              <p><strong>Booking Status:</strong> {booking.bookingStatus}</p>

              {isRejected && booking.rejectionReason && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="mb-1 flex items-center gap-2 text-sm font-bold text-red-700">
                    <FaExclamationTriangle /> Rejection Reason
                  </p>
                  <p className="text-sm text-red-600">{booking.rejectionReason}</p>
                  {booking.rejectedAt && (
                    <p className="mt-1 text-xs text-red-400">
                      Rejected on{" "}
                      {new Date(booking.rejectedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT */}
          <div>
            <div className="rounded-2xl bg-gray-50 p-6">
              <h3 className="mb-5 flex items-center gap-3 text-xl font-bold">
                <FaCalendarAlt /> Payment Receipt
              </h3>
              {booking.paymentProof ? (
                <img
                  src={`http://localhost:5000${booking.paymentProof}`}
                  alt="Payment Receipt"
                  className="w-full rounded-xl border object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="py-16 text-center text-gray-400">
                  No receipt uploaded.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 border-t p-6">
          {isRejected ? (
            <span className="flex items-center gap-2 rounded-xl bg-red-100 px-5 py-3 text-sm font-semibold text-red-600">
              <FaTimesCircle /> Payment Rejected
            </span>
          ) : (
            <>
              <button
                onClick={() => onReject(booking._id)}
                disabled={loading || isApproved}
                className="flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaTimesCircle /> Reject
              </button>
              <button
                onClick={() => onApprove(booking._id)}
                disabled={loading || isApproved}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaCheckCircle />
                {loading ? "Approving..." : "Approve Payment"}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
