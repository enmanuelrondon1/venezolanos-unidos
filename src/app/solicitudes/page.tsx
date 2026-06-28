"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type Solicitud = {
  id: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  categoria: string;
  descripcion: string;
  urgencia: string;
  created_at: string;
};

const ICONOS: Record<string, string> = {
  Alimentación: "🍽️",
  Medicamentos: "💊",
  Vivienda: "🏠",
  Trabajo: "💼",
  "Niños y familias": "👶",
  Transporte: "🚌",
  Otro: "🤝",
};

const URGENCIA_COLORS: Record<string, string> = {
  Alta: "bg-red-50 text-red-600 border-red-100",
  Media: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Baja: "bg-green-50 text-green-700 border-green-100",
};

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("Todos");

  const categorias = [
    "Todos",
    "Alimentación",
    "Medicamentos",
    "Vivienda",
    "Trabajo",
    "Niños y familias",
    "Transporte",
    "Otro",
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) setFiltro(cat);

    const fetchSolicitudes = async () => {
      setCargando(true);
      const { data } = await supabase
        .from("solicitudes")
        .select("*")
        .order("created_at", { ascending: false });
      setSolicitudes(data || []);
      setCargando(false);
    };
    fetchSolicitudes();
  }, []);

  const filtradas =
    filtro === "Todos"
      ? solicitudes
      : solicitudes.filter((s) => s.categoria === filtro);

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🇻🇪</span>
          <span className="font-semibold text-lg">VenezuelaSolidaria</span>
        </a>
        <Button asChild variant="outline" size="sm">
          <a href="/pedir-ayuda">Pedir ayuda</a>
        </Button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Solicitudes de ayuda</h1>
          <p className="text-muted-foreground">
            {solicitudes.length} persona{solicitudes.length !== 1 ? "s" : ""}{" "}
            necesitan apoyo ahora mismo.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition
                ${
                  filtro === cat
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-border hover:border-gray-400"
                }`}
            >
              {ICONOS[cat] && <span className="mr-1">{ICONOS[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Lista */}
        {cargando ? (
          <div className="text-center py-20 text-muted-foreground">
            Cargando solicitudes...
          </div>
        ) : filtradas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🕊️</div>
            <p className="text-muted-foreground">
              No hay solicitudes en esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtradas.map((s) => (
              <div
                key={s.id}
                className="border border-border rounded-2xl p-5 hover:border-gray-300 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {ICONOS[s.categoria] || "🤝"}
                    </span>
                    <div>
                      <p className="font-medium">{s.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.ciudad}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full border font-medium ${URGENCIA_COLORS[s.urgencia] || URGENCIA_COLORS["Media"]}`}
                    >
                      {s.urgencia}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                      {s.categoria}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {s.descripcion}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("es-VE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <a
                    href={`https://wa.me/${s.telefono.replace(/\D/g, "").replace(/^0/, "58")}?text=${encodeURIComponent(`Hola ${s.nombre}, vi tu solicitud de *${s.categoria}* en VenezuelaSolidaria y me gustaría ayudarte 🙏`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-500 font-medium transition"
                  >
                    <span>💬</span> Contactar por WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
