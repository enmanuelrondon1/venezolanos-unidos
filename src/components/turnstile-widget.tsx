// src/components/turnstile-widget.tsx
"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function TurnstileWidget({
  onVerify,
}: {
  onVerify: (token: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    const scriptId = "turnstile-script";

    const renderWidget = () => {
      if (ref.current && window.turnstile && widgetId.current === null) {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          callback: (token: string) => onVerify(token),
          "expired-callback": () => onVerify(""),
        });
      }
    };

    if (document.getElementById(scriptId)) {
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.onload = renderWidget;
      document.body.appendChild(script);
    }
  }, [onVerify]);

  return <div ref={ref} className="mt-2" />;
}