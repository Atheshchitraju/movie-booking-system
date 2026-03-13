import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="flex min-h-screen items-center justify-center cinema-gradient-bg px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <Film className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 font-display text-4xl text-foreground">CREATE ACCOUNT</h1>
          <p className="mt-2 text-muted-foreground">Join CineBook and start booking</p>
        </div>
        <form onSubmit={handleSubmit} className="cinema-card p-8 space-y-5">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Doe" required className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" required className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="••••••••" required className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="flex gap-3">
              {["USER", "ADMIN"].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => update("role", role)}
                  className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-all ${
                    form.role === role
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
