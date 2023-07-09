"use client";

import React, { FC, useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import useIsMounted from "@/hooks/useIsMounted";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const AlertModal: FC<AlertModalProps> = ({ isLoading, isOpen, onClose, onConfirm }) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <Modal description='This action cannot be undone' title='Are you sure?' isOpen={isOpen} onClose={onClose}>
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button disabled={isLoading} variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isLoading} variant='destructive' onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
