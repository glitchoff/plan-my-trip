"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackgroundSlider from "../components/BackgroundSlider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
        router.push("/");
    } else {
        alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundSlider />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 border border-white/20 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-indigo-100">Plan your next adventure with us.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-indigo-200/30 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none text-white placeholder-indigo-200/50 transition duration-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
             <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-indigo-100">
                  Password
                </label>
                <a href="#" className="text-xs text-indigo-200 hover:text-white transition-colors">Forgot password?</a>
             </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-indigo-200/30 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none text-white placeholder-indigo-200/50 transition duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-indigo-100">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
             <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-white/20 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Google
             </button>
              <button type="button" className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-white/20 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
             </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-indigo-100">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-white hover:text-indigo-200 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
