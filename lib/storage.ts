import { LEADERBOARD_LIMIT, LeaderboardEntry } from './gameConfig';

const HIGH_SCORE_KEY = 'garden-rush-high-score';
const LEADERBOARD_KEY = 'garden-rush-leaderboard';
const SOUND_KEY = 'garden-rush-sound-enabled';

export const readHighScore = () => {
  if (typeof window === 'undefined') return 0;
  return Number(window.localStorage.getItem(HIGH_SCORE_KEY) || 0);
};

export const saveHighScore = (score: number) => {
  if (typeof window === 'undefined') return score;
  const best = Math.max(readHighScore(), score);
  window.localStorage.setItem(HIGH_SCORE_KEY, String(best));
  return best;
};

export const readLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(LEADERBOARD_KEY);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
};

export const saveLeaderboardEntry = (entry: LeaderboardEntry) => {
  if (typeof window === 'undefined') return [];
  const next = [...readLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, LEADERBOARD_LIMIT);
  window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(next));
  return next;
};

export const readSoundPreference = () => {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(SOUND_KEY) !== 'false';
};

export const saveSoundPreference = (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SOUND_KEY, String(enabled));
};
