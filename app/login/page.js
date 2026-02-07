import Link from "next/link";
import { Suspense } from "react";
import BackgroundSlider from "../components/BackgroundSlider";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundSlider />

      <div className="relative z-10 w-full max-w-md p-8 bg-base-100/10 border border-base-content/20 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-accent">Plan your next adventure with us.</p>
        </div>

        <Suspense fallback={<div className="text-center p-4">Loading login...</div>}>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-sm text-base-content/70">
          Don't have an account?{" "}
        </p>
      </div>
    </div>
  );
}
