import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Preloader } from "./Preloader";
import { 
  Lock, 
  GraduationCap, 
  Sparkles, 
  BookOpen,
  Bell, 
  Images, 
  MessageCircle, 
  X, 
  MapPin, 
  Phone,
  ArrowUpRight,
  Instagram
} from "lucide-react";
import logoImage from "../assets/images/logo_h.svg";

export function Layout() {
  const [activeSection, setActiveSection] = useState("");
  const [hasAnnouncements, setHasAnnouncements] = useState<boolean>(() => {
    try {
      return localStorage.getItem("ceibos_has_announcements") === "true";
    } catch {
      return false;
    }
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWaMenuOpen, setIsWaMenuOpen] = useState(false);
  const [isMobileContactSheetOpen, setIsMobileContactSheetOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "announcements"), limit(1));
    let isMounted = true;

    // Minimum display time for preloader (450ms) to ensure smooth layout initialization
    const minTimer = new Promise((resolve) => setTimeout(resolve, 450));
    
    // Safety max timeout (800ms)
    const safetyTimeout = setTimeout(() => {
      if (isMounted) setIsInitialLoading(false);
    }, 800);

    const unsub = onSnapshot(
      q, 
      (snapshot) => {
        const exists = !snapshot.empty;
        setHasAnnouncements(exists);
        try {
          localStorage.setItem("ceibos_has_announcements", String(exists));
        } catch {
          // ignore storage quota error
        }

        minTimer.then(() => {
          if (isMounted) {
            clearTimeout(safetyTimeout);
            setIsInitialLoading(false);
          }
        });
      }, 
      (error) => {
        console.error("Error loading announcements:", error);
        minTimer.then(() => {
          if (isMounted) setIsInitialLoading(false);
        });
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      unsub();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle compact header on scroll
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ["institucional", "propuesta", "anuncios", "galeria", "contacto"];
      const scrollPosition = window.scrollY + 140; // Offset for header
      let currentSection = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (top <= scrollPosition && top + height > scrollPosition) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getNavLinkClass = (section: string) => 
    `px-4 py-2 rounded-lg font-bold transition-all duration-200 active:scale-95 ${
      activeSection === section 
        ? "bg-[#22543d] text-white shadow-sm" 
        : "text-[#555555] hover:text-[#22543d] hover:bg-green-50/80"
    }`;

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#333333] bg-[#f9fafb] pb-16 md:pb-0">
      {/* Brand Preloader */}
      <Preloader isLoading={isInitialLoading} />

      {/* Top Header - Responsive & Shrinks on scroll */}
      <header 
        className={`bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? "h-16 shadow-md" : "h-20 md:h-24 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-2 transition-transform duration-300 hover:opacity-90"
            aria-label="Ir al inicio"
          >
            <img 
              src={logoImage} 
              alt="Los Ceibos" 
              className={`object-contain transition-all duration-300 ${
                isScrolled ? "h-10 md:h-12" : "h-12 md:h-16"
              }`} 
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm lg:text-base">
            <button 
              onClick={() => handleNavClick("institucional")} 
              className={getNavLinkClass("institucional")}
            >
              Institucional
            </button>
            <button 
              onClick={() => handleNavClick("propuesta")} 
              className={getNavLinkClass("propuesta")}
            >
              Propuesta
            </button>
            <button 
              onClick={() => handleNavClick("galeria")} 
              className={getNavLinkClass("galeria")}
            >
              Galería
            </button>
            <button 
              onClick={() => handleNavClick("contacto")} 
              className={getNavLinkClass("contacto")}
            >
              Contacto
            </button>
            {hasAnnouncements && (
              <button 
                onClick={() => handleNavClick("anuncios")} 
                className={`${getNavLinkClass("anuncios")} relative`}
              >
                Anuncios
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </button>
            )}
          </nav>

          {/* Mobile Top Quick Action */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileContactSheetOpen(true)}
              className="bg-[#22543d] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contactar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="h-auto md:h-20 py-4 bg-white border-t border-gray-100 flex flex-col md:flex-row items-center justify-between px-8 text-[10px] text-[#777777] font-medium flex-shrink-0 gap-2 md:gap-0">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1 md:mb-0">
          <span>© {new Date().getFullYear()} Instituto Educativo Los Ceibos. Todos los derechos reservados.</span>
          <span className="hidden md:inline text-gray-300">•</span>
          <span className="text-gray-400">
            By{" "}
            <a 
              href="https://unke.com.ar/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-[#22543d] font-semibold transition-colors hover:underline"
            >
              unke.com.ar
            </a>
          </span>
          <Link to="/admin" className="opacity-0 hover:opacity-100 p-1 text-gray-400 hover:text-[#333333] transition-all duration-300" aria-label="Acceso Admin">
            <Lock className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 items-center pr-0 md:pr-24">
          <a href="mailto:administracion@colegiolosceiboslp.com.ar" className="hover:text-[#22543d] transition-colors">
            Mail: administracion@colegiolosceiboslp.com.ar
          </a>
          <span className="hidden md:inline text-gray-300">•</span>
          <a 
            href="https://www.instagram.com/colegio.los.ceibos" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#E1306C] transition-colors flex items-center gap-1.5 font-semibold text-gray-600"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
            <span>@colegio.los.ceibos</span>
          </a>
        </div>
      </footer>

      {/* Desktop Floating WhatsApp Button */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col items-end gap-2">
        {isWaMenuOpen && (
          <div className="flex flex-col gap-2 mb-1 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <a
              href="https://wa.me/5492214288051?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20nivel%20Jard%C3%ADn."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold text-[#22543d] border border-green-100 hover:bg-green-50 transition-colors flex items-center gap-2 whitespace-nowrap"
              onClick={() => setIsWaMenuOpen(false)}
            >
              🎨 Consulta Jardín
            </a>
            <a
              href="https://wa.me/5492216807128?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20nivel%20Primaria."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold text-[#9b1c1c] border border-red-100 hover:bg-red-50 transition-colors flex items-center gap-2 whitespace-nowrap"
              onClick={() => setIsWaMenuOpen(false)}
            >
              📚 Consulta Primaria
            </a>
          </div>
        )}
        {!isWaMenuOpen && (
          <div className="bg-white px-3 py-1 rounded shadow-lg text-[10px] font-bold text-[#22543d] border border-green-100">
            ¡Hola! Consultá por WhatsApp
          </div>
        )}
        <button
          onClick={() => setIsWaMenuOpen(!isWaMenuOpen)}
          className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
          aria-label="Contactar por WhatsApp"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>

      {/* MOBILE APP-LIKE BOTTOM NAVIGATION BAR */}
      <nav 
        aria-label="Navegación móvil"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around"
      >
        <button
          onClick={() => handleNavClick("institucional")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
            activeSection === "institucional"
              ? "text-[#22543d] font-bold scale-105"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className={`p-1 rounded-lg ${activeSection === "institucional" ? "bg-green-100/70" : ""}`}>
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Colegio</span>
        </button>

        <button
          onClick={() => handleNavClick("propuesta")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
            activeSection === "propuesta"
              ? "text-[#22543d] font-bold scale-105"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className={`p-1 rounded-lg ${activeSection === "propuesta" ? "bg-green-100/70" : ""}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Propuesta</span>
        </button>

        <button
          onClick={() => handleNavClick("galeria")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
            activeSection === "galeria"
              ? "text-[#22543d] font-bold scale-105"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className={`p-1 rounded-lg ${activeSection === "galeria" ? "bg-green-100/70" : ""}`}>
            <Images className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Galería</span>
        </button>

        <button
          onClick={() => setIsMobileContactSheetOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
            isMobileContactSheetOpen || activeSection === "contacto"
              ? "text-[#22543d] font-bold scale-105"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className={`p-1 rounded-lg bg-emerald-600 text-white shadow-sm`}>
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-semibold text-[#22543d] tracking-tight">WhatsApp</span>
        </button>

        {hasAnnouncements && (
          <button
            onClick={() => handleNavClick("anuncios")}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative ${
              activeSection === "anuncios"
                ? "text-[#22543d] font-bold scale-105"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <div className={`p-1 rounded-lg ${activeSection === "anuncios" ? "bg-green-100/70" : ""}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-3 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Anuncios</span>
          </button>
        )}
      </nav>

      {/* MOBILE BOTTOM SHEET FOR CONTACT & APP ACTIONS */}
      {isMobileContactSheetOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 md:hidden">
          <div 
            className="w-full bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[#22543d]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Contacto Los Ceibos</h3>
                  <p className="text-xs text-gray-500">Elegí tu canal de atención directa</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileContactSheetOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                aria-label="Cerrar menú"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="https://wa.me/5492214288051?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20nivel%20Jard%C3%ADn."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileContactSheetOpen(false)}
                className="flex items-center justify-between p-3.5 bg-emerald-50/70 hover:bg-emerald-100/80 rounded-2xl border border-emerald-200/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎨</span>
                  <div className="text-left">
                    <div className="font-bold text-sm text-[#22543d]">Consulta Nivel Jardín</div>
                    <div className="text-xs text-gray-600">Sala de 1, 2, 3, 4 y 5 años</div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-700" />
              </a>

              <a
                href="https://wa.me/5492216807128?text=Hola!%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20nivel%20Primaria."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileContactSheetOpen(false)}
                className="flex items-center justify-between p-3.5 bg-red-50/70 hover:bg-red-100/80 rounded-2xl border border-red-200/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <div className="text-left">
                    <div className="font-bold text-sm text-[#9b1c1c]">Consulta Nivel Primario</div>
                    <div className="text-xs text-gray-600">Jornada Extendida e Idiomas</div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-red-700" />
              </a>

              <a
                href="https://www.instagram.com/colegio.los.ceibos"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileContactSheetOpen(false)}
                className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 rounded-2xl border border-pink-200 text-xs font-bold text-[#E1306C] transition-all"
              >
                <Instagram className="w-4 h-4 text-[#E1306C]" />
                <span>Instagram @colegio.los.ceibos</span>
              </a>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href="https://maps.app.goo.gl/uX3L3gP7sF62N66r7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 border border-gray-200 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[#9b1c1c]" />
                  <span>Cómo llegar</span>
                </a>

                <button
                  onClick={() => {
                    setIsMobileContactSheetOpen(false);
                    handleNavClick("contacto");
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 border border-gray-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#22543d]" />
                  <span>Formulario</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

