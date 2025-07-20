"use client";

import { useEffect, useState } from "react";

interface CryptoLoaderProps {
  logo?: string; // Allow undefined
  loading: boolean;
}

export default function CryptoLoader({ logo, loading }: CryptoLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(100); // Complete the circle when loading is done
      return;
    }

    // Animate progress only while loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0; // Loop animation while loading
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [loading]);

  // Calculate stroke-dashoffset for the circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative w-24 h-24">
        {/* Crypto Logo */}
        <img
          src={logo || "https://via.placeholder.com/40?text=Crypto"}
          alt="Crypto logo"
          className="w-16 h-16 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40?text=Crypto")}
        />
        {/* Circular Progress Ring */}
        <svg className="w-24 h-24" viewBox="0 0 100 100">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className="text-accent"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
      </div>
    </div>
  );
}