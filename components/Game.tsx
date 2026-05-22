'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import GameBoard from './GameBoard';
import ResultModal from './ResultModal';
import ScorePanel from './ScorePanel';
import StartScreen from './StartScreen';
import { useGameStore } from '@/lib/gameStore';
import { useAudioEngine } from '@/lib/useAudioEngine';

export default function Game() {
  const {
    hydrate,
    phase,
    level,
    soundEnabled,
    soundCue,
    tick,
    spawn,
    miss,
    startGame,
    pauseGame,
    resumeGame,
    toggleSound,
  } = useGameStore();
  const { play } = useAudioEngine(soundEnabled);
  const missTimers = useRef<number[]>([]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!soundCue) return;
    play(soundCue.name);
  }, [play, soundCue]);

  useEffect(() => {
    if (phase !== 'playing') {
      missTimers.current.forEach(window.clearTimeout);
      missTimers.current = [];
      return undefined;
    }

    const clock = window.setInterval(tick, 1000);
    return () => window.clearInterval(clock);
  }, [phase, tick]);

  useEffect(() => {
    if (phase !== 'playing') return undefined;

    const runSpawn = () => {
      const spawned = spawn();
      if (!spawned) return;

      const timeout = window.setTimeout(() => {
        miss(spawned.holeId, spawned.spawnId);
      }, spawned.duration);
      missTimers.current.push(timeout);
    };

    runSpawn();
    const spawner = window.setInterval(runSpawn, Math.max(420, 980 - level * 62));
    return () => window.clearInterval(spawner);
  }, [level, miss, phase, spawn]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#7fbc64] text-[#312315]">
      <div className="absolute inset-0 bg-[url('/assets/garden-background.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-[#f4e4a4]/20 to-[#4b8f55]/55" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 py-3 sm:px-5 md:px-8 md:py-6">
        <header className="flex items-center justify-between gap-3 rounded-[28px] border border-white/60 bg-white/70 px-3 py-2 shadow-soft backdrop-blur-md md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/assets/logo-mark.png"
              alt=""
              width={80}
              height={80}
              className="h-11 w-11 shrink-0 object-contain md:h-14 md:w-14"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-[0.18em] text-[#267047]">
                Whack-a-Mole: Garden Rush
              </p>
              <h1 className="truncate text-lg font-black leading-tight text-[#55321d] md:text-3xl">
                打地鼠：花園大作戰
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {phase === 'playing' && (
              <button
                type="button"
                onClick={pauseGame}
                aria-label="暫停遊戲"
                className="grid h-11 w-11 place-items-center rounded-full bg-[#f5b63f] text-[#3b2415] shadow-button transition hover:-translate-y-0.5 hover:bg-[#ffd05b]"
              >
                <Pause size={20} strokeWidth={3} />
              </button>
            )}
            {phase === 'paused' && (
              <button
                type="button"
                onClick={resumeGame}
                aria-label="繼續遊戲"
                className="grid h-11 w-11 place-items-center rounded-full bg-[#54a967] text-white shadow-button transition hover:-translate-y-0.5 hover:bg-[#62be74]"
              >
                <Play size={20} fill="currentColor" />
              </button>
            )}
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? '關閉音效' : '開啟音效'}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#55321d] shadow-button transition hover:-translate-y-0.5"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            {phase !== 'menu' && phase !== 'tutorial' && (
              <button
                type="button"
                onClick={startGame}
                aria-label="重新開始"
                className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#55321d] shadow-button transition hover:-translate-y-0.5"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {(phase === 'menu' || phase === 'tutorial') && <StartScreen key={phase} />}
          {(phase === 'playing' || phase === 'paused' || phase === 'ended') && (
            <motion.section
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="grid flex-1 gap-4 py-4 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-6"
            >
              <ScorePanel />
              <div className="relative min-h-[520px] rounded-[32px] border border-white/70 bg-[#dff3b3]/75 p-3 shadow-soft backdrop-blur-md sm:p-5">
                <GameBoard />
                {phase === 'paused' && (
                  <div className="absolute inset-0 grid place-items-center rounded-[32px] bg-[#1f2a18]/55 p-4 text-center backdrop-blur-sm">
                    <div className="rounded-[28px] bg-white px-6 py-5 shadow-soft">
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#267047]">
                        Paused
                      </p>
                      <h2 className="mt-1 text-3xl font-black text-[#55321d]">花園休息中</h2>
                      <button
                        type="button"
                        onClick={resumeGame}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#267047] px-5 py-3 font-black text-white shadow-button transition hover:-translate-y-0.5"
                      >
                        <Play size={18} fill="currentColor" />
                        繼續挑戰
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <ResultModal />
    </main>
  );
}
