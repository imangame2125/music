'use client';

import React, { useEffect, useRef, useState } from 'react';
import { songs } from '@/songs/song';
import Image from 'next/image';
import { Next, Pause, Play, Previous } from 'iconsax-reactjs';
import Link from 'next/link';

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const currentSong = songs[currentSongIndex];

  // زمان فعلی و مدت آهنگ را مدیریت می‌کند
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // شروع و توقف پخش آهنگ
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true));
      }
    }
  };

  // پخش آهنگ بعدی هنگام تغییر ایندکس
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    if (isPlaying) {
      audio.play().catch((err) => console.error('Auto-play error:', err));
    }
  }, [currentSongIndex]);

  // کنترل آهنگ قبلی و بعدی
  const playNext = () => setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  const playPrev = () => setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);

  // تغییر زمان با کلیک روی نوار
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    audio.currentTime = newTime;
  };

  // فرمت زمان
  const formatTime = (time: number) =>
    isNaN(time) ? '00:00' : `${Math.floor(time / 60)}:${('0' + Math.floor(time % 60)).slice(-2)}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <audio ref={audioRef} onEnded={playNext}>
        <source src={currentSong.audio} type="audio/mpeg" />
      </audio>

      <div className="text-center flex items-center justify-center flex-col relative w-full h-full">
        <h2 className="text-2xl font-bold mb-2">{currentSong.title}</h2>
        <Image
          height={0}
          width={150}
          className="rounded-4xl"
          style={{ height: '250px', width: 'auto' }}
          src={currentSong.image}
          alt="cover"
        />
      </div>

      <div className="flex items-center gap-6 my-4">
        <button
          onClick={playPrev}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          aria-label="Previous"
        >
          <Previous size="24" color="#2ccce4" />
        </button>

        <button
          onClick={togglePlay}
          className="p-4 rounded-full bg-blue-600 hover:bg-blue-500 transition"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size="24" color="#2ccce4" /> : <Play size="24" color="#2ccce4" />}
        </button>

        <button
          onClick={playNext}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          aria-label="Next"
        >
          <Next size="24" color="#2ccce4" />
        </button>
      </div>

      <div className="w-full max-w-xl px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono">{formatTime(currentTime)}</span>
          <div
            className="relative flex-1 h-3 bg-gray-500 rounded-lg cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="absolute top-0 left-0 h-full bg-blue-400 rounded-lg"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-normal">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
