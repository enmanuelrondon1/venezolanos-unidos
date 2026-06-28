"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function PedirAyuda() {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "", telefono: "", ciudad: "",
    categoria: "", descripcion: "", urgencia: "Media",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    const { error } = await supabase.from("solicitudes").insert([form]);
    if (error) setError("Hubo un error al enviar. Intenta de nuevo.");
    else setEnviado(true);
    setCargando(false);
  };

  return (
    <main className="min-h-screen bg-background">
     

      <div className="max-w-xl mx-auto px-6 py-16">
        {enviado ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold mb-3">Tu solicitud fue enviada</h2>
            <p className="text-muted-foreground mb-8">Alguien de nuestra comunidad se pondrá en contacto contigo pronto.</p>
            <Button variant="outline" asChild>
              <a href="/">Volver al inicio</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition mb-6 inline-block">← Volver</a>
              <h1 className="text-3xl font-bold mb-2">Pedir ayuda</h1>
              <p className="text-muted-foreground">Cuéntanos qué necesitas. Estamos aquí para ayudarte.</p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Tu nombre</Label>
                <Input id="nombre" name="nombre" required value={form.nombre}
                  onChange={handleChange} placeholder="María González" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="telefono">Teléfono o WhatsApp</Label>
                <Input id="telefono" name="telefono" required value={form.telefono}
                  onChange={handleChange} placeholder="+58 412 000 0000" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ciudad">Estado / Ciudad</Label>
                <Input id="ciudad" name="ciudad" required value={form.ciudad}
                  onChange={handleChange} placeholder="Caracas, Distrito Capital" />
              </div>

              <div className="space-y-1.5">
                <Label>¿Qué necesitas?</Label>
                <Select required onValueChange={(val) => setForm({ ...form, categoria: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Alimentación","Medicamentos","Vivienda","Trabajo","Niños y familias","Transporte","Otro"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="descripcion">Cuéntanos más</Label>
                <Textarea id="descripcion" name="descripcion" required value={form.descripcion}
                  onChange={handleChange} rows={4}
                  placeholder="Describe tu situación con detalle..." />
              </div>

              <div className="space-y-1.5">
                <Label>Urgencia</Label>
                <div className="flex gap-4">
                  {["Alta", "Media", "Baja"].map((nivel) => (
                    <label key={nivel} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="urgencia" value={nivel}
                        checked={form.urgencia === nivel} onChange={handleChange}
                        className="accent-yellow-400" />
                      <span className="text-sm">{nivel}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={cargando} className="w-full bg-gray-900 hover:bg-gray-700">
                {cargando ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}