// src/app/ofertas/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type Oferta = {
  id: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  categorias: string[];
  descripcion: string;
  created_at: string;
};

const ICONOS: Record<string, string> = {
  "Alimentación": "🍽️",
  "Medicamentos": "💊",
  "Vivienda": "🏠",
  "Trabajo / empleo": "💼",
  "Niños y familias": "👶",
  "Transporte": "🚌",
  "Apoyo económico": "💰",
  "Orientación": "🧭",
};

const CATEGORIAS = [
  "Todos",
  "Alimentación",
  "Medicamentos",
  "Vivienda",
  "Trabajo / empleo",
  "Niños y familias",
  "Transporte",
  "Apoyo económico",
  "Orientación",
];

export default function Ofertas() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    if (cat) setFiltro(cat);

    const fetchOfertas = async () => {
      setCargando(true);
      const { data } = await supabase
        .from("ofertas")
        .select("*")
        .order("created_at", { ascending: false });
      setOfertas(data || []);
      setCargando(false);
    };
    fetchOfertas();
  }, []);

  const filtradas =
    filtro === "Todos"
      ? ofertas
      : ofertas.filter((o) => o.categorias?.includes(filtro));

  return (
    <main className="min-h-screen bg-background">
    

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Ofertas de ayuda disponibles</h1>
          <p className="text-muted-foreground">
            {ofertas.length} persona{ofertas.length !== 1 ? "s" : ""} dispuesta
            {ofertas.length !== 1 ? "s" : ""} a apoyar ahora mismo.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIAS.map((cat) => (
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
            Cargando ofertas...
          </div>
        ) : filtradas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🕊️</div>
            <p className="text-muted-foreground">
              No hay ofertas en esta categoría todavía.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtradas.map((o) => (
              <div
                key={o.id}
                className="border border-border rounded-2xl p-5 hover:border-gray-300 transition"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {ICONOS[o.categorias?.[0]] || "🤝"}
                    </span>
                    <div>
                      <p className="font-medium">{o.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {o.ciudad}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                    {o.categorias?.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {o.descripcion && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {o.descripcion}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("es-VE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <a
                    href={`https://wa.me/${o.telefono.replace(/\D/g, "").replace(/^0/, "58")}?text=${encodeURIComponent(`Hola ${o.nombre}, vi tu oferta de ayuda en VenezuelaSolidaria y necesito apoyo 🙏`)}`}
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
