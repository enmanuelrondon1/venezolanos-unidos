// src/app/admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  resuelto: boolean;
  created_at: string;
};

type Oferta = {
  id: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  categorias: string[];
  descripcion: string;
  resuelto: boolean;
  created_at: string;
};

const URGENCIA_COLORS: Record<string, string> = {
  Alta: "bg-red-50 text-red-600 border-red-100",
  Media: "bg-yellow-50 text-yellow-700 border-yellow-100",
  Baja: "bg-green-50 text-green-700 border-green-100",
};

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<"solicitudes" | "ofertas">("solicitudes");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setCargando(true);
    const [{ data: s }, { data: o }] = await Promise.all([
      supabase.from("solicitudes").select("*").order("created_at", { ascending: false }),
      supabase.from("ofertas").select("*").order("created_at", { ascending: false }),
    ]);
    setSolicitudes(s || []);
    setOfertas(o || []);
    setCargando(false);
  };

  const handleResuelto = async (tabla: "solicitudes" | "ofertas", id: string, valor: boolean) => {
    await supabase.from(tabla).update({ resuelto: valor }).eq("id", id);
    fetchData();
  };

  const handleEliminar = async (tabla: "solicitudes" | "ofertas", id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este registro?")) return;
    await supabase.from(tabla).delete().eq("id", id);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const items = tab === "solicitudes" ? solicitudes : ofertas;

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇻🇪</span>
          <span className="font-semibold">Admin — VenezuelaSolidaria</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("solicitudes")}
            className={`px-5 py-2 rounded-full text-sm border transition font-medium ${
              tab === "solicitudes"
                ? "bg-gray-900 text-white border-gray-900"
                : "border-border hover:border-gray-400"
            }`}
          >
            Solicitudes ({solicitudes.length})
          </button>
          <button
            onClick={() => setTab("ofertas")}
            className={`px-5 py-2 rounded-full text-sm border transition font-medium ${
              tab === "ofertas"
                ? "bg-gray-900 text-white border-gray-900"
                : "border-border hover:border-gray-400"
            }`}
          >
            Ofertas ({ofertas.length})
          </button>
        </div>

        {cargando ? (
          <div className="text-center py-20 text-muted-foreground">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No hay registros.</div>
        ) : (
          <div className="grid gap-4">
            {tab === "solicitudes"
              ? solicitudes.map((item) => {
                  const waLink = `https://wa.me/${item.telefono.replace(/\D/g, "").replace(/^0/, "58")}`;
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-2xl p-5 transition ${
                        item.resuelto
                          ? "opacity-50 border-border"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-medium">{item.nombre}</p>
                          <p className="text-sm text-muted-foreground">{item.ciudad}</p>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-green-600 hover:text-green-500 font-medium"
                          >
                            💬 {item.telefono}
                          </a>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                              URGENCIA_COLORS[item.urgencia] || URGENCIA_COLORS["Media"]
                            }`}
                          >
                            {item.urgencia}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                            {item.categoria}
                          </span>
                        </div>
                      </div>

                      {item.descripcion && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {item.descripcion}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString("es-VE", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResuelto("solicitudes", item.id, !item.resuelto)}
                            className={item.resuelto ? "text-green-600 border-green-200" : ""}
                          >
                            {item.resuelto ? "✓ Resuelto" : "Marcar resuelto"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEliminar("solicitudes", item.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ofertas.map((item) => {
                  const waLink = `https://wa.me/${item.telefono.replace(/\D/g, "").replace(/^0/, "58")}`;
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-2xl p-5 transition ${
                        item.resuelto
                          ? "opacity-50 border-border"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-medium">{item.nombre}</p>
                          <p className="text-sm text-muted-foreground">{item.ciudad}</p>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-green-600 hover:text-green-500 font-medium"
                          >
                            💬 {item.telefono}
                          </a>
                        </div>
                        <div className="flex flex-col gap-2 items-end flex-wrap">
                          {item.categorias?.map((cat) => (
                            <span
                              key={cat}
                              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {item.descripcion && (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {item.descripcion}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString("es-VE", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResuelto("ofertas", item.id, !item.resuelto)}
                            className={item.resuelto ? "text-green-600 border-green-200" : ""}
                          >
                            {item.resuelto ? "✓ Resuelto" : "Marcar resuelto"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEliminar("ofertas", item.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
      </div>
    </main>
  );
}