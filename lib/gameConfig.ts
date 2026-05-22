export type MoleKind = 'normal' | 'gold' | 'bomb' | 'freeze' | 'heart' | 'boss';

export type GamePhase = 'menu' | 'tutorial' | 'playing' | 'paused' | 'ended';

export type MoleState = {
  id: number;
  kind: MoleKind;
  visible: boolean;
  hit: boolean;
  spawnId: number;
  bossHits: number;
};

export type ScoreEventTone = 'good' | 'bad' | 'bonus' | 'heal' | 'boss';

export type ScoreEvent = {
  id: string;
  holeId: number;
  label: string;
  tone: ScoreEventTone;
};

export type LeaderboardEntry = {
  id: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  level: number;
  createdAt: string;
};

export const GAME_SECONDS = 60;
export const GRID_SIZE = 12;
export const MAX_LIVES = 3;
export const COMBO_THRESHOLD = 5;
export const MAX_LEVEL = 9;
export const LEADERBOARD_LIMIT = 5;

export const MOLE_ASSETS: Record<MoleKind, string> = {
  normal: '/assets/mole-normal.png',
  gold: '/assets/mole-gold.png',
  bomb: '/assets/mole-bomb.png',
  freeze: '/assets/mole-freeze.png',
  heart: '/assets/mole-heart.png',
  boss: '/assets/mole-boss.png',
};

export const UI_ASSETS = {
  background: '/assets/garden-background.png',
  banner: '/assets/garden-banner.png',
  coin: '/assets/coin-icon.png',
  hammer: '/assets/hammer-cursor.png',
  heart: '/assets/heart-icon.png',
  hitEffect: '/assets/mole-hit-effect.png',
  hole: '/assets/soil-hole.png',
  logo: '/assets/logo-mark.png',
  panel: '/assets/wood-panel.png',
} as const;

export const KIND_META: Record<
  MoleKind,
  {
    label: string;
    shortLabel: string;
    points: number;
    missCostsLife: boolean;
    description: string;
    tone: ScoreEventTone;
  }
> = {
  normal: {
    label: '一般地鼠',
    shortLabel: '+10',
    points: 10,
    missCostsLife: true,
    description: '打中 +10，漏打扣 1 顆心',
    tone: 'good',
  },
  gold: {
    label: '黃金地鼠',
    shortLabel: '+30',
    points: 30,
    missCostsLife: true,
    description: '稀有目標，打中 +30',
    tone: 'bonus',
  },
  bomb: {
    label: '炸彈鼴鼠',
    shortLabel: '-20',
    points: -20,
    missCostsLife: false,
    description: '不要打，打中 -20 並扣 1 顆心',
    tone: 'bad',
  },
  freeze: {
    label: '冰凍地鼠',
    shortLabel: '+2秒',
    points: 15,
    missCostsLife: true,
    description: '打中 +15 並增加 2 秒',
    tone: 'bonus',
  },
  heart: {
    label: '愛心補給',
    shortLabel: '+心',
    points: 0,
    missCostsLife: false,
    description: '打中回復 1 顆心，上限 3 顆',
    tone: 'heal',
  },
  boss: {
    label: '園丁 Boss',
    shortLabel: '3連打',
    points: 80,
    missCostsLife: true,
    description: '出現時連打 3 次，成功 +80',
    tone: 'boss',
  },
};

export const emptyMoles = (): MoleState[] =>
  Array.from({ length: GRID_SIZE }, (_, id) => ({
    id,
    kind: 'normal',
    visible: false,
    hit: false,
    spawnId: 0,
    bossHits: 0,
  }));

export const levelFromScore = (score: number) =>
  Math.min(MAX_LEVEL, 1 + Math.floor(Math.max(0, score) / 120));

export const spawnInterval = (level: number) => Math.max(430, 980 - level * 62);

export const activeMoleLimit = (level: number) => {
  if (level <= 2) return 1;
  if (level <= 5) return 2;
  return 3;
};

export const visibleDuration = (level: number, kind: MoleKind) => {
  if (kind === 'boss') {
    return 2400;
  }

  return Math.max(560, 1380 - level * 78);
};

export const pickKind = (level: number, bossReady: boolean): MoleKind => {
  if (bossReady) {
    return 'boss';
  }

  const r = Math.random();
  const bombChance = Math.min(0.08 + level * 0.012, 0.18);
  const goldChance = Math.min(0.1 + level * 0.008, 0.17);
  const freezeChance = 0.08;
  const heartChance = level >= 3 ? 0.07 : 0.05;

  if (r < bombChance) return 'bomb';
  if (r < bombChance + goldChance) return 'gold';
  if (r < bombChance + goldChance + freezeChance) return 'freeze';
  if (r < bombChance + goldChance + freezeChance + heartChance) return 'heart';
  return 'normal';
};

export const getRankComment = (score: number, accuracy: number) => {
  if (score >= 650 && accuracy >= 80) return '花園傳奇守護者';
  if (score >= 450) return '黃金地鼠剋星';
  if (score >= 280) return '反應力高手';
  if (score >= 120) return '可靠的花園幫手';
  return '暖身完成，再挑戰一次';
};
