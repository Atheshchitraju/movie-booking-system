import { useState, useEffect } from "react";
import { getMovies, createMovie, updateMovie, deleteMovie } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyMovie = { title: "", genre: "", duration: "", language: "", description: "", posterUrl: "" };

const ManageMovies = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyMovie);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    getMovies().then(r => setMovies(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, duration: Number(form.duration) || 0 };
      if (editId) {
        await updateMovie(editId, payload);
        toast.success("Movie updated");
      } else {
        await createMovie(payload);
        toast.success("Movie created");
      }
      setOpen(false);
      setForm(emptyMovie);
      setEditId(null);
      load();
    } catch {
      toast.error("Failed to save movie");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this movie?")) return;
    try {
      await deleteMovie(id);
      toast.success("Movie deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openEdit = (movie: any) => {
    setForm({
      title: movie.title || "",
      genre: movie.genre || "",
      duration: movie.duration?.toString() || "",
      language: movie.language || "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
    });
    setEditId(movie.id?.toString());
    setOpen(true);
  };

  const openNew = () => {
    setForm(emptyMovie);
    setEditId(null);
    setOpen(true);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">MOVIES</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" /> Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">{editId ? "EDIT" : "ADD"} MOVIE</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={e => update("title", e.target.value)} required className="bg-secondary border-border" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Genre</Label><Input value={form.genre} onChange={e => update("genre", e.target.value)} className="bg-secondary border-border" /></div>
                <div><Label>Duration (min)</Label><Input type="number" value={form.duration} onChange={e => update("duration", e.target.value)} className="bg-secondary border-border" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Language</Label><Input value={form.language} onChange={e => update("language", e.target.value)} className="bg-secondary border-border" /></div>
                <div><Label>Poster URL</Label><Input value={form.posterUrl} onChange={e => update("posterUrl", e.target.value)} className="bg-secondary border-border" /></div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => update("description", e.target.value)} className="bg-secondary border-border" /></div>
              <Button type="submit" disabled={saving} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Genre</th>
                <th className="pb-3 font-medium">Duration</th>
                <th className="pb-3 font-medium">Language</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(m => (
                <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-foreground font-medium">{m.title}</td>
                  <td className="py-3 text-muted-foreground">{m.genre}</td>
                  <td className="py-3 text-muted-foreground">{m.duration} min</td>
                  <td className="py-3 text-muted-foreground">{m.language}</td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(m)} className="text-muted-foreground hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default ManageMovies;
