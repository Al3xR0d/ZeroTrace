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
  const { enabled, setPlaying } = useAudioStore();
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
    audio.load();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const shouldPlay = !!currentUser && enabled && !['/tasks'].includes(location.pathname);

    if (shouldPlay) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }, [currentUser, enabled, location.pathname, setPlaying]);

  return (
    <AntLayout className={styles.layout}>
      {isMobile ? (
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
      )}
      <Content className={styles.content}>{children}</Content>
    </AntLayout>
  );
};
