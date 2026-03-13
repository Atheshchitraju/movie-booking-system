import { useState, useEffect } from "react";
import { getTheatres, createTheatre, updateTheatre, deleteTheatre } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const emptyTheatre = { name: "", location: "", totalSeats: "" };

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyTheatre);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    getTheatres().then(r => setTheatres(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, totalSeats: Number(form.totalSeats) || 0 };
      if (editId) {
        await updateTheatre(editId, payload);
        toast.success("Theatre updated");
      } else {
        await createTheatre(payload);
        toast.success("Theatre created");
      }
      setOpen(false);
      setForm(emptyTheatre);
      setEditId(null);
      load();
    } catch {
      toast.error("Failed to save theatre");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this theatre?")) return;
    try {
      await deleteTheatre(id);
      toast.success("Theatre deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openEdit = (t: any) => {
    setForm({ name: t.name || "", location: t.location || "", totalSeats: t.totalSeats?.toString() || "" });
    setEditId(t.id?.toString());
    setOpen(true);
  };

  const openNew = () => { setForm(emptyTheatre); setEditId(null); setOpen(true); };
  const update = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-foreground">THEATRES</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" /> Add Theatre
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-display text-2xl">{editId ? "EDIT" : "ADD"} THEATRE</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={e => update("name", e.target.value)} required className="bg-secondary border-border" /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => update("location", e.target.value)} className="bg-secondary border-border" /></div>
              <div><Label>Total Seats</Label><Input type="number" value={form.totalSeats} onChange={e => update("totalSeats", e.target.value)} className="bg-secondary border-border" /></div>
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
            <thead><tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Seats</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr></thead>
            <tbody>
              {theatres.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 text-foreground font-medium">{t.name}</td>
                  <td className="py-3 text-muted-foreground">{t.location}</td>
                  <td className="py-3 text-muted-foreground">{t.totalSeats ?? t.total_seats ?? 0}</td>  
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(t)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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

export default ManageTheatres;
