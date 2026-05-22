'use client';

import type { ReactNode } from 'react';
import { Gauge, Medal, MousePointerClick, Timer } from 'lucide-react';
import Image from 'next/image';
import { getLifeSlots, getProgress, formatTime, useGameStore } from '@/lib/gameStore';

export default function ScorePanel() {
  const {
    score,
    highScore,
    timeLeft,
    lives,
    level,
    combo,
    maxCombo,
    hits,
    totalAttempts,
    misses,
    wrongHits,
  } = useGameStore();
  const progress = getProgress(timeLeft);
  const accuracy = totalAttempts ? Math.round((hits / totalAttempts) * 100) : 0;

  return (
    <aside className="grid content-start gap-4">
      <section className="rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#267047]">
              Score
            </p>
            <p className="text-5xl font-black leading-none text-[#55321d]">{score}</p>
          </div>
          <Image
            src="/assets/coin-icon.png"
            alt=""
            width={80}
            height={80}
            className="h-16 w-16 object-contain"
          />
        </div>

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#e5c56f]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#54a967] via-[#f4b63e] to-[#e45f45] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm font-black text-[#6f573e]">
          <span className="inline-flex items-center gap-1">
            <Timer size={16} />
            {formatTime(timeLeft)}
          </span>
          <span>最高分 {highScore}</span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Stat icon={<Gauge size={18} />} label="等級" value={level} />
        <Stat icon={<MousePointerClick size={18} />} label="命中率" value={`${accuracy}%`} />
        <Stat icon={<Medal size={18} />} label="Combo" value={`x${combo}`} />
        <Stat icon={<Medal size={18} />} label="最高連擊" value={`x${maxCombo}`} />
      </section>

      <section className="rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-md">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#267047]">Lives</p>
        <div className="mt-3 flex gap-2">
          {getLifeSlots(lives).map((filled, index) => (
            <div
              key={index}
              className={`grid h-12 w-12 place-items-center rounded-2xl ${
                filled ? 'bg-[#ffe1e6]' : 'bg-[#d9cbb8]'
              }`}
            >
              {filled && (
                <Image
                  src="/assets/heart-icon.png"
                  alt="生命"
                  width={48}
                  height={48}
                  className="h-9 w-9 object-contain"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black text-[#6f573e]">
          <span className="rounded-2xl bg-[#fff6d7] px-2 py-2">命中 {hits}</span>
          <span className="rounded-2xl bg-[#fff6d7] px-2 py-2">漏打 {misses}</span>
          <span className="rounded-2xl bg-[#fff6d7] px-2 py-2">誤打 {wrongHits}</span>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-md">
        <h2 className="text-lg font-black text-[#55321d]">遊戲規則</h2>
        <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-[#6f573e]">
          <p>黃金加高分，冰凍加時間，愛心補生命。</p>
          <p>炸彈不要打；一般、黃金、冰凍漏掉會扣生命。</p>
          <p>園丁 Boss 出現時連打 3 次，可拿大量分數。</p>
        </div>
      </section>
    </aside>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/78 p-4 shadow-button backdrop-blur-md">
      <div className="flex items-center gap-2 text-[#267047]">
        {icon}
        <span className="text-xs font-black uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-black text-[#55321d]">{value}</p>
    </div>
  );
}
