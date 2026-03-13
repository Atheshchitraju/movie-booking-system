import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovie, getShowsByMovie } from "@/services/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Film, Clock, MapPin, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";

const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    Promise.all([getMovie(movieId), getShowsByMovie(movieId)])
      .then(([mRes, sRes]) => {
        setMovie(mRes.data);
        setShows(sRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen cinema-gradient-bg">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen cinema-gradient-bg">
        <Navbar />
        <div className="py-32 text-center text-muted-foreground">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cinema-gradient-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        {/* Movie Info */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-72 shrink-0">
            <div className="aspect-[2/3] rounded-lg bg-secondary overflow-hidden">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Film className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-5xl text-foreground">{movie.title}</h1>
            <div className="mt-3 flex flex-wrap gap-3">
              {movie.genre && (
                <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  {movie.genre}
                </span>
              )}
              {movie.duration && (
                <span className="flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {movie.duration} min
                </span>
              )}
              {movie.language && (
                <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  {movie.language}
                </span>
              )}
            </div>
            {movie.description && (
              <p className="mt-6 leading-relaxed text-muted-foreground">{movie.description}</p>
            )}
          </div>
        </div>

        {/* Shows */}
        <div className="mt-12">
          <h2 className="font-display text-3xl text-foreground mb-6">AVAILABLE SHOWS</h2>
          {shows.length === 0 ? (
            <p className="text-muted-foreground">No shows available for this movie.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shows.map(show => (
                <Link key={show.id} to={`/seats/${show.id}`}>
                  <div className="cinema-card p-5 flex flex-col gap-3 cursor-pointer">
                    <div className="flex items-center gap-2 text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{show.theatreName || show.theatre?.name || "Theatre"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {show.showTime
                          ? format(new Date(show.showTime), "PPp")
                          : show.date
                          ? `${show.date} ${show.time || ""}`
                          : "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="gold-text font-display text-2xl">₹{show.ticketPrice || show.price || "N/A"}</span>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
