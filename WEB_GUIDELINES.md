# Guía Base de Arquitectura y Funcionalidad para Proyectos Web

Este documento recopila las mejores prácticas, directrices de estructura y requisitos funcionales establecidos para garantizar el desarrollo de sitios web modernos, escalables y sin errores de compatibilidad. Sirve como plantilla o *prompt base* para futuros desarrollos.

---

## 1. Gestión de Recursos Multimedia (Assets)
**Regla de oro:** Vite debe ser el único responsable de procesar y generar las URLs finales de todos los assets para garantizar compatibilidad en cualquier entorno (Vercel, Hostinger, subcarpetas, etc.).

*   **Ubicación:** Todas las imágenes, videos, íconos y recursos que formen parte de la interfaz deben almacenarse estrictamente dentro de `src/assets/`.
    *   `src/assets/images/`
    *   `src/assets/videos/`
    *   `src/assets/icons/`
*   **Prohibiciones:** 
    *   NO usar el directorio `public/` para imágenes o videos consumidos por componentes React (reservar `public/` solo para el `favicon` o archivos estáticos ajenos al bundle).
    *   NO utilizar rutas absolutas en texto (ej. `/images/foto.jpg` o `/media/video.mp4`).
    *   NO utilizar URLs externas arbitrarias ni sistemas de fallback con múltiples rutas.
*   **Implementación en Código:** Los componentes React **deben** importar los assets de forma relativa directa.
    *   *Ejemplo individual:* `import heroImage from '../assets/images/hero.jpg';`
    *   *Ejemplo dinámico (Múltiples archivos):* Utilizar la importación dinámica de Vite: `const images = Object.values(import.meta.glob('../assets/images/*.jpg', { eager: true, import: 'default' }));`

## 2. Navegación UX y Comportamiento de Anclas
*   **Cabeceras Fijas (Sticky Headers):** Cuando se utilice un menú de navegación fijo en la parte superior, todas las secciones (etiquetas `<section>`) que funcionen como ancla (`id="seccion"`) deben tener un margen de desplazamiento interno.
    *   *Implementación (Tailwind):* Usar clases como `scroll-mt-24` o `scroll-mt-28` en las secciones para evitar que la cabecera "pise" u oculte los títulos al hacer scroll automático.
*   **Títulos y Jerarquía Visual:** Los títulos de las secciones principales deben tener un tamaño prominente (ej. `text-2xl` o superior) e indicadores visuales (como bordes laterales de color o subrayados) para facilitar el escaneo visual del usuario.

## 3. Panel de Administración y Seguridad
*   **Acceso Sutil (Easter Egg):** El enlace de acceso al panel de control/administración no debe ser ruidoso ni ensuciar la interfaz pública.
    *   *Implementación:* Ubicarlo en el pie de página (footer) como un ícono discreto (ej. un candado) que solo se hace visible (`opacity-100`) cuando el usuario pasa el cursor por encima del área exacta (`hover`).
*   **Pantalla de Login:** La pantalla de autenticación para el administrador debe mantener la identidad visual de la marca (incluyendo el logotipo centrado) y dar feedback claro en caso de error.

## 4. Edición de Contenido (Rich Text)
*   **Editor Moderno:** Para campos de texto donde el administrador deba dar formato (negritas, cursivas, listas, enlaces), **NO utilizar librerías obsoletas** como `react-quill` (que presentan incompatibilidades con React 19).
*   **Estándar adoptado:** Utilizar **Tiptap** (Headless Editor). Permite construir una barra de herramientas totalmente personalizada con iconos modernos (ej. `lucide-react`), es altamente estable y 100% compatible con las últimas versiones de React.

## 5. Diseño UI y Estilos
*   **Iconografía:** Utilizar siempre librerías consistentes y modernas, preferentemente `lucide-react`.
*   **Animaciones:** Utilizar transiciones suaves para el *hover* de botones e imágenes (ej. escalas sutiles `hover:scale-105 duration-700` en galerías).
*   **Responsive Design:** Garantizar que los componentes de navegación y visualización de recursos (sliders, grillas de galería) se adapten usando el esquema Mobile-First de Tailwind (`md:`, `lg:`).

