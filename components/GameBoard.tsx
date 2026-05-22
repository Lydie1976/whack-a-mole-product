'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { KIND_META, MOLE_ASSETS, ScoreEventTone, UI_ASSETS } from '@/lib/gameConfig';
import { useGameStore } from '@/lib/gameStore';

const toneClass: Record<ScoreEventTone, string> = {
  good: 'text-[#267047]',
  bad: 'text-[#c43e30]',
  bonus: 'text-[#b57900]',
  heal: 'text-[#d64d72]',
  boss: 'text-[#7f4ac8]',
};

export default function GameBoard() {
  const { moles, scoreEvents, whack, dismissScoreEvent } = useGameStore();

  return (
    <section
      aria-label="打地鼠遊戲盤，三乘四共十二個洞"
      className="grid h-full min-h-[490px] grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4"
    >
      {moles.map((mole) => {
        const event = scoreEvents.find((scoreEvent) => scoreEvent.holeId === mole.id);
        const meta = KIND_META[mole.kind];

        return (
          <button
            key={mole.id}
            type="button"
            onClick={() => whack(mole.id)}
            aria-label={mole.visible ? `打擊 ${meta.label}` : `空洞 ${mole.id + 1}`}
            className="group relative isolate grid min-h-0 place-items-end overflow-hidden rounded-[28px] border border-white/50 bg-[#b5d98b]/55 p-1 shadow-button outline-none transition focus-visible:ring-4 focus-visible:ring-[#f4b63e] active:scale-[0.98] sm:p-2"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-[#609545]/15" />
            <Image
              src={UI_ASSETS.hole}
              alt=""
              width={280}
              height={220}
              className="absolute bottom-0 left-1/2 z-10 w-[92%] max-w-44 -translate-x-1/2 object-contain"
            />

            <AnimatePresence>
              {mole.visible && (
                <motion.div
                  key={`${mole.id}-${mole.spawnId}`}
                  initial={{ y: 90, scale: 0.72, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 82, scale: 0.82, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 28 }}
                  className="absolute inset-x-1 bottom-[14%] z-20 mx-auto grid w-[82%] max-w-36 place-items-center"
                >
                  <Image
                    src={MOLE_ASSETS[mole.kind]}
                    alt=""
                    width={320}
                    height={320}
                    draggable={false}
                    className={`w-full object-contain drop-shadow-[0_10px_10px_rgba(49,35,21,0.22)] ${
                      mole.kind === 'boss' ? 'scale-110' : ''
                    }`}
                  />
                  <span className="absolute -top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black text-[#55321d] shadow-button sm:text-xs">
                    {mole.kind === 'boss'
                      ? `${mole.bossHits}/3`
                      : meta.shortLabel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {event && (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 8, scale: 0.8 }}
                  animate={{ opacity: 1, y: -28, scale: 1 }}
                  exit={{ opacity: 0, y: -42, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  onAnimationComplete={() => dismissScoreEvent(event.id)}
                  className={`absolute left-1/2 top-1/2 z-30 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-sm font-black shadow-button ${toneClass[event.tone]}`}
                >
                  {event.label}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </section>
  );
}
