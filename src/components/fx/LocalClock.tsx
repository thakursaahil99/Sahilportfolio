"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

/** Live local time in the profile's timezone, e.g. "14:05:09 IST". */
export default function LocalClock({ className }: { className?: string }) {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const update = () => setTime(fmt.format(new Date()));
    const first = setTimeout(update, 0);
    const id = setInterval(update, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time} IST
    </span>
  );
}
