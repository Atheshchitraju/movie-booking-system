import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Film, Building2, Clapperboard, Ticket } from "lucide-react";

const tabs = [
  { path: "/admin/movies", label: "Movies", icon: Film },
  { path: "/admin/theatres", label: "Theatres", icon: Building2 },
  { path: "/admin/shows", label: "Shows", icon: Clapperboard },
  { path: "/admin/bookings", label: "Bookings", icon: Ticket },
];

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen cinema-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl text-foreground mb-6">ADMIN PANEL</h1>
        <div className="flex gap-2 border-b border-border pb-4 mb-8 overflow-x-auto">
          {tabs.map(tab => {
            const active = location.pathname.startsWith(tab.path);
            return (
              <Link key={tab.path} to={tab.path}>
                <button className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}>
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              </Link>
            );
          })}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
