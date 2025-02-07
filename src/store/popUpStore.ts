import { create } from "zustand";

interface PopUpState {
  isCartPopUpShown: boolean;
  isCheckoutPopUpShown: boolean;
  setIsCartPopUpShown: (value: boolean) => void;
  setIsCheckoutPopUpShown: (value: boolean) => void;
  toggleCartPopUp: () => void;
  toggleCheckoutPopUp: () => void;
}

export const usePopUpStore = create<PopUpState>((set) => ({
  isCartPopUpShown: false,
  isCheckoutPopUpShown: false,
  setIsCartPopUpShown: (value) => set({ isCartPopUpShown: value }),
  setIsCheckoutPopUpShown: (value) => set({ isCheckoutPopUpShown: value }),
  toggleCartPopUp: () =>
    set((state) => ({ isCartPopUpShown: !state.isCartPopUpShown })),
  toggleCheckoutPopUp: () =>
    set((state) => ({ isCheckoutPopUpShown: !state.isCheckoutPopUpShown })),
}));
