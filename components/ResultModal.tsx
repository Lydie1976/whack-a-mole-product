'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Clipboard, Medal, RotateCcw } from 'lucide-react';
import { useMemo } from 'react';
import { useGameStore } from '@/lib/gameStore';

export default function ResultModal() {
  const { phase, result, leaderboard, startGame, showMenu } = useGameStore();
  const shareText = useMemo(() => {
    if (!result) return '';
    return `我在《打地鼠：花園大作戰》拿到 ${result.score} 分，命中率 ${result.accuracy}%！`;
  }, [result]);

  if (!result) return null;

  return (
    <AnimatePresence>
      {phase === 'ended' && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#1f2a18]/62 p-3 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            initial={{ y: 34, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-title"
            className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[34px] border border-white/80 bg-[#fff9e5] p-5 shadow-soft sm:p-7"
          >
            <div className="grid gap-5 md:grid-cols-[1fr_260px]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#267047]">
                  Result
                </p>
                <h2 id="result-title" className="mt-1 text-4xl font-black text-[#55321d]">
                  {result.comment}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#6f573e]">
                  {shareText}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <ResultStat label="本局分數" value={result.score} />
                  <ResultStat label="最高分" value={result.highScore} />
                  <ResultStat label="命中率" value={`${result.accuracy}%`} />
                  <ResultStat label="最大連擊" value={`x${result.maxCombo}`} />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={startGame}
                    className="inline-flex items-center gap-2 rounded-full bg-[#267047] px-5 py-3 font-black text-white shadow-button transition hover:-translate-y-0.5"
                  >
                    <RotateCcw size={18} />
                    再挑戰
                  </button>
                  <button
                    type="button"
                    onClick={showMenu}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-black text-[#55321d] shadow-button transition hover:-translate-y-0.5"
                  >
                    <Medal size={18} />
                    回主選單
                  </button>
                  <button
                    type="button"
                    onClick={() => void navigator.clipboard?.writeText(shareText)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f5b63f] px-5 py-3 font-black text-[#3b2415] shadow-button transition hover:-translate-y-0.5"
                  >
                    <Clipboard size={18} />
                    複製分享文案
                  </button>
                </div>
              </div>

              <aside className="rounded-[28px] bg-white p-4 shadow-button">
                <h3 className="text-lg font-black text-[#55321d]">排行榜</h3>
                <div className="mt-3 grid gap-2">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-[26px_1fr_auto] items-center gap-2 rounded-2xl bg-[#fff6d7] px-3 py-2 text-sm font-black text-[#55321d]"
                    >
                      <span>{index + 1}</span>
                      <span>{entry.score} 分</span>
                      <span>{entry.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResultStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[22px] bg-white px-3 py-4 text-center shadow-button">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#267047]">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#55321d]">{value}</p>
    </div>
  );
}
