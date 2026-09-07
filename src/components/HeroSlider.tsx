import videoHero from "../assets/videos/video_hero.mp4";

export function HeroSlider() {
  return (
    <div className="relative overflow-hidden group h-[600px] md:h-[700px]">
      <video
        src={videoHero}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent flex flex-col justify-center items-center px-6 md:px-24 text-center">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 leading-tight">
            Instituto Educativo Los Ceibos
          </h1>
          <p className="text-lg md:text-xl text-gray-100 font-normal mb-8 max-w-2xl">
            Tu lugar en La Plata para aprender, crecer y prepararse para el futuro. Educación integral de Jornada Doble con Nivel Inicial y Primario.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-1.5 rounded text-xs font-bold uppercase text-white tracking-wider bg-[#22543d]">
              NIVEL INICIAL
            </span>
            <span className="px-4 py-1.5 rounded text-xs font-bold uppercase text-white tracking-wider bg-[#9b1c1c]">
              Nivel Primario
            </span>
          </div>
          <a href="#contacto" className="inline-block bg-[#808080] text-white px-8 py-3 rounded font-bold text-sm shadow-md hover:bg-gray-600 transition-colors uppercase tracking-widest">
            Consultar Vacantes
          </a>
        </div>
      </div>
    </div>
  );
}
