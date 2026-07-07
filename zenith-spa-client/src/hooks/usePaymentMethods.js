import { useEffect, useState } from "react";
import api from "../api/axios";

const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await api.get("/payment-methods");

console.log("Payment API Response:", res.data);

        console.log("PAYMENT RESPONSE:", res.data);

const data = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        console.log("PAYMENT RESPONSE:", res.data);
console.log("PAYMENT STATE:", data);

setPaymentMethods(data);
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        setPaymentMethods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
    loading,
  };
};

export default usePaymentMethods;