## 6. Experiencia Móvil Tipo App y Header con Reducción en Scroll
*   **Header con Reducción en Scroll:**
    *   La cabecera superior debe contraerse suavemente al hacer scroll hacia abajo (`isScrolled`), reduciendo la altura (`h-24` -> `h-16`) y la escala del logo para maximizar el área de lectura sin perder el acceso a la navegación.
*   **Barra de Navegación Inferior (Mobile Bottom Navigation Bar):**
    *   En dispositivos móviles (`md:hidden`), implementar una barra inferior fija (`fixed bottom-0 left-0 right-0`) estilo App nativa con fondo traslúcido (`bg-white/95 backdrop-blur-lg`).
    *   Incluir accesos directos con iconos claros (Colegio, Propuesta, Anuncios con indicador de actividad, Galería y WhatsApp/Contacto).
    *   Acompañar con un Bottom Sheet / Menú inferior deslizable para acciones rápidas de contacto directo (Jardín, Primaria, Ubicación y Formulario).

## 7. Galería Interactiva (Lightbox / Popup con Navegación en Loop)
*   **Apertura y Animación:** Al tocar o hacer clic en cualquier miniatura de la galería, debe abrirse un modal/lightbox con fondo oscurecido traslúcido y desenfoque profundo (`bg-black/65 backdrop-blur-lg`) para que la página de fondo permanezca sutilmente visible con efecto de vidrio esmerilado, acompañado de una animación suave de entrada (`animate-in fade-in zoom-in-95 duration-200`).
*   **Navegación Cíclica en Loop:** Los controles previo y siguiente deben permitir navegar de forma continua e infinita entre las imágenes (`(index ± 1 + total) % total`).
*   **Múltiples Formas de Cierre y Navegación:**
    *   Cierre mediante botón flotante 'X', presionar la tecla `Escape` o hacer clic/toque en cualquier zona del fondo fuera de la foto (`onClick={closeLightbox}`).
    *   Navegación con flechas del teclado (`ArrowLeft` / `ArrowRight`) en escritorio.
    *   Gestos táctiles de deslizamiento (*swipe* izquierda/derecha) en dispositivos móviles.
    *   Contador superior de fotos (`Foto X de N`) y tira inferior de miniaturas para salto rápido.

## 8. Créditos y Firma de Autoría en Footer
*   **Firma Discreta:** En el pie de página (`footer`), junto a los derechos reservados, incorporar de forma sutil el enlace de autoría (ej. `By unke.com.ar` enlazado a `https://unke.com.ar/`) con tipografía discreta, transición de color en hover y apertura segura en nueva pestaña (`target="_blank" rel="noopener noreferrer"`).

## 9. Prevención de Saltos de Layout (CLS) y Pantalla de Precarga (Preloader)
*   **Caché de Hidratación Inmediata (`localStorage`):** Para elementos de navegación o botones que dependen de consultas asíncronas a bases de datos (como la detección de si existen anuncios o no), inicializar el estado en React leyendo desde `localStorage`. Esto garantiza renderizado instantáneo en 0ms en recargas y visitas recurrentes.
*   **Pantalla de Precarga de Marca (Brand Preloader):**
    *   En la carga inicial en frío, mostrar un preloader elegante con el logotipo institucional y una barra de carga indeterminada sutil.
    *   Mantenerlo activo una fracción de segundo (~450ms) mientras se resuelve la primera consulta asíncrona de Firestore y los recursos principales.
    *   Realizar un desvanecimiento suave (`transition-opacity duration-500 ease-out`) y desmontar el componente. Al develar la interfaz, todos los botones y secciones ya ocupan su posición final, eliminando por completo los saltos bruscos de maquetación (Cumulative Layout Shift).
    *   Incluir siempre un temporizador de seguridad (~800ms) para garantizar que la web nunca se quede bloqueada ante conexiones lentas.


