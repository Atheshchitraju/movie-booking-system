import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeatsByShow, lockSeats, confirmBooking } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, Monitor } from "lucide-react";
import { toast } from "sonner";

const SeatSelection = () => {
  const { showId } = useParams<{ showId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!showId) return;
    getSeatsByShow(showId)
      .then(res => setSeats(res.data))
      .catch(() => toast.error("Failed to load seats"))
      .finally(() => setLoading(false));
  }, [showId]);

  const toggleSeat = (seatId: string, isBooked: boolean) => {
    if (isBooked || locked) return;
    setSelected(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleLock = async () => {
    if (!showId || !user?.email || selected.length === 0) return;
    setBooking(true);
    try {
      await lockSeats({ showId, seatIds: selected, userEmail: user.email });
      setLocked(true);
      toast.success("Seats locked! Proceed to payment.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to lock seats");
    } finally {
      setBooking(false);
    }
  };

  const handleConfirm = async () => {
    if (!showId || !user?.email) return;
    setBooking(true);
    try {
      const paymentId = "PAY_" + Date.now();
      const res = await confirmBooking({ showId, seatIds: selected, userEmail: user.email, paymentId });
      toast.success("Booking confirmed!");
      navigate(`/booking/${res.data.id || res.data.bookingId || "success"}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  // Group seats by row
  const rows = seats.reduce((acc: Record<string, any[]>, seat) => {
    const row = seat.row || seat.seatNumber?.charAt(0) || "A";
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const totalPrice = selected.length * (seats[0]?.price || 0);

  return (
    <div className="min-h-screen cinema-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        <h1 className="font-display text-4xl text-foreground text-center">SELECT YOUR SEATS</h1>

        {/* Screen indicator */}
        <div className="mt-10 flex flex-col items-center">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Monitor className="h-4 w-4" /> SCREEN
          </div>
          <div className="h-1 w-64 rounded-full bg-primary/40 mb-10" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : seats.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No seats available</p>
        ) : (
          <>
            {/* Seat Grid */}
            <div className="flex flex-col items-center gap-2">
              {Object.entries(rows).map(([row, rowSeats]) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs text-muted-foreground font-medium">{row}</span>
                  <div className="flex gap-1.5">
                    {(rowSeats as any[])
                      .sort((a, b) => (a.seatNumber || a.number || "").localeCompare(b.seatNumber || b.number || ""))
                      .map(seat => {
                        const id = seat.id?.toString();
                        const isBooked = seat.booked || seat.status === "BOOKED";
                        const isSelected = selected.includes(id);
                        return (
                          <button
                            key={id}
                            onClick={() => toggleSeat(id, isBooked)}
                            className={`h-8 w-8 rounded-sm text-xs font-medium transition-all ${
                              isBooked
                                ? "seat-booked"
                                : isSelected
                                ? "seat-selected"
                                : "seat-available"
                            }`}
                            disabled={isBooked}
                            title={seat.seatNumber || seat.number}
                          >
                            {seat.seatNumber?.slice(1) || seat.number || ""}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm seat-available" /> Available
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm seat-selected" /> Selected
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm seat-booked" /> Booked
              </div>
            </div>

            {/* Booking Panel */}
            {selected.length > 0 && (
              <div className="mt-10 cinema-card mx-auto max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">{selected.length} seat(s) selected</span>
                  {totalPrice > 0 && <span className="gold-text font-display text-3xl">₹{totalPrice}</span>}
                </div>
                {!locked ? (
                  <Button onClick={handleLock} disabled={booking} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {booking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lock Seats & Proceed"}
                  </Button>
                ) : (
                  <Button onClick={handleConfirm} disabled={booking} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {booking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Pay"}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
