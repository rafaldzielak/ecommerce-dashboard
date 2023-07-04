"use client";

import { useStoreModal } from "@/hooks/useStoreModal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
  const { isOpen, onClose } = useStoreModal();

  return (
    <Modal title='Create store' description='Add a new store to manage products and categories' isOpen={isOpen} onClose={onClose}>
      Future Create Store Form
    </Modal>
  );
};
