import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-teal-50 p-4 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-teal-200 opacity-50 animate-pulse"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 rounded-full bg-teal-300 opacity-40 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-teal-100 opacity-30 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-60 right-1/4 w-12 h-12 rounded-full bg-teal-200 opacity-60 animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>

      <div className="text-center max-w-3xl mx-auto z-10">
        {/* 404 Numbers with improved alignment */}
        <div className="flex justify-center mb-8 relative h-48 md:h-64">
          <div className="text-9xl md:text-[12rem] font-bold text-teal-500 animate-bounce">
            4
          </div>
          <div
            className="text-9xl md:text-[12rem] font-bold text-teal-500 animate-bounce mx-2 md:mx-4"
            style={{ animationDelay: "0.2s" }}
          >
            0
          </div>
          <div
            className="text-9xl md:text-[12rem] font-bold text-teal-500 animate-bounce"
            style={{ animationDelay: "0.4s" }}
          >
            4
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Page Not Found
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Pulsing circle animation */}
        <div className="relative h-40 mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-teal-100 animate-ping opacity-75"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-teal-200 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-teal-300"></div>
          </div>
        </div>

        {/* Home button with hover effect */}
     
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-teal-100 to-transparent"></div>
    </div>
  );
}
