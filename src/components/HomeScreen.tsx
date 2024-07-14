import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useInitData } from '@telegram-apps/sdk-react';
import { InitData, User } from '../types';
import { useSpring, animated } from '@react-spring/web';
import TaskScreen from './TaskScreen'; // Import the TaskScreen component
import { trophy } from '../images'; // Add the path to your trophy image
import Modal from 'react-modal'; // Import the modal library

Modal.setAppElement('#root'); // Set the app element for accessibility

interface HomeScreenProps {
  onStart: () => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

interface Click {
  id: number;
  x: number;
  y: number;
  points: number;
}

const INITIAL_SCORE = 0;
const INITIAL_ENERGY = 5000;
const INITIAL_MAX_ENERGY = 6500;
const INITIAL_INCOME_RATE = 50;
const COOLDOWN_PERIOD = 50 * 60;
const BOOST_COST_MULTIPLIER = 100;

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

const getLevel = (balance: number) => {
  return LEVELS.find(level => balance >= level.minBalance && balance <= level.maxBalance) || LEVELS[0];
};

const useFetchInitData = (telegramInitData: any) => {
  const [userData, setUserData] = useState<InitData | null>(null);

  useEffect(() => {
    if (process.env.REACT_APP_ENV !== 'development' && !telegramInitData) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/telegram-init-data');
          if (!response.ok) throw new Error('Network response was not ok');
          const data: InitData = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Failed to fetch init data:', error);
        }
      };

      fetchData();
    }
  }, [telegramInitData]);

  return userData;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, balance, setBalance }) => {
  const telegramInitData = useInitData();
  const userData = useFetchInitData(telegramInitData);

  const user: User | null = telegramInitData && telegramInitData.user
    ? {
        id: telegramInitData.user.id,
        firstName: telegramInitData.user.firstName || '',
        username: telegramInitData.user.username,
        isBot: telegramInitData.user.isBot,
        lastName: telegramInitData.user.lastName,
        languageCode: telegramInitData.user.languageCode,
        photoUrl: telegramInitData.user.photoUrl,
        isPremium: telegramInitData.user.isPremium,
        allowsWriteToPm: telegramInitData.user.allowsWriteToPm,
      }
    : userData
    ? userData.user
    : null;

  const [score, setScore] = useState<number>(INITIAL_SCORE); // Initial balance
  const [incomeRate, setIncomeRate] = useState<number>(INITIAL_INCOME_RATE); // Income rate per 5 seconds
  const [claimableAmount, setClaimableAmount] = useState<number>(0); // Amount that can be claimed
  const [clicks, setClicks] = useState<Click[]>([]); // Clicks for animations
  const [energy, setEnergy] = useState<number>(INITIAL_ENERGY); // Initial energy
  const [maxEnergy, setMaxEnergy] = useState<number>(INITIAL_MAX_ENERGY); // Max energy limit
  const [multiplier, setMultiplier] = useState<number>(1); // Points multiplier
  const [miningRobotActive, setMiningRobotActive] = useState<boolean>(false); // Mining robot state
  const [tapBoostActive, setTapBoostActive] = useState<boolean>(false); // Tap boost state
  const [chargerActive, setChargerActive] = useState<boolean>(false); // Charger state
  const [cooldown, setCooldown] = useState<number | null>(null); // Cooldown time in seconds
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [showShop, setShowShop] = useState<boolean>(false); // Show shop state
  const [quote, setQuote] = useState<string>(''); // Web3 quote
  const [fact, setFact] = useState<string>(''); // Storge Coin fact
  const [showTasks, setShowTasks] = useState<boolean>(false); // Show tasks page state
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false); // Show leaderboard modal state

  // Boost levels
  const [multiplierLevel, setMultiplierLevel] = useState<number>(1);
  const [miningRobotLevel, setMiningRobotLevel] = useState<number>(1);
  const [tapBoostLevel, setTapBoostLevel] = useState<number>(1);
  const [maximizerLevel, setMaximizerLevel] = useState<number>(1);
  const [chargerLevel, setChargerLevel] = useState<number>(1);

  const [previousScore, setPreviousScore] = useState<number>(INITIAL_SCORE);
  const animatedScore = useSpring({ from: { number: previousScore }, number: score, delay: 200 });

  const [wobble, setWobble] = useState(false);
  const { transform } = useSpring({
    transform: wobble ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 200, friction: 12 },
    onRest: () => setWobble(false),
  });

  useEffect(() => {
    if (cooldown !== null) {
      const endTime = Date.now() + cooldown * 1000;
      const interval = setInterval(() => {
        const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setRemainingTime(timeLeft);
        if (timeLeft === 0) {
          clearInterval(interval);
          setCooldown(null);
          setRemainingTime(null);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  useEffect(() => {
    const incomeInterval = setInterval(() => {
      setClaimableAmount((prevAmount) => prevAmount + incomeRate);
    }, 5000); // Increment every 5 seconds

    return () => clearInterval(incomeInterval);
  }, [incomeRate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + (chargerActive ? 2 : 1), maxEnergy));
    }, 100); // Restore energy every second (2 if charger is active)

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [chargerActive, maxEnergy]);

  useEffect(() => {
    if (miningRobotActive) {
      const miningInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 10); // Increase score by 10 every 5 seconds
      }, 5000);

      return () => clearInterval(miningInterval); // Clear interval on component unmount
    }
  }, [miningRobotActive]);

  useEffect(() => {
    if (tapBoostActive) {
      const tapBoostTimeout = setTimeout(() => {
        setTapBoostActive(false); // Deactivate tap boost after 30 seconds
      }, 30000);

      return () => clearTimeout(tapBoostTimeout); // Clear timeout on component unmount
    }
  }, [tapBoostActive]);

  // Web3 Quotes
  const quotes = useMemo(
    () => [
      "The future of finance is decentralized.",
      "Blockchain technology is revolutionizing the world.",
      "Smart contracts are the building blocks of trust.",
      "Decentralized applications (DApps) are the future of software.",
      "Cryptocurrencies are the money of the future.",
      "Web3 is bringing power back to the people.",
      "Your keys, your coins. Security is paramount.",
      "Embrace the new digital economy with Web3.",
      "Interoperability is the key to the success of blockchain.",
      "The internet of value is here, thanks to Web3."
    ],
    []
  );

  useEffect(() => {
    const getDailyQuote = () => {
      const today = new Date().getDate();
      const quoteIndex = today % quotes.length;
      setQuote(quotes[quoteIndex]);
    };

    getDailyQuote();

    const quoteInterval = setInterval(() => {
      getDailyQuote();
    }, 24 * 60 * 60 * 1000); // Update quote daily

    return () => clearInterval(quoteInterval);
  }, [quotes]);

  // Storge Coin Facts
  const facts = useMemo(
    () => [
      "You can earn Storge Coin by completing daily tasks.",
      "Invite friends to join and earn bonus Storge Coins.",
      "Use Storge Coins to upgrade your mining robots for faster earnings.",
      "Participate in weekly challenges to earn extra Storge Coins.",
      "Invest your Storge Coins in the game to unlock special features.",
      "Daily login rewards provide you with free Storge Coins.",
      "Upgrade your energy capacity to mine more Storge Coins.",
      "Tap boosts can double your Storge Coin earnings for a limited time.",
      "The more you play, the more Storge Coins you can earn.",
      "Watch ads to get additional Storge Coins instantly."
    ],
    []
  );

  useEffect(() => {
    const getDailyFact = () => {
      const today = new Date().getDate();
      const factIndex = today % facts.length;
      setFact(facts[factIndex]);
    };

    getDailyFact();

    const factInterval = setInterval(() => {
      getDailyFact();
    }, 24 * 60 * 60 * 1000); // Update fact daily

    return () => clearInterval(factInterval);
  }, [facts]);

  const handleClaim = useCallback(() => {
    if (cooldown === null) {
      setPreviousScore(score);
      setScore((prevScore) => prevScore + claimableAmount);
      setClaimableAmount(0);
      setCooldown(COOLDOWN_PERIOD); // Set cooldown to 50 minutes (in seconds)
    }
  }, [cooldown, claimableAmount, score]);

  const handleTapCoin = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (energy > 0) {
        const basePoints = 1;
        const booster = Math.random() < 0.1 ? Math.floor(Math.random() * 10) + 1 : 0; // 10% chance for a random booster between 1 and 10
        const points = basePoints + booster;
        const totalPoints = points * (tapBoostActive ? 2 : 1) * multiplier; // Apply tap boost and multiplier

        setPreviousScore(score);
        setScore((prevScore) => prevScore + totalPoints); // Increment score by total points
        setEnergy((prevEnergy) => prevEnergy - 10); // Decrease energy by 10 on tap

        const newClick: Click = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          points: totalPoints,
        };

        setClicks((prevClicks) => [...prevClicks, newClick]);
        setWobble(true); // Trigger wobble animation
      }
    },
    [energy, multiplier, score, tapBoostActive]
  );

  const handleAnimationEnd = useCallback((id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  }, []);

  const randomItems = useMemo(
    () => ["Golden Hammer", "Mystic Stone", "Lucky Coin", "Ancient Scroll"],
    []
  );
  const [randomItem, setRandomItem] = useState<string>(randomItems[Math.floor(Math.random() * randomItems.length)]);

  useEffect(() => {
    const itemInterval = setInterval(() => {
      setRandomItem(randomItems[Math.floor(Math.random() * randomItems.length)]);
    }, 10000); // Change item every 10 seconds

    return () => clearInterval(itemInterval);
  }, [randomItems]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  const buyBoost = useCallback(
    (boost: string) => {
      let cost = 0;
      switch (boost) {
        case 'multiplier':
          cost = multiplierLevel * BOOST_COST_MULTIPLIER;
          if (score >= cost && multiplierLevel < 10) {
            setScore(score - cost);
            setMultiplierLevel(multiplierLevel + 1);
            if (multiplierLevel === 9) setMultiplier(multiplier * 2);
          }
          break;
        case 'miningRobot':
          cost = miningRobotLevel * BOOST_COST_MULTIPLIER;
          if (score >= cost && miningRobotLevel < 10) {
            setScore(score - cost);
            setMiningRobotLevel(miningRobotLevel + 1);
            if (miningRobotLevel === 9) setMiningRobotActive(true);
          }
          break;
        case 'tapBoost':
          cost = tapBoostLevel * BOOST_COST_MULTIPLIER;
          if (score >= cost && tapBoostLevel < 10) {
            setScore(score - cost);
            setTapBoostLevel(tapBoostLevel + 1);
            if (tapBoostLevel === 9) setTapBoostActive(true);
          }
          break;
        case 'maximizer':
          cost = maximizerLevel * BOOST_COST_MULTIPLIER;
          if (score >= cost && maximizerLevel < 10) {
            setScore(score - cost);
            setMaximizerLevel(maximizerLevel + 1);
            if (maximizerLevel === 9) setMaxEnergy(maxEnergy + 1000);
          }
          break;
        case 'charger':
          cost = chargerLevel * BOOST_COST_MULTIPLIER;
          if (score >= cost && chargerLevel < 10) {
            setScore(score - cost);
            setChargerLevel(chargerLevel + 1);
            if (chargerLevel === 9) setChargerActive(true);
          }
          break;
        default:
          break;
      }
    },
    [multiplierLevel, score, miningRobotLevel, tapBoostLevel, maximizerLevel, chargerLevel, multiplier, maxEnergy]
  );

  const handleTaskComplete = useCallback(
    (reward: number) => {
      setPreviousScore(score);
      setScore(score + reward);
      setBalance(balance + reward); // Update main balance
    },
    [balance, score, setBalance]
  );

  const level = useMemo(() => getLevel(balance), [balance]);
  const levelIndex = LEVELS.findIndex(l => l === level);

  const leaderboard = useMemo(
    () => [
      { username: 'Player1', level: 'Ultra Rich', balance: 1500000 },
      { username: 'Player2', level: 'Rich', balance: 900000 },
      { username: 'Player3', level: 'Affluent', balance: 450000 },
      { username: 'Player4', level: 'Wealthy', balance: 120000 },
      { username: 'Player5', level: 'Comfortable', balance: 75000 },
    ],
    []
  );

  if (showTasks) {
    return <TaskScreen onBack={() => setShowTasks(false)} onTaskComplete={handleTaskComplete} balance={balance} setBalance={setBalance} />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-500 to-indigo-800 text-white flex flex-col items-center p-4">
      {user ? (
        <>
          <div className="w-full max-w-md bg-white rounded-lg p-4 mb-4 shadow-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src={user.photoUrl || 'https://storges.xyz/images/storges.png'}
                alt="User Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="ml-1 text-xs text-gray-500">@{user.username}</span>
                <div className="text-xs flex items-center text-black">
                  <small className="ml-1 text-gray-500">ID: {user.id}</small>
                </div>
              
                <div className="text-xs flex items-center text-black">
                  <small className="ml-1 text-gray-500">Language: {user.languageCode}</small>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowShop(!showShop)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
              aria-label="Toggle Shop"
            >
              Boost
            </button>
          </div>
          {showShop && (
            <div className="w-full max-w-md bg-white rounded-lg p-4 mb-4 shadow-lg text-center">
              <h2 className="text-xl font-bold text-gray-800 mt-4">Boosts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-100 rounded-lg p-4 shadow-md">
                  <p className="text-lg font-bold text-gray-800">Multiplier</p>
                  <p className="text-sm text-gray-600">Level {multiplierLevel}</p>
                  <p className="text-sm text-gray-600">Cost: ${multiplierLevel * BOOST_COST_MULTIPLIER}</p>
                  <button
                    onClick={() => buyBoost('multiplier')}
                    className={`w-full px-2 py-1 mt-2 rounded-lg transition duration-300 ${multiplierLevel >= 10 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    disabled={multiplierLevel >= 10}
                    aria-label={`Buy Multiplier Boost Level ${multiplierLevel}`}
                  >
                    {multiplierLevel >= 10 ? 'You own this item' : 'Buy'}
                  </button>
                </div>
                <div className="bg-blue-100 rounded-lg p-4 shadow-md">
                  <p className="text-lg font-bold text-gray-800">Mining Robot</p>
                  <p className="text-sm text-gray-600">Level {miningRobotLevel}</p>
                  <p className="text-sm text-gray-600">Cost: ${miningRobotLevel * BOOST_COST_MULTIPLIER}</p>
                  <button
                    onClick={() => buyBoost('miningRobot')}
                    className={`w-full px-2 py-1 mt-2 rounded-lg transition duration-300 ${miningRobotLevel >= 10 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    disabled={miningRobotLevel >= 10}
                    aria-label={`Buy Mining Robot Boost Level ${miningRobotLevel}`}
                  >
                    {miningRobotLevel >= 10 ? 'You own this item' : 'Buy'}
                  </button>
                </div>
                <div className="bg-blue-100 rounded-lg p-4 shadow-md">
                  <p className="text-lg font-bold text-gray-800">Tap Boost</p>
                  <p className="text-sm text-gray-600">Level {tapBoostLevel}</p>
                  <p className="text-sm text-gray-600">Cost: ${tapBoostLevel * BOOST_COST_MULTIPLIER}</p>
                  <button
                    onClick={() => buyBoost('tapBoost')}
                    className={`w-full px-2 py-1 mt-2 rounded-lg transition duration-300 ${tapBoostLevel >= 10 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    disabled={tapBoostLevel >= 10}
                    aria-label={`Buy Tap Boost Level ${tapBoostLevel}`}
                  >
                    {tapBoostLevel >= 10 ? 'You own this item' : 'Buy'}
                  </button>
                </div>
                <div className="bg-blue-100 rounded-lg p-4 shadow-md">
                  <p className="text-lg font-bold text-gray-800">Maximizer</p>
                  <p className="text-sm text-gray-600">Level {maximizerLevel}</p>
                  <p className="text-sm text-gray-600">Cost: ${maximizerLevel * BOOST_COST_MULTIPLIER}</p>
                  <button
                    onClick={() => buyBoost('maximizer')}
                    className={`w-full px-2 py-1 mt-2 rounded-lg transition duration-300 ${maximizerLevel >= 10 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    disabled={maximizerLevel >= 10}
                    aria-label={`Buy Maximizer Boost Level ${maximizerLevel}`}
                  >
                    {maximizerLevel >= 10 ? 'You own this item' : 'Buy'}
                  </button>
                </div>
                <div className="bg-blue-100 rounded-lg p-4 shadow-md">
                  <p className="text-lg font-bold text-gray-800">Charger</p>
                  <p className="text-sm text-gray-600">Level {chargerLevel}</p>
                  <p className="text-sm text-gray-600">Cost: ${chargerLevel * BOOST_COST_MULTIPLIER}</p>
                  <button
                    onClick={() => buyBoost('charger')}
                    className={`w-full px-2 py-1 mt-2 rounded-lg transition duration-300 ${chargerLevel >= 10 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    disabled={chargerLevel >= 10}
                    aria-label={`Buy Charger Boost Level ${chargerLevel}`}
                  >
                    {chargerLevel >= 10 ? 'You own this item' : 'Buy'}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="w-full max-w-md bg-white rounded-lg p-4 mb-4 shadow-lg text-center">
            <div className="flex flex-col items-center">
              <animated.h1 className="text-3xl font-bold text-gray-800">
                {animatedScore.number.to((n) => `$${n.toFixed(2)}`)}
              </animated.h1>
              <p className="text-xs text-gray-500 mt-1">Storge Coin Balance</p>
              <div className="w-full bg-gray-300 rounded-full h-3 mt-2 mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(energy / maxEnergy) * 100}%` }}
                  aria-label={`Energy level: ${energy} out of ${maxEnergy}`}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{energy}/{maxEnergy} Energy</p>
              <animated.img
                src="https://storges.xyz/images/storges.png"
                alt="Coins"
                width="60%"
                className="mb-4 mt-4 cursor-pointer"
                style={{ transform }}
                onClick={handleTapCoin}
                aria-label="Tap to earn coins"
              />
              <small className="text-gray-500">Storges Farming</small>
              <p className="text-xl text-yellow-500">${claimableAmount.toFixed(2)}</p>
              <button
                onClick={handleClaim}
                className="bg-green-600 text-white w-full px-2 py-1 mt-2 rounded-lg hover:bg-green-700 transition duration-300"
                disabled={cooldown !== null}
                aria-label={cooldown === null ? 'Claim Rewards' : `Next claim in ${formatTime(remainingTime!)}`}
              >
                {cooldown === null ? 'Claim Rewards' : `Next claim in ${formatTime(remainingTime!)}`}
              </button>
              <div className="flex justify-between w-full mt-2">
              <div className="w-full max-w-md p-4 mb-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs text-gray-500">{fact}</p>
              </div>
            </div>
          </div>
                {/* <button
                  onClick={() => setShowLeaderboard(true)}
                  className="bg-blue-600 w-full text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  View Leaderboard
                </button> */}
              </div>
            </div>
          </div>
          {clicks.map((click) => (
            <div
              key={click.id}
              className="absolute text-3xl font-bold opacity-0 float-animation"
              style={{
                top: `${click.y - 42}px`,
                left: `${click.x - 28}px`,
              }}
              onAnimationEnd={() => handleAnimationEnd(click.id)}
              aria-hidden="true"
            >
              +{click.points}
            </div>
          ))}
          
          <Modal
            isOpen={showLeaderboard}
            onRequestClose={() => setShowLeaderboard(false)}
            contentLabel="Leaderboard"
            className="max-w-md mx-auto bg-white rounded-lg p-4 shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Leaderboard</h2>
            <button
              onClick={() => setShowLeaderboard(false)}
              className="text-sm bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition duration-300 absolute top-2 right-2"
            >
              Close
            </button>
            <ul>
              {leaderboard.map((player, index) => (
                <li key={index} className="mb-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold">{player.username}</span>
                    <span className="text-sm">{player.level}</span>
                    <span className="text-sm">${player.balance.toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Modal>
        </>
      ) : (
        <p className="text-xl">Initializing...</p>
      )}
    </div>
  );
};

export default HomeScreen;
