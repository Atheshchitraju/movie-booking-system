import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getBookingById } from "@/services/api";
import Navbar from "@/components/Navbar";
import { CheckCircle, Loader2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookingConfirmation = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId || bookingId === "success") {
          setLoading(false);
          return;
        }

        const res = await getBookingById(bookingId);
        setBooking(res.data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const formatShowTime = (showTime: string) => {
    if (!showTime) return "";
    try {
      return new Date(showTime).toLocaleString();
    } catch {
      return showTime;
    }
  };

  const getSeatDisplay = () => {
    if (!booking?.seats) return "N/A";

    if (Array.isArray(booking.seats)) {
      return booking.seats.map((s: any) => s.seatNumber || s).join(", ");
    }

    return booking.seats;
  };

  return (
    <div className="min-h-screen cinema-gradient-bg">
      <Navbar />

      <div className="container mx-auto px-4 py-20 animate-fade-in">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500" />

          <h1 className="mt-6 font-display text-5xl text-foreground">
            BOOKING CONFIRMED
          </h1>

          <p className="mt-3 text-muted-foreground">
            Your tickets have been booked successfully!
          </p>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : booking ? (
            <div className="mt-8 cinema-card p-6 text-left space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Film className="h-5 w-5 text-primary" />
                <span className="text-foreground font-semibold text-lg">
                  Booking Details
                </span>
              </div>

              {booking.id && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="text-foreground font-medium">{booking.id}</span>
                </div>
              )}

              {booking.movieName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Movie</span>
                  <span className="text-foreground font-medium">
                    {booking.movieName}
                  </span>
                </div>
              )}

              {booking.theatreName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theatre</span>
                  <span className="text-foreground">{booking.theatreName}</span>
                </div>
              )}

              {booking.showTime && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Show Time</span>
                  <span className="text-foreground">
                    {formatShowTime(booking.showTime)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground">{getSeatDisplay()}</span>
              </div>

              {booking.userEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User</span>
                  <span className="text-foreground">{booking.userEmail}</span>
                </div>
              )}

              {booking.paymentId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="text-foreground">{booking.paymentId}</span>
                </div>
              )}

              {booking.paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="text-green-500 font-medium">
                    {booking.paymentStatus}
                  </span>
                </div>
              )}

              {booking.totalAmount !== undefined && booking.totalAmount !== null && (
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-muted-foreground">Total</span>
                  <span className="gold-text font-display text-2xl">
                    ₹{booking.totalAmount}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 cinema-card p-6 text-center">
              <p className="text-foreground font-medium">
                Booking completed successfully.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Detailed booking information is not available right now.
              </p>
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/my-bookings">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-secondary"
              >
                My Bookings
              </Button>
            </Link>

            <Link to="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Movies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;