"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { ContactRole } from "@/content/types";
import { parseRole } from "@/lib/contact-constants";

/**
 * Reads ?role=… (and the legacy #contact?role=… form) and reports it.
 * Rendered inside <Suspense> so the page itself stays statically generated.
 */
export function RolePreselect({ onRole }: { onRole: (role: ContactRole) => void }) {
  const params = useSearchParams();
  const fromQuery = params.get("role");

  useEffect(() => {
    const fromHash = () => {
      const q = window.location.hash.split("?")[1];
      return q ? new URLSearchParams(q).get("role") : null;
    };
    const apply = () => {
      const role = parseRole(fromQuery) ?? parseRole(fromHash());
      if (role) onRole(role);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [fromQuery, onRole]);

  return null;
}
