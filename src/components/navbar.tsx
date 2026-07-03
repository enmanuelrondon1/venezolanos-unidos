// src/components/navbar.tsx
"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/solicitudes", label: "Ver solicitudes" },
  { href: "/ofertas", label: "Ver ofertas" },
  { href: "/pedir-ayuda", label: "Necesito ayuda" },
];

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="border-b px-6 py-4 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2">
        <span className="text-2xl">🇻🇪</span>
        <span className="font-semibold text-lg">VenezuelaSolidaria</span>
      </a>

      <div className="flex gap-3 flex-wrap justify-end">
        {LINKS.map((link) => (
          <Button
            key={link.href}
            asChild
            variant="outline"
            size="sm"
            className={pathname === link.href ? "border-gray-900" : ""}
          >
            <a href={link.href}>{link.label}</a>
          </Button>
        ))}

        <Button
          asChild
          size="sm"
          className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-0"
        >
          <a href="/ofrecer-ayuda">Quiero ayudar</a>
        </Button>
      </div>
    </nav>
  );
}
