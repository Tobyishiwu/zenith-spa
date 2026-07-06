import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaSpa,
  FaConciergeBell,
  FaMoneyCheckAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: <FaCalendarCheck />,
  },
  {
    name: "Therapists",
    path: "/admin/therapists",
    icon: <FaSpa />,
  },
  
  {
    name: "Payment Methods",
    path: "/admin/payment-methods",
    icon: <FaMoneyCheckAlt />,
  },
  
  {
    name: "Settings",
    path: "/admin/settings",
    icon: <FaCog />,
  },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}

      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-xl">

        <div className="px-8 py-8 border-b border-slate-700">

          <h1 className="text-3xl font-bold tracking-wide">
            Zenith Spa
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Admin Dashboard
          </p>

        </div>

        <nav className="flex-1 mt-6">

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-4 transition-all duration-200
                ${
                  isActive
                    ? "bg-amber-500 text-white"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>

              <span>{item.name}</span>
            </NavLink>
          ))}

        </nav>

        <div className="p-6 border-t border-slate-700">

          <button
            className="flex items-center gap-3 text-red-400 hover:text-red-300"
          >
            <FaSignOutAlt />

            Logout
          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="flex-1 flex flex-col">

        {/* Header */}

        <header className="bg-white shadow-sm h-20 px-10 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Zenith Spa Administration
            </h2>

            <p className="text-gray-500 text-sm">
              Manage bookings, therapists and payments
            </p>

          </div>

          <div className="flex items-center gap-6">

            <button className="relative">

              <FaBell
                className="text-2xl text-slate-700"
              />

              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">

                3

              </span>

            </button>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">

                A

              </div>

              <div>

                <p className="font-semibold">
                  Administrator
                </p>

                <p className="text-xs text-gray-500">
                  admin@zenithspa.com
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* Page */}

        <main className="flex-1 p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}