import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./layouts/Layout";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Therapists from "./pages/Therapists";
import TherapistDetails from "./pages/TherapistDetails";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import TrackBooking from "./pages/TrackBooking";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminLayout from "./admin/layouts/AdminLayout";

import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import Bookings from "./admin/pages/Bookings";
import AdminTherapists from "./admin/pages/Therapists";
import AdminPaymentMethods from "./admin/pages/PaymentMethods";
import AdminSettings from "./admin/pages/Settings";

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/therapists/:slug" element={<TherapistDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/track-booking" element={<TrackBooking />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="therapists" element={<AdminTherapists />} />
          <Route path="payment-methods" element={<AdminPaymentMethods />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


