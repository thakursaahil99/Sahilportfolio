"use client";

import { useSyncExternalStore } from "react";
import { INTRO_EVENT } from "./smooth-scroll";

function subscribe(cb: () => void) {
  window.addEventListener(INTRO_EVENT, cb);
  return () => window.removeEventListener(INTRO_EVENT, cb);
}

const getSnapshot = () => document.documentElement.dataset.intro === "done";

/** true once the preloader has finished — hero animations wait for this. */
export function useIntroDone() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function markIntroDone() {
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(INTRO_EVENT));
}
