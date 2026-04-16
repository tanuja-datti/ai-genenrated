import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-500 to-cyan-400 bg-[length:200%_auto] animate-gradient">
              Neon Beats
            </span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.4em]">
            Classic Arcade • AI Generated Soundscapes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 w-full max-w-6xl items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SnakeGame />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <MusicPlayer />
            
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-600 uppercase font-mono">Core.Temp</span>
                  <span className="text-[10px] text-cyan-500 font-mono">32°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-600 uppercase font-mono">Audio.Buffer</span>
                  <span className="text-[10px] text-magenta-500 font-mono">OPTIMIZED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-600 uppercase font-mono">Game.Engine</span>
                  <span className="text-[10px] text-cyan-500 font-mono">STABLE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-12 text-zinc-700 text-[10px] font-mono uppercase tracking-widest">
          © 2026 NEON.LABS • ALL RIGHTS RESERVED
        </footer>
      </main>
    </div>
  );
}
