import axios from "../../api/axios";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

export const getPaymentMethods = async () => {
  const { data } = await axios.get("/payment-methods", { headers: authHeaders() });
  return data;
};

export const createPaymentMethod = async (payload) => {
  const { data } = await axios.post("/payment-methods", payload, { headers: authHeaders() });
  return data;
};

export const updatePaymentMethod = async (id, payload) => {
  const { data } = await axios.put(`/payment-methods/${id}`, payload, { headers: authHeaders() });
  return data;
};
