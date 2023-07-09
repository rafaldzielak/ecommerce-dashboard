"use client";

import { StoreModal } from "@/components/modals/StoreModal";
import useIsMounted from "@/hooks/useIsMounted";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <StoreModal />
    </>
  );
};
