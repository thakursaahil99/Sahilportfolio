"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "./PageTransition";

type TLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link that plays the curtain page transition for internal navigation. */
export default function TLink({ href, onClick, target, ...rest }: TLinkProps) {
  const { navigate } = usePageTransition();

  return (
    <Link
      href={href}
      target={target}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
        if (e.defaultPrevented || modified || target === "_blank" || href.startsWith("#")) return;
        e.preventDefault();
        navigate(href);
      }}
    />
  );
}
