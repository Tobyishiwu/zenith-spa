import axios from "../../api/axios";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

// ==============================
// DASHBOARD
// ==============================

export const getDashboardStats = async () => {
  const { data } = await axios.get("/admin/dashboard", {
    headers: authHeaders(),
  });

  return data;
};

// ==============================
// BOOKINGS
// ==============================

export const getBookings = async (params = {}) => {
  const { data } = await axios.get("/admin/bookings", {
    headers: authHeaders(),
    params,
  });

  return data;
};

export const getBooking = async (id) => {
  const { data } = await axios.get(`/admin/bookings/${id}`, {
    headers: authHeaders(),
  });

  return data;
};

export const approveBooking = async (id) => {
  const { data } = await axios.patch(
    `/bookings/${id}/approve-payment`,
    {},
    {
      headers: authHeaders(),
    }
  );

  return data;
};

export const rejectBooking = async (id, reason = "") => {
  const { data } = await axios.patch(
    `/bookings/${id}/reject-payment`,
    { reason },
    {
      headers: authHeaders(),
    }
  );

  return data;
};

// ==============================
// THERAPISTS
// ==============================

export const getTherapists = async () => {
  const { data } = await axios.get("/therapists", {
    headers: authHeaders(),
  });

  return data;
};

export const createTherapist = async (formData) => {
  const { data } = await axios.post("/therapists", formData, {
    headers: authHeaders(),
  });

  return data;
};

export const updateTherapist = async (id, formData) => {
  const { data } = await axios.put(`/therapists/${id}`, formData, {
    headers: authHeaders(),
  });

  return data;
};

export const deleteTherapist = async (id) => {
  const { data } = await axios.delete(`/therapists/${id}`, {
    headers: authHeaders(),
  });

  return data;
};

// ==============================
// SERVICES
// ==============================

export const getServices = async () => {
  const { data } = await axios.get("/services", {
    headers: authHeaders(),
  });

  return data;
};

export const createService = async (payload) => {
  const { data } = await axios.post("/services", payload, {
    headers: authHeaders(),
  });

  return data;
};

export const updateService = async (id, payload) => {
  const { data } = await axios.put(`/services/${id}`, payload, {
    headers: authHeaders(),
  });

  return data;
};

export const deleteService = async (id) => {
  const { data } = await axios.delete(`/services/${id}`, {
    headers: authHeaders(),
  });

  return data;
};

// ==============================
// PAYMENT METHODS
// ==============================

export const getPaymentMethods = async () => {
  const { data } = await axios.get("/payment-methods", {
    headers: authHeaders(),
  });

  return data;
};

export const createPaymentMethod = async (payload) => {
  const { data } = await axios.post("/payment-methods", payload, {
    headers: authHeaders(),
  });

  return data;
};

export const updatePaymentMethod = async (id, payload) => {
  const { data } = await axios.put(`/payment-methods/${id}`, payload, {
    headers: authHeaders(),
  });

  return data;
};

export const deletePaymentMethod = async (id) => {
  const { data } = await axios.delete(`/payment-methods/${id}`, {
    headers: authHeaders(),
  });

  return data;
};