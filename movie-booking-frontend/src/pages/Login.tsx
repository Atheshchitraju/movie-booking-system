// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { loginUser } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Film, Loader2 } from "lucide-react";
// import { toast } from "sonner";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await loginUser({ email, password });

//       console.log("Login response:", res.data);

//       login(res.data);
//       toast.success("Welcome back!");

//       if (res.data.role === "ADMIN") {
//         navigate("/admin");
//       } else {
//         navigate("/");
//       }
//     } catch (err: any) {
//       console.error("Login error:", err);

//       if (err.response) {
//         toast.error(err.response.data || "Login failed");
//       } else {
//         toast.error("Server not reachable");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center cinema-gradient-bg px-4">
//       <div className="w-full max-w-md animate-fade-in">
//         <div className="mb-8 text-center">
//           <Film className="mx-auto h-12 w-12 text-primary" />
//           <h1 className="mt-4 font-display text-4xl text-foreground">
//             WELCOME BACK
//           </h1>
//           <p className="mt-2 text-muted-foreground">
//             Sign in to book your next movie
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="cinema-card p-8 space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               required
//               className="bg-secondary border-border"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//               className="bg-secondary border-border"
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
//           >
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
//           </Button>

//           <p className="text-center text-sm text-muted-foreground">
//             Don't have an account?{" "}
//             <Link to="/register" className="text-primary hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      console.log("FULL RESPONSE:", res);
      console.log("RESPONSE DATA:", res.data);
      console.log("USER ROLE:", res.data.role);

      login(res.data);

      console.log("LOGIN FUNCTION EXECUTED");

      toast.success("Welcome back!");

      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      if (err.response) {
        console.log("ERROR RESPONSE:", err.response);
        console.log("ERROR DATA:", err.response.data);
        toast.error(
          err.response?.data?.message ||
            err.response?.data ||
            "Login failed"
        );
      } else {
        toast.error("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center cinema-gradient-bg px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <Film className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 font-display text-4xl text-foreground">
            WELCOME BACK
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to book your next movie
          </p>
        </div>

        <form onSubmit={handleSubmit} className="cinema-card p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-secondary border-border"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;