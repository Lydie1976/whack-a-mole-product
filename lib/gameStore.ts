'use client';

import { create } from 'zustand';
import {
  GAME_SECONDS,
  GamePhase,
  LeaderboardEntry,
  MAX_LIVES,
  MoleState,
  ScoreEvent,
  emptyMoles,
  getRankComment,
  levelFromScore,
} from './gameConfig';
import {
  createInitialSnapshot,
  getAccuracy,
  hideAllMoles,
  missMole,
  shouldEnd,
  spawnMole,
  tickSecond,
  whackMole,
} from './gameEngine';
import {
  readHighScore,
  readLeaderboard,
  readSoundPreference,
  saveHighScore,
  saveLeaderboardEntry,
  saveSoundPreference,
} from './storage';

type SoundCue = {
  id: number;
  name: 'start' | 'hit' | 'bad' | 'miss' | 'heal' | 'boss' | 'tick' | 'end';
};

type GameStats = ReturnType<typeof createInitialSnapshot>;

type SpawnPayload = {
  holeId: number;
  spawnId: number;
  duration: number;
};

type ResultSummary = {
  score: number;
  highScore: number;
  accuracy: number;
  maxCombo: number;
  level: number;
  comment: string;
};

type GameStore = GameStats & {
  phase: GamePhase;
  moles: MoleState[];
  highScore: number;
  leaderboard: LeaderboardEntry[];
  soundEnabled: boolean;
  scoreEvents: ScoreEvent[];
  soundCue?: SoundCue;
  result?: ResultSummary;
  level: number;
  hydrate: () => void;
  showTutorial: () => void;
  showMenu: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  tick: () => void;
  spawn: () => SpawnPayload | undefined;
  whack: (holeId: number) => void;
  miss: (holeId: number, spawnId: number) => void;
  dismissScoreEvent: (id: string) => void;
  toggleSound: () => void;
};

const cue = (name: SoundCue['name']): SoundCue => ({ id: Date.now(), name });

const buildResult = (stats: GameStats, highScore: number): ResultSummary => {
  const accuracy = getAccuracy(stats.hits, stats.totalAttempts);
  const level = levelFromScore(stats.score);

  return {
    score: stats.score,
    highScore,
    accuracy,
    maxCombo: stats.maxCombo,
    level,
    comment: getRankComment(stats.score, accuracy),
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialSnapshot(),
  phase: 'menu',
  moles: emptyMoles(),
  highScore: 0,
  leaderboard: [],
  soundEnabled: true,
  scoreEvents: [],
  level: 1,
  hydrate: () => {
    set({
      highScore: readHighScore(),
      leaderboard: readLeaderboard(),
      soundEnabled: readSoundPreference(),
    });
  },
  showTutorial: () => set({ phase: 'tutorial' }),
  showMenu: () => set({ phase: 'menu' }),
  startGame: () =>
    set({
      ...createInitialSnapshot(),
      phase: 'playing',
      moles: emptyMoles(),
      scoreEvents: [],
      result: undefined,
      level: 1,
      soundCue: cue('start'),
    }),
  pauseGame: () => set({ phase: 'paused', moles: hideAllMoles() }),
  resumeGame: () => set({ phase: 'playing' }),
  endGame: () => {
    const state = get();
    const stats = {
      score: state.score,
      lives: state.lives,
      timeLeft: state.timeLeft,
      combo: state.combo,
      maxCombo: state.maxCombo,
      hits: state.hits,
      misses: state.misses,
      wrongHits: state.wrongHits,
      totalAttempts: state.totalAttempts,
      bossDefeated: state.bossDefeated,
      bossSeen: state.bossSeen,
    };
    const highScore = saveHighScore(stats.score);
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      score: stats.score,
      accuracy: getAccuracy(stats.hits, stats.totalAttempts),
      maxCombo: stats.maxCombo,
      level: levelFromScore(stats.score),
      createdAt: new Date().toISOString(),
    };
    const leaderboard = saveLeaderboardEntry(entry);

    set({
      phase: 'ended',
      moles: emptyMoles(),
      highScore,
      leaderboard,
      result: buildResult(stats, highScore),
      soundCue: cue('end'),
    });
  },
  tick: () => {
    const state = get();
    if (state.phase !== 'playing') return;
    const next = tickSecond(state);
    set({
      ...next,
      level: levelFromScore(next.score),
      soundCue: next.timeLeft <= 5 && next.timeLeft > 0 ? cue('tick') : state.soundCue,
    });
    if (shouldEnd(next)) {
      get().endGame();
    }
  },
  spawn: () => {
    const state = get();
    if (state.phase !== 'playing') return undefined;
    const result = spawnMole(state.moles, state);
    set({
      moles: result.moles,
      bossSeen: result.bossSeen,
    });
    if (!result.spawned) return undefined;

    return {
      holeId: result.spawned.holeId,
      spawnId: result.spawned.spawnId,
      duration: result.spawned.duration,
    };
  },
  whack: (holeId: number) => {
    const state = get();
    if (state.phase !== 'playing') return;
    const result = whackMole(state.moles, state, holeId);
    if (!result) return;
    const nextLevel = levelFromScore(result.snapshot.score);
    set({
      ...result.snapshot,
      moles: result.moles,
      level: nextLevel,
      scoreEvents: [...state.scoreEvents, result.event].slice(-8),
      soundCue: cue(result.sound),
    });
    if (shouldEnd(result.snapshot)) {
      get().endGame();
    }
  },
  miss: (holeId: number, spawnId: number) => {
    const state = get();
    if (state.phase !== 'playing') return;
    const result = missMole(state.moles, state, holeId, spawnId);
    if (!result) return;
    set({
      ...result.snapshot,
      moles: result.moles,
      level: levelFromScore(result.snapshot.score),
      scoreEvents: result.event
        ? [...state.scoreEvents, result.event].slice(-8)
        : state.scoreEvents,
      soundCue: result.sound ? cue(result.sound) : state.soundCue,
    });
    if (shouldEnd(result.snapshot)) {
      get().endGame();
    }
  },
  dismissScoreEvent: (id: string) =>
    set((state) => ({
      scoreEvents: state.scoreEvents.filter((event) => event.id !== id),
    })),
  toggleSound: () => {
    const enabled = !get().soundEnabled;
    saveSoundPreference(enabled);
    set({ soundEnabled: enabled });
  },
}));

export const formatTime = (seconds: number) => {
  const safe = Math.max(0, seconds);
  return `0:${String(safe).padStart(2, '0')}`;
};

export const getLifeSlots = (lives: number) =>
  Array.from({ length: MAX_LIVES }, (_, index) => index < lives);

export const getProgress = (timeLeft: number) => (timeLeft / GAME_SECONDS) * 100;
