import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, writeBatch } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { LogOut, Trash2, Edit2, MessageSquare, Plus, ArrowLeft, Star, X, CheckCircle, AlertCircle, Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { TiptapEditor } from "../components/TiptapEditor";
import logoImage from "../assets/images/logo_h.svg";

const TEMPLATES = [
  { id: "inscripcion", url: "/inscripcion.jpg", label: "Inscripción" },
  { id: "inicial", url: "/nivel_inicial.jpg", label: "Nivel Inicial" },
  { id: "primaria", url: "/nivel_primaria.jpg", label: "Nivel Primario" },
  { id: "comunicacion", url: "/comunicacion.jpg", label: "Comunicación" },
];

export function Admin() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState("admin@colegiolosceiboslp.com.ar");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  // Feedback states
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ collectionName: string, id: string, title: string } | null>(null);

  // Forms
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementImage, setAnnouncementImage] = useState("");
  const [imageMode, setImageMode] = useState<"template" | "url">("template");
  const [announcementIsPopup, setAnnouncementIsPopup] = useState(false);
  const [announcementLevel, setAnnouncementLevel] = useState<"none" | "inicial" | "primario">("none");
  const [uploadingA, setUploadingA] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);

  // Data
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    // Only load if authenticated
    if (!isAuthenticated) return;
    
    const qA = query(collection(db, "announcements"), orderBy("date", "desc"));
    const unsubA = onSnapshot(qA, (snap) => setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubA(); };
  }, [isAuthenticated]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Correo electrónico o contraseña incorrectos.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Por seguridad, inténtalo de nuevo en unos minutos.");
      } else {
        setError("No se pudo iniciar sesión. Verifica tu conexión y tus credenciales.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPassword("");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingA(true);
    try {
      if (announcementIsPopup) {
        const batch = writeBatch(db);
        announcements.forEach(a => {
          if (a.isPopup && a.id !== editingAnnouncementId) {
            batch.update(doc(db, "announcements", a.id), { isPopup: false });
          }
        });
        await batch.commit();
      }

      const sanitizedTitle = announcementTitle
        .replace(/[\uFFFD\uFEFF]/g, "")
        .replace(/[“”«»]/g, '"')
        .replace(/[‘’]/g, "'")
        .trim();

      const announcementData = {
        title: sanitizedTitle,
        content: announcementContent,
        imageUrl: announcementImage,
        date: editingAnnouncementId ? announcements.find(a => a.id === editingAnnouncementId)?.date : Date.now(),
        isPopup: announcementIsPopup,
        level: announcementLevel
      };

      if (editingAnnouncementId) {
        await updateDoc(doc(db, "announcements", editingAnnouncementId), announcementData);
        setNotification({ type: 'success', message: "Anuncio actualizado exitosamente" });
      } else {
        await addDoc(collection(db, "announcements"), announcementData);
        setNotification({ type: 'success', message: "Anuncio publicado exitosamente" });
      }

      setAnnouncementTitle("");
      setAnnouncementContent("");
      setAnnouncementImage("");
      setAnnouncementIsPopup(false);
      setAnnouncementLevel("none");
      setEditingAnnouncementId(null);
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: "Error al guardar el anuncio" });
    } finally {
      setUploadingA(false);
    }
  };

  const handleEditAnnouncement = (a: any) => {
    setEditingAnnouncementId(a.id);
    setAnnouncementTitle(a.title);
    setAnnouncementContent(a.content);
    setAnnouncementImage(a.imageUrl || "");
    setAnnouncementIsPopup(a.isPopup || false);
    setAnnouncementLevel(a.level === "inicial" || a.level === "primario" ? a.level : "none");
    setImageMode(TEMPLATES.some(t => t.url === a.imageUrl) ? "template" : "url");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePopup = async (a: any) => {
    try {
      const newValue = !a.isPopup;
      if (newValue) {
        const batch = writeBatch(db);
        announcements.forEach(ann => {
          if (ann.isPopup) {
            batch.update(doc(db, "announcements", ann.id), { isPopup: false });
          }
        });
        batch.update(doc(db, "announcements", a.id), { isPopup: true });
        await batch.commit();
        setNotification({ type: 'success', message: "Popup activado" });
      } else {
        await updateDoc(doc(db, "announcements", a.id), { isPopup: false });
        setNotification({ type: 'success', message: "Popup desactivado" });
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: "Error al actualizar estado del anuncio" });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, itemToDelete.collectionName, itemToDelete.id));
      setNotification({ type: 'success', message: "Elemento eliminado correctamente" });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: "Error al eliminar" });
    } finally {
      setItemToDelete(null);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <img src={logoImage} alt="Los Ceibos" className="h-16 object-contain mx-auto mb-4 animate-pulse" />
          <p className="text-slate-500 text-sm font-medium">Verificando sesión segura...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
          <Link to="/" className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a la web
          </Link>
          <div className="text-center mb-8 mt-4">
            <img src={logoImage} alt="Los Ceibos" className="h-20 object-contain mx-auto mb-4" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full mb-2 border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Acceso Seguro Firebase
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Panel de Administración</h1>
            <p className="text-slate-500 text-sm mt-1">Ingresa con tus credenciales institucionales</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="admin@colegiolosceiboslp.com.ar"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-sm" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Ingresa tu contraseña"
                  className="w-full pl-10 pr-11 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-sm" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-[#22543d] hover:bg-[#183c2b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Ingresar al Panel</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-in slide-in-from-top-4 fade-in duration-300 ${
          notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-2 text-current opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">¿Eliminar elemento?</h3>
            <p className="text-slate-600 text-sm mb-6">
              Estás por eliminar <strong>"{itemToDelete.title}"</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-green-600 transition-colors" title="Volver a la web">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Panel Admin - Los Ceibos</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>{currentUser?.email || "admin@colegiolosceiboslp.com.ar"}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-600 hover:text-red-600 flex items-center gap-2 text-sm font-medium transition-colors bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Anuncios Manager */}
        <section className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-green-700">
              <MessageSquare className="w-6 h-6" />
              <h2 className="text-xl font-bold">{editingAnnouncementId ? "Editar Anuncio" : "Publicar Anuncio"}</h2>
            </div>
            
            <form onSubmit={handleAddAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                <input required type="text" value={announcementTitle} onChange={e => setAnnouncementTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contenido (Estilos disponibles)</label>
                <TiptapEditor value={announcementContent} onChange={setAnnouncementContent} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Imagen del Anuncio</label>
                
                <div className="flex bg-slate-100 p-1 rounded-lg mb-4 w-fit">
                  <button 
                    type="button" 
                    onClick={() => setImageMode("template")} 
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${imageMode === "template" ? "bg-white text-green-700 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
                  >
                    Plantillas
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImageMode("url")} 
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${imageMode === "url" ? "bg-white text-green-700 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
                  >
                    Enlace Drive/Web
                  </button>
                </div>

                {imageMode === "template" ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TEMPLATES.map(temp => (
                      <button
                        key={temp.id}
                        type="button"
                        onClick={() => setAnnouncementImage(temp.url)}
                        className={`border-2 rounded-lg overflow-hidden transition-all relative group ${announcementImage === temp.url ? "border-green-500 scale-105 shadow-md" : "border-slate-200 opacity-70 hover:opacity-100 hover:border-green-300"}`}
                      >
                        <img src={temp.url} alt={temp.label} className="w-full h-24 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold truncate w-full text-left">{temp.label}</span>
                        </div>
                        {announcementImage === temp.url && (
                          <div className="absolute top-1 right-1 bg-green-500 text-white p-0.5 rounded-full">
                            <Star className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <input 
                      type="url" 
                      value={announcementImage} 
                      onChange={e => setAnnouncementImage(e.target.value)} 
                      placeholder="https://drive.google.com/..." 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none" 
                    />
                    <p className="text-xs text-slate-500 mt-1">Pegá el enlace público de la imagen que querés usar.</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Opción de consulta por WhatsApp</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${announcementLevel === "none" ? "border-slate-800 bg-slate-50 text-slate-900 font-medium ring-1 ring-slate-800" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}>
                    <input 
                      type="radio" 
                      name="level" 
                      value="none" 
                      checked={announcementLevel === "none"} 
                      onChange={() => setAnnouncementLevel("none")} 
                      className="text-slate-800 focus:ring-slate-800" 
                    />
                    <span className="text-sm">Sin consulta (Sin WhatsApp)</span>
                  </label>
                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${announcementLevel === "inicial" ? "border-green-600 bg-green-50 text-green-900 font-medium ring-1 ring-green-600" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}>
                    <input 
                      type="radio" 
                      name="level" 
                      value="inicial" 
                      checked={announcementLevel === "inicial"} 
                      onChange={() => setAnnouncementLevel("inicial")} 
                      className="text-green-600 focus:ring-green-600" 
                    />
                    <span className="text-sm">WhatsApp Nivel Inicial</span>
                  </label>
                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${announcementLevel === "primario" ? "border-[#9b1c1c] bg-red-50 text-red-900 font-medium ring-1 ring-[#9b1c1c]" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}>
                    <input 
                      type="radio" 
                      name="level" 
                      value="primario" 
                      checked={announcementLevel === "primario"} 
                      onChange={() => setAnnouncementLevel("primario")} 
                      className="text-[#9b1c1c] focus:ring-[#9b1c1c]" 
                    />
                    <span className="text-sm">WhatsApp Nivel Primario</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isPopup" checked={announcementIsPopup} onChange={e => setAnnouncementIsPopup(e.target.checked)} className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-600" />
                <label htmlFor="isPopup" className="text-sm font-medium text-slate-700">Mostrar como ventana emergente (Popup) en el Inicio</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={uploadingA} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {uploadingA ? "Guardando..." : <><Plus className="w-4 h-4" /> {editingAnnouncementId ? "Guardar Cambios" : "Publicar Anuncio"}</>}
                </button>
                {editingAnnouncementId && (
                  <button type="button" onClick={() => {
                    setEditingAnnouncementId(null);
                    setAnnouncementTitle("");
                    setAnnouncementContent("");
                    setAnnouncementImage("");
                    setAnnouncementIsPopup(false);
                    setAnnouncementLevel("none");
                  }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Anuncios Publicados</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {announcements.map(a => (
                <div key={a.id} className={`border p-4 rounded-xl flex justify-between items-start gap-4 ${a.isPopup ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-800">{a.title}</h4>
                      {a.isPopup && <span className="text-[10px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold uppercase">Popup Activo</span>}
                      {a.level === "inicial" && (
                        <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">WhatsApp Inicial</span>
                      )}
                      {a.level === "primario" && (
                        <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">WhatsApp Primario</span>
                      )}
                      {(!a.level || a.level === "none") && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Sin consulta</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 line-clamp-2 mt-1" dangerouslySetInnerHTML={{ __html: a.content }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleTogglePopup(a)} className={`p-2 rounded-lg transition-colors ${a.isPopup ? 'text-yellow-600 hover:bg-yellow-100' : 'text-gray-400 hover:bg-gray-100'}`} title={a.isPopup ? "Quitar Popup" : "Hacer Popup"}>
                      <Star className="w-4 h-4" fill={a.isPopup ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => handleEditAnnouncement(a)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Editar">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setItemToDelete({ collectionName: "announcements", id: a.id, title: a.title })} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No hay anuncios</p>}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
