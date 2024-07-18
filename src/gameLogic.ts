import { getFirestore, doc, setDoc, updateDoc, increment, getDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const INITIAL_SCORE = 0;
const INITIAL_ENERGY = 5000;
const INITIAL_MAX_ENERGY = 6500;
const INITIAL_INCOME_RATE = 50;
const COOLDOWN_PERIOD = 7 * 3600;

const LEVELS = [
  { name: 'Hustler', minBalance: 0, maxBalance: 999 },
  { name: 'Working Class', minBalance: 1000, maxBalance: 4999 },
  { name: 'Lower Middle Class', minBalance: 5000, maxBalance: 9999 },
  { name: 'Middle Class', minBalance: 10000, maxBalance: 19999 },
  { name: 'Upper Middle Class', minBalance: 20000, maxBalance: 49999 },
  { name: 'Comfortable', minBalance: 50000, maxBalance: 99999 },
  { name: 'Wealthy', minBalance: 100000, maxBalance: 199999 },
  { name: 'Affluent', minBalance: 200000, maxBalance: 499999 },
  { name: 'Rich', minBalance: 500000, maxBalance: 999999 },
  { name: 'Ultra Rich', minBalance: 1000000, maxBalance: Infinity },
];

const TASKS = [
  'followFacebook',
  'followTwitter',
  'followYouTube',
  'followTelegram',
  'followMedium',
  'followTikTok',
  'addWalletAddress'
];

const GAME_STATE_DOC = 'gameState/main';

export const initializeGameState = async () => {
  try {
    const gameStateRef = doc(db, GAME_STATE_DOC);
    const gameStateSnap = await getDoc(gameStateRef);
    if (!gameStateSnap.exists()) {
      await setDoc(gameStateRef, {
        totalPlayers: 0,
        overallRewardPoints: 0,
        activePlayers: 0,
      });
    }
  } catch (error) {
    console.error("Error initializing game state: ", error);
  }
};

export const saveInitData = async (userId: string, initData: any) => {
  try {
    const playerData = {
      ...initData,
      score: INITIAL_SCORE,
      incomeRate: INITIAL_INCOME_RATE,
      claimableAmount: 0,
      energy: INITIAL_ENERGY,
      maxEnergy: INITIAL_MAX_ENERGY,
      multiplier: 1,
      miningRobotActive: false,
      tapBoostActive: false,
      chargerActive: false,
      cooldown: COOLDOWN_PERIOD,
      multiplierLevel: 1,
      miningRobotLevel: 1,
      tapBoostLevel: 1,
      maximizerLevel: 1,
      chargerLevel: 1,
      referralLink: `https://telegram.me/yourbot?start=${userId}`,
      referralCount: 0,
      referrals: [],
      tasks: TASKS.reduce((acc, task) => ({ ...acc, [task]: false }), {}),
      currentLevel: LEVELS[0].name,
      achievements: [],
      inventory: [],
      lastActiveTime: new Date(),
      sessionDuration: 0,
      balanceHistory: [],
      purchaseHistory: [],
      friendsList: [],
      referralBonuses: [],
      dailyMissions: [],
      eventParticipation: [],
    };
    await setDoc(doc(db, 'players', userId), playerData);

    const gameStateRef = doc(db, GAME_STATE_DOC);
    await updateDoc(gameStateRef, {
      totalPlayers: increment(1),
      activePlayers: increment(1),
    });
  } catch (error) {
    console.error("Error saving init data: ", error);
  }
};

export const addReferral = async (userId: string, referrerId: string) => {
  try {
    const userRef = doc(db, 'players', userId);
    const referrerRef = doc(db, 'players', referrerId);

    await updateDoc(userRef, {
      referrals: arrayUnion(referrerId),
    });

    await updateDoc(referrerRef, {
      referralCount: increment(1),
      referrals: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error adding referral: ", error);
  }
};

export const updateGameState = async (userId: string, updateData: any) => {
  try {
    const playerRef = doc(db, 'players', userId);
    await updateDoc(playerRef, updateData);

    const gameStateRef = doc(db, GAME_STATE_DOC);
    const gameStateSnap = await getDoc(gameStateRef);
    const gameState = gameStateSnap.data();

    if (!gameState) {
      throw new Error("Game state is undefined");
    }

    const newOverallRewardPoints = (gameState.overallRewardPoints || 0) + (updateData.score || 0);

    await updateDoc(gameStateRef, {
      overallRewardPoints: newOverallRewardPoints,
    });
  } catch (error) {
    console.error("Error updating game state: ", error);
  }
};

export const fetchGameState = async () => {
  try {
    const gameStateRef = doc(db, GAME_STATE_DOC);
    const gameStateSnap = await getDoc(gameStateRef);
    return gameStateSnap.exists() ? gameStateSnap.data() : null;
  } catch (error) {
    console.error("Error fetching game state: ", error);
    return null;
  }
};

export const updateUserBalance = async (userId: string, amount: number) => {
  try {
    const playerRef = doc(db, 'players', userId);
    await updateDoc(playerRef, {
      balance: increment(amount),
    });
  } catch (error) {
    console.error("Error updating user balance: ", error);
  }
};

export const saveGameProgress = async (userId: string, progressData: any) => {
  try {
    const playerRef = doc(db, 'players', userId);
    await updateDoc(playerRef, progressData);
  } catch (error) {
    console.error("Error saving game progress: ", error);
  }
};

export const getLeaderboard = async () => {
  try {
    const playersRef = collection(db, 'players');
    const playersSnap = await getDocs(playersRef);
    const leaderboard = playersSnap.docs.map((doc: any) => doc.data());
    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard: ", error);
    return [];
  }
};
