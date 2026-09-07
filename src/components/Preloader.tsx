import { useEffect, useState } from "react";
import logoImage from "../assets/images/logo_h.svg";

interface PreloaderProps {
  isLoading: boolean;
}

export function Preloader({ isLoading }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Allow fade-out animation to complete smoothly
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] bg-[#f9fafb] flex flex-col items-center justify-center transition-all duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none scale-[1.02]" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 px-6 max-w-sm text-center animate-in fade-in zoom-in-95 duration-400">
        <img
          src={logoImage}
          alt="Instituto Educativo Los Ceibos"
          className="h-20 md:h-24 object-contain drop-shadow-sm"
        />

        {/* Elegant loading progress bar */}
        <div className="w-44 h-1.5 bg-gray-200/80 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute inset-y-0 bg-[#22543d] rounded-full animate-indeterminate" />
        </div>

        <p className="text-xs text-gray-500 font-medium tracking-wide">
          Cargando experiencia institucional...
        </p>
      </div>
    </div>
  );
}
