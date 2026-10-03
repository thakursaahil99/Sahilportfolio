"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

/** Copies the profile email; falls back to a mailto: link if the clipboard is blocked. */
export function useCopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return { copied, copy };
}
