import api from "../api/axios";
/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  const { data } = await api.post("/bookings", bookingData);
  return data;
};

/**
 * Track booking using booking reference
 */
export const getBookingByReference = async (reference) => {
  const { data } = await api.get(`/bookings/reference/${reference}`);
  return data;
};

/**
 * Download booking confirmation PDF
 */
export const downloadBookingConfirmation = async (bookingId) => {
  const response = await api.get(
    `/bookings/${bookingId}/confirmation`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};