import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Luciana B.",
    text: "Excelente institución. Mis dos hijos asisten desde el jardín y estamos muy contentos con el nivel humano y académico.",
    rating: 5,
  },
  {
    id: 2,
    name: "Martín R.",
    text: "Muy buen colegio, los docentes son muy dedicados y el ambiente es súper familiar. Recomiendo totalmente.",
    rating: 5,
  },
  {
    id: 3,
    name: "Valeria C.",
    text: "Hermoso lugar para que los chicos crezcan y aprendan. Las instalaciones son muy lindas y seguras.",
    rating: 5,
  }
];

export function Reviews() {
  return (
    <section className="py-20 bg-[#f9fafb] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h2 className="text-[#22543d] font-bold uppercase tracking-wider text-sm mb-4 border-l-4 border-[#9b1c1c] pl-3">Reseñas Destacadas</h2>
          <p className="text-sm text-gray-600">
            Reseñas reales de nuestra comunidad educativa en Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 border border-gray-100 shadow-sm rounded">
              <div className="flex items-center gap-1 mb-3 text-yellow-500">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-600 mb-4 italic leading-relaxed line-clamp-4">"{review.text}"</p>
              <div className="border-t border-gray-50 pt-3">
                <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">— {review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
