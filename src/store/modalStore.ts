import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode;
  modalStyles: string;
  openModal: (content: React.ReactNode, styles?: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  modalStyles: "",
  openModal: (content, styles = "") =>
    set({ isOpen: true, content, modalStyles: styles }),
  closeModal: () => set({ isOpen: false, content: null, modalStyles: "" }),
}));
