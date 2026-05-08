import { useState, useCallback } from 'react';

export type ModalType = 'chapter' | 'lesson' | 'quiz' | 'assignment' | null;

export function useModals() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = useCallback((modal: ModalType, data?: any) => {
    setActiveModal(modal);
    setModalData(data || null);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  return { activeModal, modalData, openModal, closeModal };
}