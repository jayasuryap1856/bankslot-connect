import { create } from "zustand";

export type BookingDraft = {
  bankId?: string;
  branchId?: string;
  serviceId?: string;
  date?: string; // ISO yyyy-mm-dd
  slot?: string; // HH:mm
  name?: string;
  phone?: string;
  email?: string;
  note?: string;
  bookingId?: string;
};

type State = {
  draft: BookingDraft;
  set: (patch: Partial<BookingDraft>) => void;
  reset: () => void;
};

export const useBooking = create<State>((set) => ({
  draft: {},
  set: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  reset: () => set({ draft: {} }),
}));
