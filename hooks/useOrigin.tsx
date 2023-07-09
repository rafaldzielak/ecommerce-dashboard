import { useEffect, useState } from "react";
import { create } from "zustand";

export const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false);

  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  useEffect(() => {
    if (!isMounted) setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return "";
  return origin;
};
