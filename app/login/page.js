import Link from "next/link";
import BackgroundSlider from "../components/BackgroundSlider";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundSlider />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 border border-white/20 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-indigo-100">Plan your next adventure with us.</p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-sm text-indigo-100">
          Don't have an account?{" "}
        </p>
      </div>
    </div>
  );
}
