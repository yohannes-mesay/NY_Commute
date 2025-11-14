import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
      <div
        className="pointer-events-none fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">404</h1>
        <p className="text-base sm:text-lg text-gray-300 mb-6">Oops! Page not found</p>
        <a href="/" className="inline-block text-blue-400 hover:text-blue-300 underline text-sm sm:text-base">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
