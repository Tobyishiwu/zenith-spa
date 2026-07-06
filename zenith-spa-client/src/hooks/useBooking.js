import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const useBooking = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  return {
    booking,
    loading,
    bookingId,
  };
};

export default useBooking;