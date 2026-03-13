import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMovies } from "@/services/api";
import { Search, Film, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

const Home = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then(res => setMovies(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = movies.filter(m =>
    m.title?.toLowerCase().includes(search.toLowerCase()) ||
    m.genre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen cinema-gradient-bg">
      <Navbar />
      {/* Hero */}
      <section className="border-b border-border bg-card/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl text-foreground">
            NOW <span className="text-primary">SHOWING</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Book your favorite movies in seconds
          </p>
          <div className="mx-auto mt-8 max-w-md relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search movies or genres..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="cinema-card animate-pulse h-80 bg-secondary" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Film className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(movie => (
              <Link key={movie.id} to={`/movies/${movie.id}`}>
                <div className="cinema-card group">
                  <div className="aspect-[2/3] bg-secondary relative overflow-hidden">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Film className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-display text-xl text-foreground leading-tight">{movie.title}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        {movie.genre && <span className="text-xs text-muted-foreground">{movie.genre}</span>}
                        {movie.rating && (
                          <span className="flex items-center gap-1 text-xs text-accent">
                            <Star className="h-3 w-3 fill-accent" />
                            {movie.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
