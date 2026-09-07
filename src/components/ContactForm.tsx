import { useState } from "react";
import { MessageCircle } from "lucide-react";
import logoImage from "../assets/images/logo_h.svg";

export function ContactForm() {
  const [level, setLevel] = useState("jardin-1-2");
  const [shift, setShift] = useState("simple");
  const [name, setName] = useState("");

  const isPrimary = level.startsWith("primaria");

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    if (newLevel.startsWith("primaria")) {
      setShift("completa");
    }
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    
    const levelsMap: Record<string, string> = {
      "jardin-1-2": "Jardín (Sala de 1 y 2)",
      "jardin-3": "Jardín (Sala de 3)",
      "jardin-4": "Jardín (Sala de 4)",
      "jardin-5": "Jardín (Sala de 5)",
      "primaria-1": "1° Grado (Nivel Primario)",
      "primaria-2": "2° Grado (Nivel Primario)",
      "primaria-3": "3° Grado (Nivel Primario)",
      "primaria-4": "4° Grado (Nivel Primario)",
      "primaria-5": "5° Grado (Nivel Primario)",
      "primaria-6": "6° Grado (Nivel Primario)",
    };

    const shiftsMap: Record<string, string> = {
      "simple": "Jornada Simple (8 a 12 hs)",
      "completa": "Jornada Extendida (8 a 16 hs)",
    };

    const currentShift = isPrimary ? "completa" : shift;
    const text = `Hola, mi nombre es ${name}. Me gustaría consultar sobre vacantes para ${levelsMap[level]} en la modalidad de ${shiftsMap[currentShift]}.`;
    const encodedText = encodeURIComponent(text);
    
    // Nivel Inicial: +54 9 221 428-8051, Nivel Primario: +54 9 221 680-7128
    const phoneNumber = isPrimary ? "5492216807128" : "5492214288051";
    const url = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(url, '_blank');
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex justify-center mb-10">
          <img src={logoImage} alt="Los Ceibos" className="h-28 md:h-36 object-contain" />
        </div>

        <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="bg-[#22543d] p-8 md:w-1/3 flex flex-col justify-center text-white">
            <h2 className="text-xl font-bold mb-4">Consulta de Vacantes</h2>
            <p className="text-sm text-green-100 font-light mb-8">
              Completá el formulario para consultar la disponibilidad de vacantes. Te responderemos a la brevedad por WhatsApp.
            </p>
            <div className="space-y-4 text-xs text-green-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#9b1c1c]"></div>
                <span>Cupos Limitados</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white"></div>
                <span>Entrevistas de Admisión</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleWhatsApp} className="p-8 md:w-2/3">
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold text-[#777777] uppercase mb-1">Nombre del Alumno/Tutor</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-[#22543d] outline-none transition-shadow"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="level" className="block text-[10px] font-bold text-[#777777] uppercase mb-1">Nivel Educativo</label>
                  <select
                    id="level"
                    value={level}
                    onChange={(e) => handleLevelChange(e.target.value)}
                    className="w-full border border-gray-200 rounded p-2.5 text-sm outline-none focus:ring-1 focus:ring-[#22543d] transition-shadow bg-white"
                  >
                    <optgroup label="Nivel Inicial">
                      <option value="jardin-1-2">Sala de 1 y 2</option>
                      <option value="jardin-3">Sala de 3</option>
                      <option value="jardin-4">Sala de 4</option>
                      <option value="jardin-5">Sala de 5</option>
                    </optgroup>
                    <optgroup label="Nivel Primario">
                      <option value="primaria-1">1° Grado</option>
                      <option value="primaria-2">2° Grado</option>
                      <option value="primaria-3">3° Grado</option>
                      <option value="primaria-4">4° Grado</option>
                      <option value="primaria-5">5° Grado</option>
                      <option value="primaria-6">6° Grado</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label htmlFor="shift" className="block text-[10px] font-bold text-[#777777] uppercase mb-1">
                    Modalidad {isPrimary && <span className="text-[#9b1c1c] font-normal lowercase">(fija en primaria)</span>}
                  </label>
                  <select
                    id="shift"
                    value={isPrimary ? "completa" : shift}
                    disabled={isPrimary}
                    onChange={(e) => setShift(e.target.value)}
                    className={`w-full border border-gray-200 rounded p-2.5 text-sm outline-none transition-shadow ${
                      isPrimary 
                        ? "bg-gray-100 text-gray-700 cursor-not-allowed border-gray-300" 
                        : "bg-white focus:ring-1 focus:ring-[#22543d]"
                    }`}
                  >
                    {isPrimary ? (
                      <option value="completa">Jornada Extendida (8 a 16 hs)</option>
                    ) : (
                      <>
                        <option value="simple">Jornada Simple (8 a 12 hs)</option>
                        <option value="completa">Jornada Extendida (8 a 16 hs)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#9b1c1c] text-white py-3 rounded font-bold text-sm shadow-md hover:opacity-90 transition-opacity mt-4"
              >
                Solicitar Información
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
