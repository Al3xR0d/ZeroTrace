import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AudioState {
  enabled: boolean;
  isPlaying: boolean;
  setEnabled: (value: boolean) => void;
  setPlaying: (value: boolean) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      enabled: true,
      isPlaying: false,
      setEnabled: (value) => set({ enabled: value }),
      setPlaying: (value) => set({ isPlaying: value }),
    }),
    {
      name: 'audio-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
