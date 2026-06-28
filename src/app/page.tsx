"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [stats, setStats] = useState({ solicitudes: 0, ofertas: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: s }, { count: o }] = await Promise.all([
        supabase.from("solicitudes").select("*", { count: "exact", head: true }),
        supabase.from("ofertas").select("*", { count: "exact", head: true }),
      ]);
      setStats({ solicitudes: s || 0, ofertas: o || 0 });
    };
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇻🇪</span>
          <span className="font-semibold text-lg">VenezuelaSolidaria</span>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <a href="/solicitudes">Ver solicitudes</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/pedir-ayuda">Necesito ayuda</a>
          </Button>
          <Button asChild size="sm" className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-0">
            <a href="/ofrecer-ayuda">Quiero ayudar</a>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-1.5 rounded-full mb-6 border border-red-100">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Plataforma de ayuda para venezolanos
        </div>
        <h1 className="text-5xl font-bold mb-5 leading-tight">
          Unidos podemos ayudarnos
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Conectamos a venezolanos que necesitan apoyo con personas dispuestas a ayudar. Comida, medicina, trabajo, vivienda y más.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="outline" className="rounded-xl border-2 border-foreground">
            <a href="/pedir-ayuda">Pedir ayuda</a>
          </Button>
          <Button asChild size="lg" className="rounded-xl bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-0">
            <a href="/ofrecer-ayuda">Ofrecer ayuda</a>
          </Button>
        </div>
      </section>

      {/* Contadores */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border rounded-2xl p-6 text-center hover:border-gray-300 transition">
            <p className="text-5xl font-bold mb-2">{stats.solicitudes}</p>
            <p className="text-muted-foreground text-sm">personas pidiendo ayuda</p>
            <Button asChild variant="link" size="sm" className="mt-2 text-xs">
              <a href="/solicitudes">Ver solicitudes →</a>
            </Button>
          </div>
          <div className="border border-border rounded-2xl p-6 text-center hover:border-gray-300 transition">
            <p className="text-5xl font-bold text-yellow-500 mb-2">{stats.ofertas}</p>
            <p className="text-muted-foreground text-sm">personas ofreciendo ayuda</p>
            <Button asChild variant="link" size="sm" className="mt-2 text-xs">
              <a href="/ofrecer-ayuda">Unirme →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-center text-muted-foreground text-sm uppercase tracking-widest mb-10">
          ¿En qué podemos ayudar?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: "🍽️", label: "Alimentación" },
            { icon: "💊", label: "Medicamentos" },
            { icon: "🏠", label: "Vivienda" },
            { icon: "💼", label: "Trabajo" },
            { icon: "👶", label: "Niños y familias" },
            { icon: "🚌", label: "Transporte" },
          ].map((cat) => (
            <a href={`/solicitudes?categoria=${cat.label}`} key={cat.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition cursor-pointer">
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-medium text-sm">{cat.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-3">¿Puedes ayudar a alguien hoy?</h2>
          <p className="text-muted-foreground mb-8">
            No importa cuánto. Un gesto pequeño puede cambiar el día de alguien.
          </p>
          <Button asChild size="lg" className="rounded-xl bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-0">
            <a href="/ofrecer-ayuda">Registrar mi ayuda</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        VenezuelaSolidaria — hecho con amor por y para venezolanos 🇻🇪
      </footer>
    </main>
  );
}