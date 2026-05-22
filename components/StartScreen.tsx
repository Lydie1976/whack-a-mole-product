'use client';

import { motion } from 'framer-motion';
import { BookOpen, Play, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { KIND_META, MOLE_ASSETS, MoleKind } from '@/lib/gameConfig';
import { useGameStore } from '@/lib/gameStore';

const previewKinds: MoleKind[] = ['normal', 'gold', 'bomb', 'freeze', 'heart', 'boss'];

export default function StartScreen() {
  const { phase, highScore, leaderboard, startGame, showTutorial, showMenu } = useGameStore();
  const isTutorial = phase === 'tutorial';

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
      className="grid flex-1 items-center gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/72 p-5 shadow-soft backdrop-blur-md sm:p-8">
        <Image
          src="/assets/garden-banner.png"
          alt=""
          width={1400}
          height={520}
          className="absolute inset-x-0 top-0 h-44 w-full object-cover opacity-80"
        />
        <div className="relative pt-24 sm:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#267047] shadow-button">
            <Sparkles size={16} />
            Product Release
          </div>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.98] text-[#55321d] sm:text-6xl">
            打地鼠：花園大作戰
          </h2>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-[#5f4632] sm:text-lg">
            60 秒內守護花園，抓住黃金與冰凍地鼠，避開炸彈鼴鼠，累積 Combo
            衝上排行榜。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-3 rounded-full bg-[#267047] px-6 py-4 text-lg font-black text-white shadow-button transition hover:-translate-y-1 hover:bg-[#318858]"
            >
              <Play size={20} fill="currentColor" />
              開始遊戲
            </button>
            <button
              type="button"
              onClick={isTutorial ? showMenu : showTutorial}
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-lg font-black text-[#55321d] shadow-button transition hover:-translate-y-1"
            >
              <BookOpen size={20} />
              {isTutorial ? '回主選單' : '玩法教學'}
            </button>
          </div>
        </div>
      </div>

      <aside className="grid gap-4">
        <div className="rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#267047]">
                Best Score
              </p>
              <p className="text-4xl font-black text-[#55321d]">{highScore}</p>
            </div>
            <Image
              src="/assets/coin-icon.png"
              alt=""
              width={80}
              height={80}
              className="h-16 w-16 object-contain"
            />
          </div>
        </div>

        <div className="rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#267047]" size={20} />
            <h3 className="text-lg font-black text-[#55321d]">
              {isTutorial ? '目標圖鑑' : '快速規則'}
            </h3>
          </div>

          {isTutorial ? (
            <div className="mt-4 grid gap-3">
              {previewKinds.map((kind) => (
                <div key={kind} className="grid grid-cols-[58px_1fr] items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f6e3a1]">
                    <Image
                      src={MOLE_ASSETS[kind]}
                      alt=""
                      width={80}
                      height={80}
                      className="max-h-14 max-w-14 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-black text-[#55321d]">{KIND_META[kind].label}</p>
                    <p className="text-sm font-semibold leading-5 text-[#6f573e]">
                      {KIND_META[kind].description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-[#6f573e]">
              <li>棋盤 3x4，共 12 個洞，點擊或觸控冒出的目標。</li>
              <li>連續打對 5 次後，每次額外 +5 分；打錯或漏打會中斷。</li>
              <li>分數越高速度越快，最高 9 級；生命或時間歸零就結算。</li>
            </ul>
          )}
        </div>

        <div className="rounded-[30px] border border-white/70 bg-white/78 p-5 shadow-soft backdrop-blur-md">
          <h3 className="text-lg font-black text-[#55321d]">排行榜</h3>
          <div className="mt-3 grid gap-2">
            {leaderboard.length ? (
              leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[28px_1fr_auto] items-center gap-2 rounded-2xl bg-[#fff6d7] px-3 py-2 text-sm font-black text-[#55321d]"
                >
                  <span>{index + 1}</span>
                  <span>{entry.score} 分</span>
                  <span>{entry.accuracy}%</span>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-[#fff6d7] px-3 py-3 text-sm font-semibold text-[#6f573e]">
                尚未有紀錄，第一場就由你開榜。
              </p>
            )}
          </div>
        </div>
      </aside>
    </motion.section>
  );
}
