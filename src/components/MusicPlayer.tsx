import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
  },
  {
    id: '3',
    title: 'Digital Rain',
    artist: 'Code Core',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/digital/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  return (
    <Card className="p-6 bg-zinc-950 border-zinc-800 shadow-2xl shadow-magenta-900/20 overflow-hidden relative">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-magenta-600/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/10 blur-[100px] rounded-full" />

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center gap-3">
          <Disc className={`text-magenta-500 ${isPlaying ? 'animate-spin-slow' : ''}`} size={20} />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">Audio.Engine</h2>
        </div>

        <div className="flex gap-6 items-center">
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-32 h-32 flex-shrink-0"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-lg border border-zinc-800 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-zinc-100 truncate">{currentTrack.title}</h3>
                <p className="text-magenta-400 font-mono text-sm uppercase tracking-widest">{currentTrack.artist}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePrev}
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              >
                <SkipBack size={24} />
              </Button>
              <Button 
                size="icon" 
                onClick={togglePlay}
                className="w-12 h-12 bg-magenta-600 hover:bg-magenta-500 text-white rounded-full shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-transform active:scale-95"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNext}
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              >
                <SkipForward size={24} />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Slider 
            value={[progress]} 
            max={100} 
            step={0.1} 
            onValueChange={handleProgressChange}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
            <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
            <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-zinc-900">
          <Volume2 size={16} className="text-zinc-500" />
          <Slider 
            value={[volume]} 
            max={100} 
            step={1} 
            onValueChange={handleVolumeChange}
            className="w-32 cursor-pointer"
          />
          <div className="flex-1" />
          <div className="flex gap-2">
            <div className="w-1 h-4 bg-magenta-500/30 rounded-full overflow-hidden">
              <motion.div 
                className="w-full bg-magenta-500"
                animate={{ height: isPlaying ? ['20%', '100%', '40%', '80%', '20%'] : '20%' }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              />
            </div>
            <div className="w-1 h-4 bg-cyan-500/30 rounded-full overflow-hidden">
              <motion.div 
                className="w-full bg-cyan-500"
                animate={{ height: isPlaying ? ['40%', '20%', '100%', '60%', '40%'] : '40%' }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
              />
            </div>
            <div className="w-1 h-4 bg-magenta-500/30 rounded-full overflow-hidden">
              <motion.div 
                className="w-full bg-magenta-500"
                animate={{ height: isPlaying ? ['80%', '40%', '20%', '100%', '80%'] : '80%' }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
