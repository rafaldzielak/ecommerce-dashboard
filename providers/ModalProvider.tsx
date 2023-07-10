"use client";

import { StoreModal } from "@/components/modals/StoreModal";
import useIsMounted from "@/hooks/useIsMounted";

export const ModalProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <StoreModal />
    </>
  );
};
