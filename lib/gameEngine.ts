import {
  COMBO_THRESHOLD,
  GAME_SECONDS,
  KIND_META,
  MAX_LIVES,
  MoleKind,
  MoleState,
  ScoreEvent,
  activeMoleLimit,
  emptyMoles,
  levelFromScore,
  pickKind,
  visibleDuration,
} from './gameConfig';

export type GameSnapshot = {
  score: number;
  lives: number;
  timeLeft: number;
  combo: number;
  maxCombo: number;
  hits: number;
  misses: number;
  wrongHits: number;
  totalAttempts: number;
  bossDefeated: boolean;
  bossSeen: boolean;
};

export type WhackResult = {
  snapshot: GameSnapshot;
  moles: MoleState[];
  event: ScoreEvent;
  sound: 'hit' | 'bad' | 'heal' | 'boss';
};

export type MissResult = {
  snapshot: GameSnapshot;
  moles: MoleState[];
  event?: ScoreEvent;
  sound?: 'miss';
};

export type SpawnResult = {
  moles: MoleState[];
  spawned?: {
    holeId: number;
    spawnId: number;
    duration: number;
    kind: MoleKind;
  };
  bossSeen: boolean;
};

export const createInitialSnapshot = (): GameSnapshot => ({
  score: 0,
  lives: MAX_LIVES,
  timeLeft: GAME_SECONDS,
  combo: 0,
  maxCombo: 0,
  hits: 0,
  misses: 0,
  wrongHits: 0,
  totalAttempts: 0,
  bossDefeated: false,
  bossSeen: false,
});

export const getAccuracy = (hits: number, attempts: number) => {
  if (attempts <= 0) return 0;
  return Math.round((hits / attempts) * 100);
};

export const shouldEnd = (snapshot: GameSnapshot) =>
  snapshot.timeLeft <= 0 || snapshot.lives <= 0;

export const tickSecond = (snapshot: GameSnapshot): GameSnapshot => ({
  ...snapshot,
  timeLeft: Math.max(0, snapshot.timeLeft - 1),
});

export const createScoreEvent = (
  holeId: number,
  label: string,
  tone: ScoreEvent['tone'],
): ScoreEvent => ({
  id: `${Date.now()}-${holeId}-${Math.random().toString(16).slice(2)}`,
  holeId,
  label,
  tone,
});

export const spawnMole = (
  moles: MoleState[],
  snapshot: GameSnapshot,
): SpawnResult => {
  const level = levelFromScore(snapshot.score);
  const activeCount = moles.filter((mole) => mole.visible).length;
  if (activeCount >= activeMoleLimit(level)) {
    return { moles, bossSeen: snapshot.bossSeen };
  }

  const free = moles.filter((mole) => !mole.visible);
  if (!free.length) {
    return { moles, bossSeen: snapshot.bossSeen };
  }

  const bossReady =
    !snapshot.bossSeen &&
    level >= 4 &&
    snapshot.timeLeft <= 42 &&
    snapshot.score >= 120;
  const chosen = free[Math.floor(Math.random() * free.length)];
  const kind = pickKind(level, bossReady);
  const spawnId = Date.now() + Math.floor(Math.random() * 10000);
  const nextMoles = moles.map((mole) =>
    mole.id === chosen.id
      ? {
          ...mole,
          kind,
          visible: true,
          hit: false,
          spawnId,
          bossHits: kind === 'boss' ? 0 : mole.bossHits,
        }
      : mole,
  );

  return {
    moles: nextMoles,
    spawned: {
      holeId: chosen.id,
      spawnId,
      duration: visibleDuration(level, kind),
      kind,
    },
    bossSeen: snapshot.bossSeen || kind === 'boss',
  };
};

