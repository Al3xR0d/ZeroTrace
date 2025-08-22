import React, { useState, useEffect, useRef } from 'react';
import AntLayout from 'antd/es/layout';
import styles from './Layout.module.css';
import videoSrc from '@/images/menu.mp4';
import pictureSrc from '@/images/menu.webp';
import music from '@/images/music.mp3';
import { useUserStore } from '@/store/userStore';
import { useAudioStore } from '@/store/audioStore';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const { Content } = AntLayout;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(new Audio(music));
  const lastPersistTsRef = useRef<number>(0);
  const prevEnabledRef = useRef<boolean | null>(null);
  const prevHadUserRef = useRef<boolean | null>(null);

  const { enabled, setPlaying, setCurrentTime } = useAudioStore();
  const currentUser = useUserStore((store) => store.currentUser);
  const location = useLocation();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.preload = 'auto';

    const handleLoadedMetadata = () => {
      try {
        const saved = useAudioStore.getState().currentTime;
        if (!Number.isNaN(saved) && saved > 0) {
          audio.currentTime = saved;
        }
      } catch {}
    };

    const handleTimeUpdate = () => {
      const now = Date.now();
      if (now - lastPersistTsRef.current > 500) {
        setCurrentTime(audio.currentTime);
        lastPersistTsRef.current = now;
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    if (audio.readyState >= 1) {
      try {
        const saved = useAudioStore.getState().currentTime;
        if (!Number.isNaN(saved) && saved > 0) {
          audio.currentTime = saved;
        }
      } catch {}
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [setCurrentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    const isRouteMuted = ['/tasks'].includes(location.pathname);
    const shouldPlay = !!currentUser && enabled && !isRouteMuted;

    const hadUser = !!currentUser;
    const wasEnabled = prevEnabledRef.current;
    const wasHadUser = prevHadUserRef.current;

    const enabledJustTurnedOn = wasEnabled === false && enabled === true;
    const loginJustHappened = wasHadUser === false && hadUser === true;

    if (shouldPlay) {
      if (enabledJustTurnedOn || loginJustHappened) {
        audio.currentTime = 0;
        setCurrentTime(0);
      } else if (audio.paused) {
        try {
          const saved = useAudioStore.getState().currentTime;
          if (!Number.isNaN(saved) && saved > 0 && audio.currentTime < 0.25) {
            audio.currentTime = saved;
          }
        } catch {}
      }

      if (!audio.paused) {
        prevEnabledRef.current = enabled;
        prevHadUserRef.current = hadUser;
        return;
      }

      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      if (!audio.paused) {
        audio.pause();
        setPlaying(false);
      }
    }

    prevEnabledRef.current = enabled;
    prevHadUserRef.current = hadUser;
  }, [currentUser, enabled, location.pathname, setPlaying, setCurrentTime]);

  const мideoPrefixes = ['/login', '/menu', '/rating', '/teams'];
  const showVideo = мideoPrefixes.some((p) => location.pathname.startsWith(p));

  return (
    <AntLayout className={styles.layout}>
      {showVideo &&
        (isMobile ? (
          <img className={styles.backgroundVideo} src={pictureSrc} alt="Fallback background" />
        ) : (
          <video
            className={styles.backgroundVideo}
            autoPlay
            loop
            muted
            playsInline
            onError={() => console.error('Video upload error')}
          >
            <source src={videoSrc} type="video/mp4" />
            <img src={pictureSrc} alt="Fallback background" />
          </video>
        ))}
      <Content className={styles.content}>{children}</Content>
    </AntLayout>
  );
};
