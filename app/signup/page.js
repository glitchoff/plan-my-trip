"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackgroundSlider from "../components/BackgroundSlider";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, you would verify against a database here.
    // For now, we simulate success and redirect to login.
    alert("Account created! Please sign in.");
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BackgroundSlider />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 border border-white/20 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
          <p className="text-indigo-100">Join us and start exploring.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-indigo-100 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-indigo-200/30 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none text-white placeholder-indigo-200/50 transition duration-200"
              placeholder="John Doe"
            />
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-indigo-100 mb-1">
              Password
            </label>
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
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-indigo-100">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-white hover:text-indigo-200 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
