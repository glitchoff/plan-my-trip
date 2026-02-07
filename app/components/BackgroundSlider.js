"use client";

import { useState } from "react";
import Image from "next/image";

const images = [
  "https://images.unsplash.com/photo-1768326775653-22d8bdd42b0c?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1769263077636-0681e8f2e363?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1768813282031-2aec62eee8b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

export default function BackgroundSlider() {
  const [randomIndex] = useState(() => Math.floor(Math.random() * images.length));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={images[randomIndex]}
        alt="Hero Background"
        fill
        className="object-cover"
        priority
        quality={80}
        unoptimized
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
