import { useState, useEffect } from "react";
import { getShows, createShow, updateShow, deleteShow, getMovies, getTheatres } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyShow = { movieId: "", theatreId: "", showTime: "", ticketPrice: "" };

const ManageShows = () => {
  const [shows, setShows] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [theatres, setTheatres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyShow);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadShows = async () => {
    try {
      const res = await getShows();
      setShows(res.data || []);
    } catch (error) {
      console.error("GET SHOWS ERROR:", error);
      setShows([]);
    }
  };

  const loadMovies = async () => {
    try {
      const res = await getMovies();
      setMovies(res.data || []);
    } catch (error) {
      console.error("GET MOVIES ERROR:", error);
      setMovies([]);
    }
  };

  const loadTheatres = async () => {
    try {
      const res = await getTheatres();
      setTheatres(res.data || []);
    } catch (error) {
      console.error("GET THEATRES ERROR:", error);
      setTheatres([]);
    }
  };

  const load = async () => {
    setLoading(true);
    await Promise.allSettled([loadShows(), loadMovies(), loadTheatres()]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.movieId || !form.theatreId || !form.showTime || !form.ticketPrice) {
      toast.error("Please fill all fields");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        movieId: Number(form.movieId),
        theaterId: Number(form.theatreId),
        showTime: form.showTime,
        price: Number(form.ticketPrice),
      };

      console.log("SHOW PAYLOAD:", payload);

      if (editId) {
        await updateShow(editId, payload);
        toast.success("Show updated");
      } else {
        await createShow(payload);
        toast.success("Show created");
      }

      setOpen(false);
      setForm(emptyShow);
      setEditId(null);
      await loadShows();
    } catch (error) {
      console.error("SAVE SHOW ERROR:", error);
      toast.error("Failed to save show");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this show?")) return;

    try {
      await deleteShow(id);
      toast.success("Show deleted");
      await loadShows();
    } catch (error) {
      console.error("DELETE SHOW ERROR:", error);
      toast.error("Failed to delete");
    }
  };

  const openEdit = (s: any) => {
    setForm({
      movieId: s.movie?.id?.toString() || s.movieId?.toString() || "",
      theatreId: s.theater?.id?.toString() || s.theatre?.id?.toString() || s.theatreId?.toString() || "",
      showTime: s.showTime || "",
      ticketPrice: (s.price ?? s.ticketPrice ?? "").toString(),
    });
    setEditId(s.id?.toString());
    setOpen(true);
  };

  const openNew = async () => {
    setForm(emptyShow);
    setEditId(null);
    await Promise.allSettled([loadMovies(), loadTheatres()]);
    setOpen(true);
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">SHOWS</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <Plus className="h-4 w-4" /> Add Show
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {editId ? "EDIT" : "ADD"} SHOW
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Movie</Label>
                <Select value={form.movieId} onValueChange={(v) => update("movieId", v)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select movie" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {movies.length > 0 ? (
                      movies.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">No movies found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Theatre</Label>
                <Select value={form.theatreId} onValueChange={(v) => update("theatreId", v)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select theatre" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {theatres.length > 0 ? (
                      theatres.map((t) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">No theatres found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Show Time</Label>
                <Input
                  type="datetime-local"
                  value={form.showTime}
                  onChange={(e) => update("showTime", e.target.value)}
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <Label>Ticket Price (₹)</Label>
                <Input
                  type="number"
                  value={form.ticketPrice}
                  onChange={(e) => update("ticketPrice", e.target.value)}
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Movie</th>
                <th className="pb-3 font-medium">Theatre</th>
                <th className="pb-3 font-medium">Show Time</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.length > 0 ? (
                shows.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 text-foreground font-medium">
                      {s.movieName || s.movie?.title || "—"}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {s.theatreName || s.theater?.name || s.theatre?.name || "—"}
                    </td>
                    <td className="py-3 text-muted-foreground">{s.showTime || "—"}</td>
                    <td className="py-3 text-accent">₹{s.price ?? s.ticketPrice ?? "—"}</td>
                    <td className="py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(s)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(s.id.toString())}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No shows found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageShows;