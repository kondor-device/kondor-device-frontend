import { create } from "zustand";
import { ReactNode } from "react";

export interface ModalState {
  activeModal: {
    name: string | null;
    content: ReactNode | null;
    modalStyles: string;
  };
  openModal: (name: string, content: ReactNode, styles?: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: {
    name: null,
    content: null,
    modalStyles: "",
  },
  openModal: (name, content, styles = "") =>
    set({
      activeModal: {
        name,
        content,
        modalStyles: styles,
      },
    }),
  closeModal: () =>
    set({
      activeModal: {
        name: null,
        content: null,
        modalStyles: "",
      },
    }),
}));