export const whackMole = (
  moles: MoleState[],
  snapshot: GameSnapshot,
  holeId: number,
): WhackResult | undefined => {
  const target = moles.find((mole) => mole.id === holeId);
  if (!target?.visible || target.hit) return undefined;

  if (target.kind === 'boss' && target.bossHits < 2) {
    const nextHits = target.bossHits + 1;
    return {
      snapshot: {
        ...snapshot,
        totalAttempts: snapshot.totalAttempts + 1,
      },
      moles: moles.map((mole) =>
        mole.id === holeId ? { ...mole, bossHits: nextHits } : mole,
      ),
      event: createScoreEvent(holeId, `${3 - nextHits} 下`, 'boss'),
      sound: 'hit',
    };
  }

  if (target.kind === 'bomb') {
    const nextSnapshot = {
      ...snapshot,
      score: Math.max(0, snapshot.score + KIND_META.bomb.points),
      lives: Math.max(0, snapshot.lives - 1),
      combo: 0,
      wrongHits: snapshot.wrongHits + 1,
      totalAttempts: snapshot.totalAttempts + 1,
    };

    return {
      snapshot: nextSnapshot,
      moles: hideMole(moles, holeId),
      event: createScoreEvent(holeId, '-20 心-1', 'bad'),
      sound: 'bad',
    };
  }

  const combo = snapshot.combo + 1;
  const comboBonus = combo >= COMBO_THRESHOLD ? 5 : 0;
  const basePoints = KIND_META[target.kind].points;
  const isHeart = target.kind === 'heart';
  const isFreeze = target.kind === 'freeze';
  const isBoss = target.kind === 'boss';
  const points = isHeart ? 0 : basePoints + comboBonus;
  const nextSnapshot = {
    ...snapshot,
    score: snapshot.score + points,
    lives: isHeart ? Math.min(MAX_LIVES, snapshot.lives + 1) : snapshot.lives,
    timeLeft: isFreeze ? Math.min(GAME_SECONDS, snapshot.timeLeft + 2) : snapshot.timeLeft,
    combo,
    maxCombo: Math.max(snapshot.maxCombo, combo),
    hits: snapshot.hits + 1,
    totalAttempts: snapshot.totalAttempts + 1,
    bossDefeated: snapshot.bossDefeated || isBoss,
  };
  const label = isHeart
    ? '心+1'
    : isFreeze
      ? `+${points} +2秒`
      : isBoss
        ? `+${points} Boss`
        : `+${points}`;

  return {
    snapshot: nextSnapshot,
    moles: hideMole(moles, holeId),
    event: createScoreEvent(holeId, label, KIND_META[target.kind].tone),
    sound: isHeart ? 'heal' : isBoss ? 'boss' : 'hit',
  };
};

export const missMole = (
  moles: MoleState[],
  snapshot: GameSnapshot,
  holeId: number,
  spawnId: number,
): MissResult | undefined => {
  const target = moles.find((mole) => mole.id === holeId);
  if (!target?.visible || target.spawnId !== spawnId || target.hit) return undefined;

  const costsLife = KIND_META[target.kind].missCostsLife;
  const nextSnapshot = {
    ...snapshot,
    lives: costsLife ? Math.max(0, snapshot.lives - 1) : snapshot.lives,
    combo: costsLife ? 0 : snapshot.combo,
    misses: costsLife ? snapshot.misses + 1 : snapshot.misses,
    totalAttempts: costsLife ? snapshot.totalAttempts + 1 : snapshot.totalAttempts,
  };

  return {
    snapshot: nextSnapshot,
    moles: hideMole(moles, holeId),
    event: costsLife ? createScoreEvent(holeId, '漏打 心-1', 'bad') : undefined,
    sound: costsLife ? 'miss' : undefined,
  };
};

export const hideMole = (moles: MoleState[], holeId: number) =>
  moles.map((mole) =>
    mole.id === holeId
      ? { ...mole, visible: false, hit: true, bossHits: 0 }
      : mole,
  );

export const hideAllMoles = () => emptyMoles();
