"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TurnstileWidget from "@/components/turnstile-widget";

const CATEGORIAS = [
  "Alimentación", "Medicamentos", "Vivienda",
  "Trabajo / empleo", "Niños y familias",
  "Transporte", "Apoyo económico", "Orientación",
];

export default function OfrecerAyuda() {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [form, setForm] = useState({
    nombre: "", telefono: "", ciudad: "", descripcion: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCategoria = (cat: string) => {
    setCategorias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (categorias.length === 0) {
    setError("Selecciona al menos una categoría de ayuda.");
    return;
  }
  if (!turnstileToken) {
    setError("Por favor completa la verificación de seguridad.");
    return;
  }
  setCargando(true);
  setError("");

  const verify = await fetch("/api/verify-turnstile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: turnstileToken }),
  });
  const verifyData = await verify.json();

  if (!verifyData.success) {
    setError("La verificación de seguridad falló. Intenta de nuevo.");
    setCargando(false);
    return;
  }

  const { error } = await supabase.from("ofertas").insert([{ ...form, categorias }]);
  if (error) setError("Hubo un error al enviar. Intenta de nuevo.");
  else setEnviado(true);
  setCargando(false);
};

  return (
    <main className="min-h-screen bg-background">
  

      <div className="max-w-xl mx-auto px-6 py-16">
        {enviado ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold mb-3">¡Gracias por tu solidaridad!</h2>
            <p className="text-muted-foreground mb-8">Tu oferta fue registrada. Te contactaremos pronto.</p>
            <Button variant="outline" asChild>
              <a href="/">Volver al inicio</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition mb-6 inline-block">← Volver</a>
              <h1 className="text-3xl font-bold mb-2">Ofrecer ayuda</h1>
              <p className="text-muted-foreground">Tu apoyo puede cambiar la vida de alguien. Gracias por estar aquí.</p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Tu nombre</Label>
                <Input id="nombre" name="nombre" required value={form.nombre}
                  onChange={handleChange} placeholder="Carlos Pérez" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telefono">Teléfono o WhatsApp</Label>
                <Input id="telefono" name="telefono" required value={form.telefono}
                  onChange={handleChange} placeholder="+58 412 000 0000" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ciudad">Estado / Ciudad</Label>
                <Input id="ciudad" name="ciudad" required value={form.ciudad}
                  onChange={handleChange} placeholder="Maracaibo, Zulia" />
              </div>

              <div className="space-y-1.5">
                <Label>¿Con qué puedes ayudar?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIAS.map((cat) => (
                    <label key={cat} onClick={() => toggleCategoria(cat)}
                      className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 cursor-pointer transition text-sm
                        ${categorias.includes(cat)
                          ? "border-yellow-400 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200"
                          : "border-border hover:border-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950"}`}>
                      <input type="checkbox" checked={categorias.includes(cat)}
                        onChange={() => {}} className="accent-yellow-400" />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="descripcion">Cuéntanos más</Label>
                <Textarea id="descripcion" name="descripcion" value={form.descripcion}
                  onChange={handleChange} rows={4}
                  placeholder="Describe cómo puedes ayudar, disponibilidad..." />
              </div>

              <TurnstileWidget onVerify={setTurnstileToken} />

              <Button type="submit" disabled={cargando}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900">
                {cargando ? "Enviando..." : "Registrar mi ayuda"}
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}