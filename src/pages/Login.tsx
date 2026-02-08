import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParticleBackground } from "@/components/ParticleBackground";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Login successful!");
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      } else {
        await register(email, password, name);
        toast.success("Account created successfully!");
        setEmail("");
        setPassword("");
        setName("");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container min-h-screen flex items-center justify-center p-4">
      <ParticleBackground className="fixed inset-0 -z-10 opacity-40" />

      {/* Decorative blobs */}
      <div className="blur-blob w-96 h-96 bg-primary/20 -top-48 -left-48" />
      <div className="blur-blob w-80 h-80 bg-accent/20 -bottom-40 -right-40" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center glow-effect overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
              <img src="/innerglow.png" alt="InnerGlow" className="w-full h-full object-cover scale-125" />
            </div>
            <span className="font-display font-bold text-2xl">InnerGlow</span>
          </Link>

          {/* Toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${isLogin ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${!isLogin ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {/* Name (Sign up only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl py-6"
                  autoComplete="off"
                />
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl py-6 pl-12"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl py-6 pl-12 pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>


            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-xl py-6 text-lg font-semibold glow-effect"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
              {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;