import { useState, useEffect, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────
interface Habitacion {
  numeroHabitacion: number;
  estado: string;
  tipoHabitacion: string;
  descripcion: string;
  precio: number;
  tipo_cama: string;
  comodidades: string;
  fotos: string;
}

interface Actividad {
  idActividad: number;
  cedula: string;
  nombre: string;
  contacto: string;
  correo: string;
  tipo_actividad: string;
  descripcion: string;
  precio: number;
  direccion: string;
  telefonos: string;
}

interface Cliente {
  idCliente: number;
  cedula: string;
  nombre: string;
  apellido_1: string;
  apellido_2: string;
  correo: string;
  tipo_identificacion: string;
  pais_residencia: string;
  direccion: string;
  edad: number;
  telefonos: string;
}

interface Hotel {
  idHotel: number;
  cedula: string;
  nombreHotel: string;
  tipo: string;
  correo: string;
  url: string;
  gps: string;
  direccion: string;
  telefonos: string;
  redesSociales: string;
  servicios: string;
}

interface AuthUser {
  usuario: string;
  role: "cliente" | "administrador";
  idCliente?: number;
}

type View = "home" | "admin";
type AdminTab = "hoteles" | "clientes" | "habitaciones" | "actividades";
type Modal =
  | "login"
  | "register"
  | "reserve"
  | "adminCreate"
  | "adminEdit"
  | null;

// ─────────────────────────────────────────────────────────
// MOCK DATA (fallback when API is unreachable)
// ─────────────────────────────────────────────────────────

const MOCK_HABITACIONES: Habitacion[] = [
  { numeroHabitacion: 101, estado: "DISPONIBLE", tipoHabitacion: "Suite", descripcion: "Habitación espaciosa con vista al mar y balcón privado.", precio: 285, tipo_cama: "King", comodidades: "Aire acondicionado | Minibar | Jacuzzi | Televisor 55\"", fotos: "" },
  { numeroHabitacion: 102, estado: "DISPONIBLE", tipoHabitacion: "Suite", descripcion: "Habitación espaciosa con vista al mar y balcón privado.", precio: 285, tipo_cama: "King", comodidades: "Aire acondicionado | Minibar | Jacuzzi | Televisor 55\"", fotos: "" },
  { numeroHabitacion: 201, estado: "DISPONIBLE", tipoHabitacion: "Doble Estándar", descripcion: "Habitación cómoda con dos camas dobles, ideal para familias.", precio: 145, tipo_cama: "Doble", comodidades: "Aire acondicionado | Televisor 42\" | Caja fuerte", fotos: "" },
  { numeroHabitacion: 202, estado: "OCUPADA", tipoHabitacion: "Doble Estándar", descripcion: "Habitación cómoda con dos camas dobles, ideal para familias.", precio: 145, tipo_cama: "Doble", comodidades: "Aire acondicionado | Televisor 42\" | Caja fuerte", fotos: "" },
  { numeroHabitacion: 301, estado: "DISPONIBLE", tipoHabitacion: "Single Premium", descripcion: "Habitación individual de alta gama con todos los servicios.", precio: 195, tipo_cama: "Single", comodidades: "Aire acondicionado | Minibar | Televisor 50\" | Bañera", fotos: "" },
  { numeroHabitacion: 302, estado: "DISPONIBLE", tipoHabitacion: "Single Premium", descripcion: "Habitación individual de alta gama con todos los servicios.", precio: 195, tipo_cama: "Single", comodidades: "Aire acondicionado | Minibar | Televisor 50\" | Bañera", fotos: "" },
];

const MOCK_ACTIVIDADES: Actividad[] = [
  { idActividad: 1, cedula: "111000111", nombre: "Tour del Río Verde", contacto: "Juan Pérez", correo: "tour@aventura.com", tipo_actividad: "Aventura", descripcion: "Recorrido en bote por el río Verde, paisajes exuberantes y fauna silvestre.", precio: 45, direccion: "Muelle principal, Limón Centro", telefonos: "+506 22334455" },
  { idActividad: 2, cedula: "222000222", nombre: "Cata de Especias", contacto: "María López", correo: "cata@sabores.com", tipo_actividad: "Gastronómica", descripcion: "Experiencia única cata de especias locales y platillos tradicionales costarricense.", precio: 35, direccion: "Mercado Central, Limón", telefonos: "+506 55443322" },
  { idActividad: 3, cedula: "333000333", nombre: "Senderismo La Cuña", contacto: "Carlos Ruiz", correo: "sender@natur.com", tipo_actividad: "Deportiva", descripcion: "Caminata guiada por los senderos de la selva húmeda tropical, duración 4 horas.", precio: 55, direccion: "Entrada parque La Cuña, km 12", telefonos: "+506 66778899" },
  { idActividad: 4, cedula: "444000444", nombre: "Submarinismo Básico", contacto: "Pedro Salinas", correo: "sub@oceano.com", tipo_actividad: "Acuática", descripcion: "Curso básico de submarinismo con instructor certificado en aguas tranquilas.", precio: 120, direccion: "Playa del Hotel, zona sur", telefonos: "+506 11223344" },
];

const MOCK_CLIENTES: Cliente[] = [
  { idCliente: 1, cedula: "102938475", nombre: "Ana", apellido_1: "Martínez", apellido_2: "Ruiz", correo: "ana@correo.com", tipo_identificacion: "Cédula", pais_residencia: "Costa Rica", direccion: "Calle 5, San José", edad: 32, telefonos: "+506 88776655" },
  { idCliente: 2, cedula: "564738291", nombre: "Carlos", apellido_1: "López", apellido_2: "Sáez", correo: "carlos@correo.com", tipo_identificacion: "Pasaporte", pais_residencia: "Colombia", direccion: "Av. Siempre Viva 200", edad: 28, telefonos: "+57 3101234567" },
];

const MOCK_HOTELES: Hotel[] = [
  { idHotel: 1, cedula: "123456789", nombreHotel: "StayLimón Resort", tipo: "Resort", correo: "hotel@staylimon.com", url: "https://staylimon.com", gps: "10.0566, -83.5238", direccion: "Calle Principal, Limón Centro", telefonos: "+506 22001100", redesSociales: "Facebook: facebook.com/staylimon | Instagram: instagram.com/staylimon", servicios: "Pool | Gym | Spa | Restaurant" },
];


const CR_PROVINCIAS: Record<string, Record<string, string[]>> = {
  "San José": {
    "San José": ["Médico", "Merced", "Hospital", "El Sabanilla", "San José Este", "San José Oeste", "El Cocoa", "Guadeloupe", "La Soledad", "San Francisco"],
    "Escazú": ["Escazú", "San Rafael", "San Miguel"],
    "Desamparados": ["Desamparados", "San Miguel", "La Unión", "Los Mangos", "Curiarán", "La Colorada", "Aranjuez", "Girón"],
    "Puriscal": ["Santiago", "Mercedes", "Trinidad", "Playa Grande", "Naranjal", "Patares", "Saipan", "La Cañada"],
    "Tarrazú": ["San Carlos", "Santa María", "La Villa"],
  },
  "Alajuela": {
    "Alajuela": ["Centro", "La Fragua", "Osts", "San José", "Mohirri", "Barrio Nuevo", "La Sabaneta"],
    "San Ramón": ["San Ramón", "San Isidro", "Angelo", "La Palmera", "La Piedra", "Peón"],
    "Montes Claros": ["Montes Claros", "Guasin", "Bosque", "El Coyol"],
  },
  "Cartago": {
    "Cartago": ["Centro", "El Parque", "La Puente", "La Manga", "San Olguín", "El Sajurre"],
    "Paraíso": ["Paraíso", "La Roca", "San Pedro", "El Montuno", "Los Muertos"],
    "La Unión": ["La Unión", "Anillo", "San Rafael", "La Columneta", "La Cabaña"],
  },
  "Heredia": {
    "Heredia": ["Centro", "El Nogal", "Los Flores", "El Paraíso", "San Antonio", "El Agua"],
    "Barva": ["Barva", "San Pedro", "San Pablo", "Aura", "Malpais", "Santa Lucía"],
    "Santo Domingo": ["Santo Domingo", "San Pedro", "San Pedro Norte", "Los Nogales", "Villa Bonita"],
  },
  "Guanacaste": {
    "Liberia": ["Centro", "Curriles", "Ocotal", "Belén", "Nuevo Liberia", "Las Palmas", "El Cañas"],
    "Nicoya": ["Centro", "La Hoja", "La Cuesta", "El Bosque", "La Cruz", "El Agua"],
    "Santa Cruz": ["Centro", "La Soledad", "El Bosque", "Villaflor", "Culebra"],
  },
  "Puntarenas": {
    "Puntarenas": ["Centro", "La Islita", "El Cocoa", "La Puente", "El Agua", "San Antonio"],
    "San Isidro": ["Centro", "La Palma", "El Agua", "San Rafael", "La Cruz"],
    "Osa": ["Centro", "La Palma", "El Agua", "Gosa", "El Bosque"],
  },
  "Limón": {
    "Limón": ["Centro", "La Puente", "El Agua", "San Antonio", "El Bosque", "La Piedra", "Nuevo Limón", "Banquera"],
    "Cahuita": ["Centro", "La Playa", "El Agua", "El Bosque", "La Piedra"],
    "La Cabrera": ["Centro", "La Palma", "El Agua", "San Rafael", "La Cruz"],
  },
};

const COUNTRY_CODES: { code: string; name: string }[] = [
  { code: "+506", name: "Costa Rica" },
  { code: "+1", name: "Estados Unidos / Canadá" },
  { code: "+52", name: "México" },
  { code: "+57", name: "Colombia" },
  { code: "+54", name: "Argentina" },
  { code: "+55", name: "Brasil" },
  { code: "+56", name: "Chile" },
  { code: "+51", name: "Perú" },
  { code: "+593", name: "Ecuador" },
  { code: "+58", name: "Venezuela" },
  { code: "+507", name: "Panamá" },
  { code: "+504", name: "Honduras" },
  { code: "+503", name: "El Salvador" },
  { code: "+502", name: "Guatemala" },
  { code: "+505", name: "Nicaragua" },
  { code: "+44", name: "Reino Unido" },
  { code: "+34", name: "España" },
  { code: "+39", name: "Italia" },
  { code: "+33", name: "Francia" },
  { code: "+49", name: "Alemania" },
  { code: "+81", name: "Japón" },
  { code: "+86", name: "China" },
  { code: "+91", name: "India" },
  { code: "+61", name: "Australia" },
];

const TIPOS_IDENTIFICACION = ["Cédula nacional", "Pasaporte", "DIMEX", "Otro"];

// ─────────────────────────────────────────────────────────
// API HELPERS
// Change BASE_URL to point to your Express server
// ─────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3000/api";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────────────────
// ICONS (inline SVGs)
// ─────────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="8" r="4"/></svg>
);
const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const IconBed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h18"/><path d="M3 13V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5"/><path d="M3 13v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-5"/><circle cx="7.5" cy="9.5" r="1.5"/></svg>
);
const IconActivity = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const IconLogOut = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const IconDelete = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconMap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────
export default function App() {
  // ── Auth
  const [auth, setAuth] = useState<AuthUser | null>(null);
  // ── Navigation
  const [view, setView] = useState<View>("home");
  // ── Home
  const [homeTab, setHomeTab] = useState<"habitaciones" | "actividades">("habitaciones");
  const [search, setSearch] = useState("");
  // ── Admin
  const [adminTab, setAdminTab] = useState<AdminTab>("hoteles");
  // ── Data
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>(MOCK_HABITACIONES);
  const [actividades, setActividades] = useState<Actividad[]>(MOCK_ACTIVIDADES);
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES);
  const [hoteles, setHoteles] = useState<Hotel[]>(MOCK_HOTELES);
  // ── Modals
  const [modal, setModal] = useState<Modal>(null);
  // ── Reserve state
  const [reserveTarget, setReserveTarget] = useState<Habitacion | null>(null);
  // ── Admin create/edit
  const [adminFormTarget, setAdminFormTarget] = useState<any>(null); // null = create, object = edit

  // ── Fetch data on mount
  useEffect(() => {
    const load = async () => {
      try {
        const r = await apiFetch<{ data: Habitacion[] }>("/habitacion");
        setHabitaciones(r.data);
      } catch {}
      try {
        const r = await apiFetch<{ data: Actividad[] }>("/actividad");
        setActividades(r.data);
      } catch {}
      try {
        const r = await apiFetch<{ data: Cliente[] }>("/cliente");
        setClientes(r.data);
      } catch {}
      try {
        const r = await apiFetch<{ data: Hotel[] }>("/hotel");
        setHoteles(r.data);
      } catch {}
    };
    load();
  }, []);

  // ── Filtered lists
  const filteredHab = useMemo(() => {
    const s = search.toLowerCase();
    return habitaciones.filter(
      (h) =>
        h.tipoHabitacion.toLowerCase().includes(s) ||
        h.estado.toLowerCase().includes(s) ||
        String(h.numeroHabitacion).includes(s) ||
        h.tipo_cama.toLowerCase().includes(s)
    );
  }, [habitaciones, search]);

  const filteredAct = useMemo(() => {
    const s = search.toLowerCase();
    return actividades.filter(
      (a) =>
        a.nombre.toLowerCase().includes(s) ||
        a.tipo_actividad.toLowerCase().includes(s) ||
        a.descripcion.toLowerCase().includes(s)
    );
  }, [actividades, search]);

  // ── Handlers
  const handleLogout = () => {
    setAuth(null);
    setView("home");
  };

  const openReserve = (h: Habitacion) => {
    setReserveTarget(h);
    setModal("reserve");
  };

  const openAdminCreate = () => {
    setAdminFormTarget(null);
    setModal("adminCreate");
  };

  const openAdminEdit = (item: any) => {
    setAdminFormTarget(item);
    setModal("adminEdit");
  };

  const handleAdminDelete = async (id: number | string) => {
    if (!window.confirm("¿Seguro que desea eliminar este elemento?")) return;
    try {
      switch (adminTab) {
        case "hoteles":
          await apiFetch(`/hotel/${id}`, { method: "DELETE" });
          setHoteles((p) => p.filter((h) => h.idHotel !== id));
          break;
        case "clientes":
          await apiFetch(`/cliente/${id}`, { method: "DELETE" });
          setClientes((p) => p.filter((c) => c.idCliente !== id));
          break;
        case "habitaciones":
          await apiFetch(`/habitacion/${id}`, { method: "DELETE" });
          setHabitaciones((p) => p.filter((h) => h.numeroHabitacion !== id));
          break;
        case "actividades":
          await apiFetch(`/actividad/${id}`, { method: "DELETE" });
          setActividades((p) => p.filter((a) => a.idActividad !== id));
          break;
      }
    } catch {
      // fallback: remove from local state anyway for demo
      switch (adminTab) {
        case "hoteles": setHoteles((p) => p.filter((h) => h.idHotel !== id)); break;
        case "clientes": setClientes((p) => p.filter((c) => c.idCliente !== id)); break;
        case "habitaciones": setHabitaciones((p) => p.filter((h) => h.numeroHabitacion !== id)); break;
        case "actividades": setActividades((p) => p.filter((a) => a.idActividad !== id)); break;
      }
    }
  };

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#f4f0eb", color: "#2c2c2c", position: "relative", overflow: "hidden" }}>
      {/* Ambient background texture */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(0,107,100,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(180,140,90,0.08) 0%, transparent 50%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── NAVBAR ── */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", background: "rgba(244,240,235,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,107,100,0.12)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => { setView("home"); setSearch(""); }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #006b64, #00918a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>S</span>
          </div>
          <span style={{ fontSize: 22, fontWeight: "normal", letterSpacing: "2px", color: "#006b64", textTransform: "uppercase" }}>Stay<span style={{ color: "#b4894e" }}>Limón</span></span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          <span onClick={() => { setView("home"); setSearch(""); }} style={{ cursor: "pointer", fontSize: 14, letterSpacing: "1.5px", textTransform: "uppercase", color: view === "home" ? "#006b64" : "#888", borderBottom: view === "home" ? "2px solid #006b64" : "2px solid transparent", paddingBottom: 4, transition: "all .2s" }}>Inicio</span>
          {auth?.role === "administrador" && (
            <span onClick={() => setView("admin")} style={{ cursor: "pointer", fontSize: 14, letterSpacing: "1.5px", textTransform: "uppercase", color: view === "admin" ? "#006b64" : "#888", borderBottom: view === "admin" ? "2px solid #006b64" : "2px solid transparent", paddingBottom: 4, transition: "all .2s" }}>Panel Admin</span>
          )}
        </div>

        {/* Auth area */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {auth ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: auth.role === "administrador" ? "rgba(0,107,100,0.1)" : "rgba(180,140,78,0.1)", borderRadius: 20, padding: "6px 14px", border: `1px solid ${auth.role === "administrador" ? "rgba(0,107,100,0.25)" : "rgba(180,140,78,0.3)"}` }}>
                <IconUser />
                <span style={{ fontSize: 13, color: auth.role === "administrador" ? "#006b64" : "#8a6a2e", fontWeight: 600 }}>{auth.usuario}</span>
                <span style={{ fontSize: 10, background: auth.role === "administrador" ? "#006b64" : "#b4894e", color: "#fff", borderRadius: 8, padding: "2px 7px", textTransform: "uppercase", letterSpacing: "0.8px" }}>{auth.role}</span>
              </div>
              <button onClick={handleLogout} style={{ background: "none", border: "1px solid #ccc", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#666", display: "flex", alignItems: "center", transition: "all .2s" }} onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "#006b64"; (e.target as HTMLElement).style.color = "#006b64"; }} onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#ccc"; (e.target as HTMLElement).style.color = "#666"; }}>
                <IconLogOut />
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setModal("login")} style={{ background: "none", border: "1.5px solid #006b64", borderRadius: 8, padding: "7px 18px", cursor: "pointer", color: "#006b64", fontSize: 13, letterSpacing: "0.8px", fontFamily: "inherit", transition: "all .2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#006b64"; (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#006b64"; }}>Inicio de sesión</button>
              <button onClick={() => setModal("register")} style={{ background: "#006b64", border: "1.5px solid #006b64", borderRadius: 8, padding: "7px 18px", cursor: "pointer", color: "#fff", fontSize: 13, letterSpacing: "0.8px", fontFamily: "inherit", transition: "all .2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#005550"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#006b64"; }}>Registrarse</button>
            </div>
          )}
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "32px 40px" }}>
        {view === "home" && (
          <>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h1 style={{ fontSize: 42, fontWeight: "normal", color: "#006b64", letterSpacing: "-0.5px", marginBottom: 8 }}>Descubre tu estadía perfecta</h1>
              <p style={{ color: "#888", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>Explora nuestras habitaciones y actividades. Una experiencia única en el corazón de Limón.</p>
            </div>

            {/* Search + Tabs bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ flex: "1 1 260px", position: "relative", maxWidth: 420 }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#aaa" }}><IconSearch /></div>
                <input
                  type="text"
                  placeholder="Buscar habitaciones o actividades..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "11px 16px 11px 40px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", background: "#fff", outline: "none", boxSizing: "border-box", transition: "border .2s" }}
                  onFocus={e => (e.target.style.borderColor = "#006b64")}
                  onBlur={e => (e.target.style.borderColor = "#ddd")}
                />
              </div>
              {/* Tabs */}
              <div style={{ display: "flex", background: "#fff", borderRadius: 10, border: "1.5px solid #e0dcd5", overflow: "hidden" }}>
                {(["habitaciones", "actividades"] as const).map((tab) => (
                  <button key={tab} onClick={() => setHomeTab(tab)} style={{ padding: "10px 22px", border: "none", background: homeTab === tab ? "#006b64" : "transparent", color: homeTab === tab ? "#fff" : "#666", fontSize: 13, letterSpacing: "0.8px", textTransform: "capitalize", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }}>
                    {tab === "habitaciones" ? <IconBed /> : <IconActivity />}
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
              {homeTab === "habitaciones" &&
                filteredHab.map((h) => (
                  <HabitacionCard key={h.numeroHabitacion} hab={h} auth={auth} onReserve={() => openReserve(h)} />
                ))}
              {homeTab === "actividades" &&
                filteredAct.map((a) => (
                  <ActividadCard key={a.idActividad} act={a} />
                ))}
              {((homeTab === "habitaciones" && filteredHab.length === 0) || (homeTab === "actividades" && filteredAct.length === 0)) && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#aaa", fontSize: 16 }}>No se encontraron resultados para "<strong>{search}</strong>"</div>
              )}
            </div>
          </>
        )}

        {view === "admin" && auth?.role === "administrador" && (
          <AdminPanel
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            hoteles={hoteles}
            setHoteles={setHoteles}
            clientes={clientes}
            setClientes={setClientes}
            habitaciones={habitaciones}
            setHabitaciones={setHabitaciones}
            actividades={actividades}
            setActividades={setActividades}
            openAdminCreate={openAdminCreate}
            openAdminEdit={openAdminEdit}
            handleAdminDelete={handleAdminDelete}
          />
        )}
      </main>

      {/* ── MODALS ── */}
      {modal && (
        <ModalOverlay onClose={() => setModal(null)}>
          {modal === "login" && <LoginModal onClose={() => setModal(null)} onLogin={setAuth} />}
          {modal === "register" && <RegisterModal onClose={() => setModal(null)} onRegister={(c) => { setClientes((p) => [...p, c]); setAuth({ usuario: c.correo, role: "cliente", idCliente: c.idCliente }); }} />}
          {modal === "reserve" && reserveTarget && <ReserveModal hab={reserveTarget} auth={auth!} onClose={() => setModal(null)} />}
          {modal === "adminCreate" && <AdminFormModal tab={adminTab} target={null} onClose={() => setModal(null)} onSave={(item: any) => {
            switch (adminTab) {
              case "hoteles": setHoteles((p) => [...p, item]); break;
              case "clientes": setClientes((p) => [...p, item]); break;
              case "habitaciones": setHabitaciones((p) => [...p, item]); break;
              case "actividades": setActividades((p) => [...p, item]); break;
            }
          }} />}
          {modal === "adminEdit" && adminFormTarget && <AdminFormModal tab={adminTab} target={adminFormTarget} onClose={() => setModal(null)} onSave={(item: any) => {
            switch (adminTab) {
              case "hoteles": setHoteles((p) => p.map((h) => (h.idHotel === item.idHotel ? item : h))); break;
              case "clientes": setClientes((p) => p.map((c) => (c.idCliente === item.idCliente ? item : c))); break;
              case "habitaciones": setHabitaciones((p) => p.map((h) => (h.numeroHabitacion === item.numeroHabitacion ? item : h))); break;
              case "actividades": setActividades((p) => p.map((a) => (a.idActividad === item.idActividad ? item : a))); break;
            }
          }} />}
        </ModalOverlay>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// HABITACION CARD
// ─────────────────────────────────────────────────────────
function HabitacionCard({ hab, auth, onReserve }: { hab: Habitacion; auth: AuthUser | null; onReserve: () => void }) {
  const available = hab.estado === "DISPONIBLE";
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)", transition: "transform .2s, box-shadow .2s", cursor: "default" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
    >
      {/* Top accent bar */}
      <div style={{ height: 4, background: available ? "linear-gradient(90deg, #006b64, #00918a)" : "linear-gradient(90deg, #d4875e, #e0a06e)" }} />
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: available ? "#006b64" : "#d4875e", fontWeight: 600 }}>{hab.estado}</span>
            <h3 style={{ fontSize: 18, color: "#2c2c2c", margin: "4px 0 0", fontWeight: 600 }}>{hab.tipoHabitacion}</h3>
            <span style={{ fontSize: 12, color: "#999" }}>Habitación #{hab.numeroHabitacion}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#006b64" }}>${hab.precio}</span>
            <span style={{ fontSize: 12, color: "#999" }}>/noche</span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#777", lineHeight: 1.5, marginBottom: 16 }}>{hab.descripcion}</p>
        {/* Details */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#666" }}><IconBed /> {hab.tipo_cama}</div>
        </div>
        {/* Comodidades */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {hab.comodidades.split(" | ").map((c, i) => (
            <span key={i} style={{ fontSize: 11, background: "#f0ece6", color: "#6b6358", borderRadius: 6, padding: "3px 9px" }}>{c}</span>
          ))}
        </div>
        {/* Reservar button */}
        {available && (
          <button
            onClick={() => { if (auth) onReserve(); else alert("Por favor, inicie sesión como cliente para realizar una reservación."); }}
            style={{ width: "100%", padding: "10px 0", borderRadius: 9, border: "none", background: auth?.role === "cliente" ? "#006b64" : "#ddd", color: auth?.role === "cliente" ? "#fff" : "#888", fontSize: 13, letterSpacing: "0.8px", cursor: auth?.role === "cliente" ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "background .2s" }}
          >
            {auth?.role === "cliente" ? "Reservar" : auth?.role === "administrador" ? "Solo clientes pueden reservar" : "Inicie sesión para reservar"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ACTIVIDAD CARD
// ─────────────────────────────────────────────────────────
function ActividadCard({ act }: { act: Actividad }) {
  const colorMap: Record<string, string> = { Aventura: "#006b64", Gastronómica: "#b4894e", Deportiva: "#d4875e", Acuática: "#2d8a7b" };
  const color = colorMap[act.tipo_actividad] || "#006b64";
  return (
    <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)", transition: "transform .2s, box-shadow .2s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color, fontWeight: 600, background: `${color}15`, borderRadius: 5, padding: "3px 8px" }}>{act.tipo_actividad}</span>
            <h3 style={{ fontSize: 18, color: "#2c2c2c", margin: "8px 0 0", fontWeight: 600 }}>{act.nombre}</h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 24, fontWeight: 700, color }}>${act.precio}</span>
            <span style={{ fontSize: 11, color: "#999" }}>/persona</span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#777", lineHeight: 1.5, marginBottom: 14 }}>{act.descripcion}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666" }}><IconMap /> {act.direccion}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666" }}><IconPhone /> {act.telefonos}</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MODAL OVERLAY
// ─────────────────────────────────────────────────────────
function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LOGIN MODAL
// ─────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (u: AuthUser) => void }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    // Admin hardcoded
    if (usuario === "admin1" && password === "12345678") {
      onLogin({ usuario: "admin1", role: "administrador" });
      onClose();
      return;
    }
    // Simulate client login (any user that's not admin → cliente)
    if (usuario && password.length >= 6) {
      onLogin({ usuario, role: "cliente", idCliente: 1 });
      onClose();
      return;
    }
    setError("Credenciales incorrectas. Use admin1 / 12345678 para administrador, o cualquier usuario con contraseña de 6+ caracteres para cliente.");
  };

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, color: "#006b64", margin: 0, fontWeight: 600 }}>Inicio de sesión</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}><IconX /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InputField label="Usuario" value={usuario} onChange={setUsuario} placeholder="Ej: admin1" />
        <InputField label="Contraseña" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
        {error && <p style={{ color: "#d4875e", fontSize: 12, margin: 0, lineHeight: 1.5 }}>{error}</p>}
        <button onClick={handleSubmit} style={{ marginTop: 8, padding: "12px 0", borderRadius: 10, border: "none", background: "#006b64", color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.8px", transition: "background .2s" }} onMouseEnter={e => (e.currentTarget.style.background = "#005550")} onMouseLeave={e => (e.currentTarget.style.background = "#006b64")}>Ingresar</button>
      </div>
      <p style={{ fontSize: 12, color: "#aaa", marginTop: 18, textAlign: "center" }}>
        Para <strong>administrador</strong>: usuario <code>admin1</code> / contraseña <code>12345678</code>.<br />
        Para <strong>cliente</strong>: cualquier usuario con contraseña de 6+ caracteres.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// REGISTER MODAL (Cliente) — simple: usuario, contraseña, nombre, apellido, correo
// ─────────────────────────────────────────────────────────
function RegisterModal({ onClose, onRegister }: { onClose: () => void; onRegister: (c: Cliente) => void }) {
  const [form, setForm] = useState({ usuario: "", password: "", nombre: "", apellido: "", correo: "" });
  const [error, setError] = useState("");
  const set = (k: string) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.usuario || !form.password || !form.nombre || !form.apellido || !form.correo) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (!form.correo.includes("@")) {
      setError("Ingrese un correo válido.");
      return;
    }

    const newCliente: Cliente = {
      idCliente: Date.now(),
      cedula: "",
      nombre: form.nombre,
      apellido_1: form.apellido,
      apellido_2: "",
      correo: form.correo,
      tipo_identificacion: "",
      pais_residencia: "",
      direccion: "",
      edad: 0,
      telefonos: "",
    };
    onRegister(newCliente);
    onClose();
  };

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ fontSize: 22, color: "#006b64", margin: 0, fontWeight: 600 }}>Crear cuenta</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}><IconX /></button>
      </div>
      <p style={{ fontSize: 13, color: "#999", margin: "0 0 22px" }}>Completa los datos para registrarte como cliente.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <InputField label="Usuario *" value={form.usuario} onChange={set("usuario")} placeholder="juanperez" />
        <InputField label="Contraseña *" value={form.password} onChange={set("password")} placeholder="••••••••" type="password" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <InputField label="Nombre *" value={form.nombre} onChange={set("nombre")} placeholder="Juan" />
          <InputField label="Apellido *" value={form.apellido} onChange={set("apellido")} placeholder="Pérez" />
        </div>
        <InputField label="Correo electrónico *" value={form.correo} onChange={set("correo")} placeholder="juan@correo.com" />
        {error && <p style={{ color: "#d4875e", fontSize: 12, margin: 0 }}>{error}</p>}
        <button onClick={handleSubmit} style={{ marginTop: 6, padding: "12px 0", borderRadius: 10, border: "none", background: "#006b64", color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.8px" }}>Crear cuenta</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// RESERVE MODAL
// ─────────────────────────────────────────────────────────
function ReserveModal({ hab, auth, onClose }: { hab: Habitacion; auth: AuthUser; onClose: () => void }) {
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [personas, setPersonas] = useState(1);
  const [vehiculo, setVehiculo] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const noches = fechaIngreso && fechaSalida ? Math.max(0, (new Date(fechaSalida).getTime() - new Date(fechaIngreso).getTime()) / 86400000) : 0;
  const total = noches * hab.precio;

  const handleSubmit = async () => {
    setError("");
    if (!fechaIngreso || !fechaSalida) { setError("Seleccione las fechas."); return; }
    if (new Date(fechaSalida) <= new Date(fechaIngreso)) { setError("La fecha de salida debe ser posterior a la de ingreso."); return; }
    try {
      await apiFetch("/reservacion", {
        method: "POST",
        body: JSON.stringify({
          idCliente: auth.idCliente || 1,
          numeroHabitacion: hab.numeroHabitacion,
          fechaIngreso: new Date(fechaIngreso).toISOString(),
          fechaSalida: new Date(fechaSalida).toISOString(),
          cantidadPersonas: personas,
          vehiculo,
        }),
      });
    } catch {}
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e8f5f3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006b64" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style={{ color: "#006b64", fontSize: 20, margin: "0 0 8px" }}>¡Reservación exitosa!</h3>
        <p style={{ color: "#888", fontSize: 14, margin: "0 0 24px" }}>Su reservación para la habitación #{hab.numeroHabitacion} ha sido registrada.</p>
        <button onClick={onClose} style={{ padding: "10px 32px", borderRadius: 9, border: "none", background: "#006b64", color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cerrar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, color: "#006b64", margin: 0, fontWeight: 600 }}>Reservar Habitación</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}><IconX /></button>
      </div>
      {/* Summary */}
      <div style={{ background: "#f7f4ef", borderRadius: 10, padding: "14px 18px", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>Habitación #{hab.numeroHabitacion}</span>
          <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 600, color: "#2c2c2c" }}>{hab.tipoHabitacion} — {hab.tipo_cama}</p>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#006b64" }}>${hab.precio}<span style={{ fontSize: 11, fontWeight: 400, color: "#999" }}>/noche</span></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <InputField label="Fecha de ingreso *" value={fechaIngreso} onChange={setFechaIngreso} type="date" />
          <InputField label="Fecha de salida *" value={fechaSalida} onChange={setFechaSalida} type="date" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <InputField label="Cantidad de personas" value={String(personas)} onChange={(v) => setPersonas(Math.max(1, parseInt(v) || 1))} type="number" />
          <InputField label="Vehículos" value={String(vehiculo)} onChange={(v) => setVehiculo(Math.max(0, parseInt(v) || 0))} type="number" />
        </div>
        {/* Price summary */}
        {noches > 0 && (
          <div style={{ background: "#eaf7f5", borderRadius: 10, padding: "14px 18px", marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 6 }}>
              <span>{noches} noche{noches !== 1 ? "s" : ""} × ${hab.precio}</span>
              <span>${noches * hab.precio}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "#006b64", borderTop: "1px solid #c8e8e3", paddingTop: 8 }}>
              <span>Total estimado</span>
              <span>${total}</span>
            </div>
          </div>
        )}
        {error && <p style={{ color: "#d4875e", fontSize: 12, margin: 0 }}>{error}</p>}
        <button onClick={handleSubmit} style={{ marginTop: 4, padding: "12px 0", borderRadius: 10, border: "none", background: "#006b64", color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.8px" }}>Confirmar reservación</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────
function AdminPanel({ adminTab, setAdminTab, hoteles, setHoteles, clientes, setClientes, habitaciones, setHabitaciones, actividades, setActividades, openAdminCreate, openAdminEdit, handleAdminDelete }: any) {
  const tabs: AdminTab[] = ["hoteles", "clientes", "habitaciones", "actividades"];
  const counts: Record<string, number> = { hoteles: hoteles.length, clientes: clientes.length, habitaciones: habitaciones.length, actividades: actividades.length };

  return (
    <div style={{ display: "flex", gap: 28 }}>
      {/* Sidebar */}
      <div style={{ width: 210, flexShrink: 0 }}>
        <h3 style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#aaa", marginBottom: 12, paddingLeft: 14 }}>Secciones</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setAdminTab(t)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 9, border: "none", background: adminTab === t ? "#006b64" : "transparent", color: adminTab === t ? "#fff" : "#555", fontSize: 14, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize", transition: "all .2s", textAlign: "left" }}>
              <span style={{ flex: 1 }}>{t}</span>
              <span style={{ fontSize: 11, background: adminTab === t ? "rgba(255,255,255,0.2)" : "#e8e4df", borderRadius: 10, padding: "2px 8px", color: adminTab === t ? "#fff" : "#888" }}>{counts[t]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table area */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, color: "#2c2c2c", margin: 0, textTransform: "capitalize", fontWeight: 600 }}>{adminTab}</h2>
          <button onClick={openAdminCreate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "none", background: "#006b64", color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.5px" }}><IconPlus /> Crear nuevo</button>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e4df", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f7f4ef" }}>
                  {getAdminColumns(adminTab).map((col) => (
                    <th key={col} style={{ textAlign: "left", padding: "11px 16px", color: "#888", fontWeight: 600, fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{col}</th>
                  ))}
                  <th style={{ padding: "11px 16px", borderBottom: "1px solid #eee", width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {getAdminRows(adminTab, { hoteles, clientes, habitaciones, actividades }).map((row: any, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0ece6" }}>
                    {getAdminColumns(adminTab).map((col) => (
                      <td key={col} style={{ padding: "11px 16px", color: "#444", whiteSpace: "nowrap" }}>{row[col] ?? "—"}</td>
                    ))}
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => openAdminEdit(row._raw)} style={{ background: "#eaf7f5", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#006b64", display: "flex", alignItems: "center" }}><IconEdit /></button>
                        <button onClick={() => handleAdminDelete(row._id)} style={{ background: "#fef0ec", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#d4875e", display: "flex", alignItems: "center" }}><IconDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {getAdminRows(adminTab, { hoteles, clientes, habitaciones, actividades }).length === 0 && (
                  <tr><td colSpan={10} style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No hay datos</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAdminColumns(tab: AdminTab): string[] {
  switch (tab) {
    case "hoteles": return ["ID", "Nombre", "Tipo", "Correo", "Dirección"];
    case "clientes": return ["ID", "Nombre", "Apellido", "Correo", "País", "Edad"];
    case "habitaciones": return ["#", "Tipo", "Estado", "Precio", "Cama"];
    case "actividades": return ["ID", "Nombre", "Tipo", "Precio", "Dirección"];
  }
}

function getAdminRows(tab: AdminTab, data: any): any[] {
  switch (tab) {
    case "hoteles": return data.hoteles.map((h: Hotel) => ({ ID: h.idHotel, Nombre: h.nombreHotel, Tipo: h.tipo, Correo: h.correo, Dirección: h.direccion, _id: h.idHotel, _raw: h }));
    case "clientes": return data.clientes.map((c: Cliente) => ({ ID: c.idCliente, Nombre: c.nombre, Apellido: c.apellido_1, Correo: c.correo, País: c.pais_residencia, Edad: c.edad, _id: c.idCliente, _raw: c }));
    case "habitaciones": return data.habitaciones.map((h: Habitacion) => ({ "#": h.numeroHabitacion, Tipo: h.tipoHabitacion, Estado: h.estado, Precio: `$${h.precio}`, Cama: h.tipo_cama, _id: h.numeroHabitacion, _raw: h }));
    case "actividades": return data.actividades.map((a: Actividad) => ({ ID: a.idActividad, Nombre: a.nombre, Tipo: a.tipo_actividad, Precio: `$${a.precio}`, Dirección: a.direccion, _id: a.idActividad, _raw: a }));
  }
}

// ─────────────────────────────────────────────────────────
// ADMIN FORM MODAL (Create / Edit)
// ─────────────────────────────────────────────────────────
function AdminFormModal({ tab, target, onClose, onSave }: { tab: AdminTab; target: any; onClose: () => void; onSave: (item: any) => void }) {
  const isEdit = !!target;

  // For clientes we render a dedicated form component
  if (tab === "clientes") {
    return (
      <div style={{ padding: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 20, color: "#006b64", margin: 0, fontWeight: 600 }}>{isEdit ? "Editar" : "Crear"} cliente</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}><IconX /></button>
        </div>
        <ClienteForm target={target} onClose={onClose} onSave={onSave} />
      </div>
    );
  }

  // Generic form for hoteles / habitaciones / actividades
  const [form, setForm] = useState<Record<string, string>>(getDefaultForm(tab, target));
  const set = (k: string) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    const payload = buildPayload(tab, form, target);
    try {
      if (isEdit) {
        const id = getEditId(tab, target);
        await apiFetch(`/${tab === "habitaciones" ? "habitacion" : tab === "hoteles" ? "hotel" : "actividad"}/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/${tab === "habitaciones" ? "habitacion" : tab === "hoteles" ? "hotel" : "actividad"}`, { method: "POST", body: JSON.stringify(payload) });
      }
    } catch {}
    onSave(buildLocalItem(tab, form, target));
    onClose();
  };

  const fields = getFormFields(tab, isEdit);

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontSize: 20, color: "#006b64", margin: 0, fontWeight: 600 }}>{isEdit ? "Editar" : "Crear"} {tab.slice(0, -1)}</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}><IconX /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {fields.map((f) => (
          <InputField key={f.key} label={f.label} value={form[f.key] || ""} onChange={set(f.key)} placeholder={f.placeholder} type={f.type} disabled={f.disabled} />
        ))}
        <button onClick={handleSubmit} style={{ marginTop: 8, padding: "12px 0", borderRadius: 10, border: "none", background: "#006b64", color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.8px" }}>{isEdit ? "Guardar cambios" : "Crear"}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CLIENTE FORM (full: nombre, apellidos, fecha nac, tipo ID,
// cédula, país, dirección CR con cascading, 2 teléfonos, correo)
// ─────────────────────────────────────────────────────────
function ClienteForm({ target, onClose, onSave }: { target: any; onClose: () => void; onSave: (item: any) => void }) {
  const isEdit = !!target;
  const [form, setForm] = useState({
    nombre: target?.nombre || "",
    apellido1: target?.apellido_1 || "",
    apellido2: target?.apellido_2 || "",
    fechaNac: target?.fecha_nacimiento || "",
    tipoId: target?.tipo_identificacion || "Cédula nacional",
    cedula: target?.cedula || "",
    pais: target?.pais_residencia || "Costa Rica",
    // CR address fields (parsed from direccion if exists)
    provincia: "",
    canton: "",
    distrito: "",
    direccionExtra: target?.direccion || "",
    // Teléfonos
    tel1Code: "+506",
    tel1: "",
    tel2Code: "+506",
    tel2: "",
    // Correo
    correo: target?.correo || "",
  });
  const [error, setError] = useState("");
  const set = (k: string) => (v: string) => {
    setForm((p) => {
      const next = { ...p, [k]: v };
      // Reset cascading when provincia changes
      if (k === "provincia") { next.canton = ""; next.distrito = ""; }
      // Reset distrito when canton changes
      if (k === "canton") { next.distrito = ""; }
      // If country changes to Costa Rica, reset code to +506
      if (k === "pais" && v === "Costa Rica") { next.tel1Code = "+506"; next.tel2Code = "+506"; }
      return next;
    });
  };

  const isCR = form.pais === "Costa Rica";
  const provincias = Object.keys(CR_PROVINCIAS);
  const cantones = form.provincia && CR_PROVINCIAS[form.provincia] ? Object.keys(CR_PROVINCIAS[form.provincia]) : [];
  const distritos = form.provincia && form.canton && CR_PROVINCIAS[form.provincia]?.[form.canton] ? CR_PROVINCIAS[form.provincia][form.canton] : [];

  const handleSubmit = async () => {
    setError("");
    if (!form.nombre || !form.apellido1 || !form.fechaNac || !form.cedula || !form.correo) {
      setError("Llene todos los campos obligatorios (marcados con *).");
      return;
    }
    if (isCR && (!form.provincia || !form.canton || !form.distrito)) {
      setError("Para residentes de Costa Rica, seleccione Provincia, Cantón y Distrito.");
      return;
    }

    // Build dirección string
    const direccion = isCR
      ? `${form.provincia}, ${form.canton}, ${form.distrito}${form.direccionExtra ? " — " + form.direccionExtra : ""}`
      : form.direccionExtra;

    // Build telefonos string
    const telefonos = [
      form.tel1 ? `${form.tel1Code} ${form.tel1}` : "",
      form.tel2 ? `${form.tel2Code} ${form.tel2}` : "",
    ].filter(Boolean).join(" | ");

    const payload = isEdit
      ? { correo: form.correo, direccion, pais: form.pais }
      : {
          cedula: form.cedula,
          nombre: form.nombre,
          apellido1: form.apellido1,
          apellido2: form.apellido2,
          correo: form.correo,
          tipoIdentificacion: form.tipoId,
          pais: form.pais,
          direccion,
          fechaNacimiento: form.fechaNac,
        };

    try {
      if (isEdit) {
        await apiFetch(`/cliente/${target.idCliente}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/cliente", { method: "POST", body: JSON.stringify(payload) });
      }
    } catch {}

    const item: Cliente = {
      idCliente: target?.idCliente || Date.now(),
      cedula: form.cedula || target?.cedula,
      nombre: form.nombre,
      apellido_1: form.apellido1,
      apellido_2: form.apellido2,
      correo: form.correo,
      tipo_identificacion: form.tipoId,
      pais_residencia: form.pais,
      direccion,
      edad: target?.edad || 0,
      telefonos,
    };
    onSave(item);
    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Nombre y apellidos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <InputField label="Nombre *" value={form.nombre} onChange={set("nombre")} placeholder="Ana" />
        <InputField label="Primer apellido *" value={form.apellido1} onChange={set("apellido1")} placeholder="Martínez" />
      </div>
      <InputField label="Segundo apellido" value={form.apellido2} onChange={set("apellido2")} placeholder="Ruiz" />

      {/* Fecha de nacimiento */}
      <InputField label="Fecha de nacimiento *" value={form.fechaNac} onChange={set("fechaNac")} type="date" />

      {/* Tipo de identificación */}
      <SelectField label="Tipo de identificación *" value={form.tipoId} onChange={set("tipoId")} options={TIPOS_IDENTIFICACION} />

      {/* Cédula / Número de ID */}
      <InputField label={`${form.tipoId === "Cédula nacional" ? "Cédula nacional" : "Número de identificación"} *`} value={form.cedula} onChange={set("cedula")} placeholder="102938475" disabled={isEdit} />

      {/* País de residencia */}
      <SelectField
        label="País de residencia *"
        value={form.pais}
        onChange={set("pais")}
        options={["Costa Rica", "Colombia", "México", "Estados Unidos", "Brasil", "Argentina", "Chile", "Perú", "Ecuador", "Venezuela", "Panamá", "Honduras", "El Salvador", "Guatemala", "Nicaragua", "España", "Reino Unido", "Italia", "Francia", "Alemania", "Japón", "China", "India", "Australia", "Otro"]}
      />

      {/* Dirección: si es CR mostrar provincia/canton/distrito */}
      {isCR ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <SelectField label="Provincia *" value={form.provincia} onChange={set("provincia")} options={provincias} placeholder="Seleccione..." />
            <SelectField label="Cantón *" value={form.canton} onChange={set("canton")} options={cantones} placeholder={form.provincia ? "Seleccione..." : "—"} disabled={!form.provincia} />
            <SelectField label="Distrito *" value={form.distrito} onChange={set("distrito")} options={distritos} placeholder={form.canton ? "Seleccione..." : "—"} disabled={!form.canton} />
          </div>
          <InputField label="Dirección detallada (opcional)" value={form.direccionExtra} onChange={set("direccionExtra")} placeholder="Calle 5, Av. Central..." />
        </>
      ) : (
        <InputField label="Dirección" value={form.direccionExtra} onChange={set("direccionExtra")} placeholder="Dirección completa..." />
      )}

      {/* Teléfonos */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label style={{ display: "block", fontSize: 12, color: "#888", letterSpacing: "0.5px" }}>Teléfonos</label>
        <PhoneField
          label="Teléfono 1"
          code={form.tel1Code}
          onCodeChange={set("tel1Code")}
          number={form.tel1}
          onNumberChange={set("tel1")}
          lockCode={isCR}
        />
        <PhoneField
          label="Teléfono 2 (opcional)"
          code={form.tel2Code}
          onCodeChange={set("tel2Code")}
          number={form.tel2}
          onNumberChange={set("tel2")}
          lockCode={isCR}
        />
      </div>

      {/* Correo */}
      <InputField label="Correo electrónico *" value={form.correo} onChange={set("correo")} placeholder="ana@correo.com" />

      {error && <p style={{ color: "#d4875e", fontSize: 12, margin: 0 }}>{error}</p>}
      <button onClick={handleSubmit} style={{ marginTop: 8, padding: "12px 0", borderRadius: 10, border: "none", background: "#006b64", color: "#fff", fontSize: 14, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.8px" }}>{isEdit ? "Guardar cambios" : "Crear cliente"}</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// HELPER: getDefaultForm (hoteles / habitaciones / actividades only)
// ─────────────────────────────────────────────────────────
function getDefaultForm(tab: AdminTab, target: any): Record<string, string> {
  if (!target) return {};
  switch (tab) {
    case "hoteles": return { cedula: target.cedula, nombreHotel: target.nombreHotel, tipo: target.tipo, correo: target.correo, url: target.url || "", gps: target.gps || "", direccion: target.direccion || "", telefono: "", codigoPais: "+506" };
    case "habitaciones": return { numero: String(target.numeroHabitacion), nombreTipo: target.tipoHabitacion, estado: target.estado };
    case "actividades": return { cedula: target.cedula, nombre: target.nombre, contacto: target.contacto || "", correo: target.correo, tipo: target.tipo_actividad, descripcion: target.descripcion || "", precio: String(target.precio), direccion: target.direccion || "" };
    default: return {};
  }
}

function getFormFields(tab: AdminTab, isEdit: boolean): { key: string; label: string; placeholder: string; type?: string; disabled?: boolean }[] {
  switch (tab) {
    case "hoteles":
      return [
        { key: "cedula", label: "Cédula", placeholder: "123456789", disabled: isEdit },
        { key: "nombreHotel", label: "Nombre del hotel", placeholder: "StayLimón Resort" },
        { key: "tipo", label: "Tipo", placeholder: "Resort" },
        { key: "correo", label: "Correo", placeholder: "hotel@correo.com" },
        { key: "url", label: "URL (opcional)", placeholder: "https://hotel.com" },
        { key: "gps", label: "GPS (opcional)", placeholder: "10.0566, -83.5238" },
        { key: "direccion", label: "Dirección", placeholder: "Calle principal..." },
        ...(isEdit ? [] : [{ key: "telefono", label: "Teléfono", placeholder: "22334455" }, { key: "codigoPais", label: "Código país", placeholder: "+506" }]),
      ];
    case "habitaciones":
      return [
        { key: "numero", label: "Número de habitación", placeholder: "101", disabled: isEdit, type: "number" },
        { key: "nombreTipo", label: "Tipo de habitación", placeholder: "Suite" },
        ...(isEdit ? [{ key: "estado", label: "Estado", placeholder: "DISPONIBLE" }] : []),
      ];
    case "actividades":
      return [
        { key: "cedula", label: "Cédula", placeholder: "111000111", disabled: isEdit },
        { key: "nombre", label: "Nombre", placeholder: "Tour del río" },
        { key: "contacto", label: "Contacto (opcional)", placeholder: "Juan Pérez" },
        { key: "correo", label: "Correo", placeholder: "tour@correo.com" },
        { key: "tipo", label: "Tipo de actividad", placeholder: "Aventura" },
        { key: "descripcion", label: "Descripción", placeholder: "Recorrido en bote..." },
        { key: "precio", label: "Precio", placeholder: "45.00", type: "number" },
        { key: "direccion", label: "Dirección", placeholder: "Muelle principal..." },
      ];
    default: return [];
  }
}

function buildPayload(tab: AdminTab, form: Record<string, string>, target: any): any {
  switch (tab) {
    case "hoteles":
      return target
        ? { nombre: form.nombreHotel, tipo: form.tipo, correo: form.correo, url: form.url, gps: form.gps, detalleDireccion: form.direccion }
        : { cedula: form.cedula, nombre: form.nombreHotel, tipo: form.tipo, correo: form.correo, url: form.url, gps: form.gps, detalleDireccion: form.direccion, telefono: form.telefono, codigoPais: form.codigoPais };
    case "habitaciones":
      return target
        ? { estado: form.estado }
        : { numero: parseInt(form.numero), nombreTipo: form.nombreTipo };
    case "actividades":
      return target
        ? { precio: parseFloat(form.precio), descripcion: form.descripcion, detalleDireccion: form.direccion }
        : { cedula: form.cedula, nombre: form.nombre, contacto: form.contacto, correo: form.correo, tipo: form.tipo, descripcion: form.descripcion, precio: parseFloat(form.precio), detalleDireccion: form.direccion };
    default: return {};
  }
}

function buildLocalItem(tab: AdminTab, form: Record<string, string>, target: any): any {
  switch (tab) {
    case "hoteles":
      return { idHotel: target?.idHotel || Date.now(), cedula: form.cedula || target?.cedula, nombreHotel: form.nombreHotel, tipo: form.tipo, correo: form.correo, url: form.url, gps: form.gps, direccion: form.direccion, telefonos: form.telefono || target?.telefonos || "", redesSociales: target?.redesSociales || "", servicios: target?.servicios || "" };
    case "habitaciones":
      return { numeroHabitacion: target?.numeroHabitacion || parseInt(form.numero), estado: form.estado || "DISPONIBLE", tipoHabitacion: form.nombreTipo || target?.tipoHabitacion, descripcion: target?.descripcion || "", precio: target?.precio || 0, tipo_cama: target?.tipo_cama || "", comodidades: target?.comodidades || "", fotos: "" };
    case "actividades":
      return { idActividad: target?.idActividad || Date.now(), cedula: form.cedula || target?.cedula, nombre: form.nombre || target?.nombre, contacto: form.contacto || target?.contacto, correo: form.correo || target?.correo, tipo_actividad: form.tipo || target?.tipo_actividad, descripcion: form.descripcion, precio: parseFloat(form.precio) || target?.precio, direccion: form.direccion, telefonos: target?.telefonos || "" };
    default: return {};
  }
}

function getEditId(tab: AdminTab, target: any): number {
  switch (tab) {
    case "hoteles": return target.idHotel;
    case "clientes": return target.idCliente;
    case "habitaciones": return target.numeroHabitacion;
    case "actividades": return target.idActividad;
  }
}

// ─────────────────────────────────────────────────────────
// REUSABLE SELECT
// ─────────────────────────────────────────────────────────
function SelectField({ label, value, onChange, options, placeholder = "Seleccione...", disabled = false }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; disabled?: boolean }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 5, letterSpacing: "0.5px" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{ width: "100%", padding: "10px 36px 10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", background: disabled ? "#f5f3f0" : "#fff", color: value ? "#333" : "#aaa", outline: "none", boxSizing: "border-box", transition: "border .2s", appearance: "none", WebkitAppearance: "none", cursor: disabled ? "not-allowed" : "pointer" }}
          onFocus={e => (e.target.style.borderColor = "#006b64")}
          onBlur={e => (e.target.style.borderColor = "#ddd")}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: disabled ? "#bbb" : "#888" }}><IconChevronDown /></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// REUSABLE PHONE FIELD (código país + número)
// ─────────────────────────────────────────────────────────
function PhoneField({ label, code, onCodeChange, number, onNumberChange, lockCode = false }: { label: string; code: string; onCodeChange: (v: string) => void; number: string; onNumberChange: (v: string) => void; lockCode: boolean }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, color: "#aaa", marginBottom: 4 }}>{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        {/* Country code selector */}
        <div style={{ position: "relative", width: 100, flexShrink: 0 }}>
          <select
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            disabled={lockCode}
            style={{ width: "100%", padding: "10px 28px 10px 10px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 13, fontFamily: "inherit", background: lockCode ? "#f0ece6" : "#fff", color: "#333", outline: "none", appearance: "none", WebkitAppearance: "none", cursor: lockCode ? "not-allowed" : "pointer", boxSizing: "border-box" }}
            onFocus={e => (e.target.style.borderColor = "#006b64")}
            onBlur={e => (e.target.style.borderColor = "#ddd")}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} {c.name}</option>
            ))}
          </select>
          <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#888" }}><IconChevronDown /></div>
        </div>
        {/* Number input */}
        <input
          type="tel"
          value={number}
          onChange={(e) => onNumberChange(e.target.value.replace(/\D/g, ""))}
          placeholder="88776655"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#333", outline: "none", boxSizing: "border-box", transition: "border .2s" }}
          onFocus={e => (e.target.style.borderColor = "#006b64")}
          onBlur={e => (e.target.style.borderColor = "#ddd")}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// REUSABLE INPUT
// ─────────────────────────────────────────────────────────
function InputField({ label, value, onChange, placeholder, type = "text", disabled = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 5, letterSpacing: "0.5px" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, fontFamily: "inherit", background: disabled ? "#f5f3f0" : "#fff", color: disabled ? "#999" : "#333", outline: "none", boxSizing: "border-box", transition: "border .2s" }}
        onFocus={e => (e.target.style.borderColor = "#006b64")}
        onBlur={e => (e.target.style.borderColor = "#ddd")}
      />
    </div>
  );
}
