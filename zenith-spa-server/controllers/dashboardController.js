import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const pendingVerification = await Booking.countDocuments({
      paymentStatus: "Pending Verification",
    });

    const confirmedBookings = await Booking.countDocuments({
      bookingStatus: "Confirmed",
    });

    const completedBookings = await Booking.countDocuments({
      bookingStatus: "Completed",
    });

    // Today's revenue (confirmed bookings created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const confirmedToday = await Booking.find({
      bookingStatus: "Confirmed",
      createdAt: {
        $gte: today,
      },
    });

    const todayRevenue = confirmedToday.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    const pendingBookings = await Booking.find({
  paymentStatus: "Pending Verification",
})
  .populate("service", "name price")
  .populate("therapist", "name")
  .populate("paymentMethod", "name accountName")
  .sort({ createdAt: -1 })
  .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingVerification,
        confirmedBookings,
        completedBookings,
        todayRevenue,
      },
      pendingBookings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};