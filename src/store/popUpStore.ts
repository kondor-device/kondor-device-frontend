import { create } from "zustand";

interface PopUpState {
  isCartPopUpShown: boolean;
  isCheckoutPopUpShown: boolean;
  setCartPopUpShown: (value: boolean) => void;
  setCheckoutPopUpShown: (value: boolean) => void;
  toggleCartPopUp: () => void;
  toggleCheckoutPopUp: () => void;
}

export const usePopUpStore = create<PopUpState>((set) => ({
  isCartPopUpShown: false,
  isCheckoutPopUpShown: false,
  setCartPopUpShown: (value) => set({ isCartPopUpShown: value }),
  setCheckoutPopUpShown: (value) => set({ isCheckoutPopUpShown: value }),
  toggleCartPopUp: () =>
    set((state) => ({ isCartPopUpShown: !state.isCartPopUpShown })),
  toggleCheckoutPopUp: () =>
    set((state) => ({ isCheckoutPopUpShown: !state.isCheckoutPopUpShown })),
}));
