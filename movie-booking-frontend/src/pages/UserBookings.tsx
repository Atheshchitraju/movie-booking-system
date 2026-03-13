import { useState, useEffect } from "react";
import { getUserBookings } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Loader2, Ticket, Film } from "lucide-react";
import { Link } from "react-router-dom";

const UserBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    getUserBookings(user.email)
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen cinema-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        <h1 className="font-display text-4xl text-foreground">MY BOOKINGS</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center">
            <Ticket className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">No bookings yet</p>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">Browse movies</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map(b => (
              <Link key={b.id} to={`/booking/${b.id}`}>
                <div className="cinema-card p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-xl text-foreground">{b.movieName || b.movie?.title || "Movie"}</h3>
                      <p className="text-sm text-muted-foreground">{b.theatreName || b.theatre?.name || ""}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      b.status === "CONFIRMED" ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"
                    }`}>
                      {b.status || "CONFIRMED"}
                    </span>
                  </div>
                  {b.showTime && <p className="text-xs text-muted-foreground">{b.showTime}</p>}
                  {b.seats && (
                    <p className="text-xs text-muted-foreground">
                      Seats: {Array.isArray(b.seats) ? b.seats.map((s: any) => s.seatNumber || s).join(", ") : b.seats}
                    </p>
                  )}
                  {b.totalAmount && <p className="gold-text font-display text-xl">₹{b.totalAmount}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
