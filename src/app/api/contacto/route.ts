// src/app/api/contacto/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { supabaseAdmin } = await import("@/lib/supabase-admin");
  const { tabla, id } = await req.json();

  if (tabla !== "solicitudes" && tabla !== "ofertas") {
    return NextResponse.json({ error: "Tabla inválida" }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const columnas = tabla === "solicitudes"
    ? "nombre, telefono, categoria"
    : "nombre, telefono, categorias";

  const { data, error } = await supabaseAdmin
    .from(tabla)
    .select(columnas)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const telefonoLimpio = data.telefono.replace(/\D/g, "").replace(/^0/, "58");

  const mensaje =
    tabla === "solicitudes"
      ? `Hola ${data.nombre}, vi tu solicitud de *${data.categoria}* en VenezuelaSolidaria y me gustaría ayudarte 🙏`
      : `Hola ${data.nombre}, vi tu oferta de ayuda en VenezuelaSolidaria y necesito apoyo 🙏`;

  const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
  return NextResponse.json({ url });
}
