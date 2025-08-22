import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
  enabled: boolean;
  isPlaying: boolean;
  currentTime: number;
  setEnabled: (value: boolean) => void;
  setPlaying: (value: boolean) => void;
  setCurrentTime: (time: number) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      enabled: true,
      isPlaying: false,
      currentTime: 0,
      setEnabled: (value) => set({ enabled: value }),
      setPlaying: (value) => set({ isPlaying: value }),
      setCurrentTime: (time) => set({ currentTime: time }),
    }),
    { name: 'audio-store' },
  ),
);
