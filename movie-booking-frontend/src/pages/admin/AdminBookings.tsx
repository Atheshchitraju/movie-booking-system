import { useState, useEffect } from "react";
import { getAllBookings } from "@/services/api";
import { Loader2, Ticket } from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBookings()
      .then((r) => setBookings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl text-foreground mb-6">ALL BOOKINGS</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-20 text-center">
          <Ticket className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">No bookings yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Movie</th>
                <th className="pb-3 font-medium">Theatre</th>
                <th className="pb-3 font-medium">Seats</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 text-muted-foreground">#{b.id}</td>

                  <td className="py-3 text-foreground">
                    {b.userEmail || "—"}
                  </td>

                  <td className="py-3 text-foreground font-medium">
                    {b.show?.movie?.title || "—"}
                  </td>

                  <td className="py-3 text-muted-foreground">
                    {b.show?.theater?.name || "—"}
                  </td>

                  <td className="py-3 text-muted-foreground">
                    {b.seatsBooked || "—"}
                  </td>

                  <td className="py-3 text-accent">
                    ₹{b.totalAmount ?? "—"}
                  </td>

                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        b.paymentStatus === "SUCCESS"
                          ? "bg-green-500/10 text-green-400"
                          : b.paymentStatus === "PENDING"
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {b.paymentStatus || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;