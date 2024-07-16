import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SDKProvider, useInitData } from '@telegram-apps/sdk-react';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import CategoriesScreen from './components/CategoriesScreen';
import Navbar from './components/NavBar';
import TaskScreen from './components/TaskScreen';
import ReferralScreen from './components/ReferralScreen';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getUserProfile, saveUserProfile, updateUserBalance } from './firebaseUtils';
import { auth } from './firebase';

const App: React.FC<{ balance: number; setBalance: React.Dispatch<React.SetStateAction<number>>; referralCount: number; setReferralCount: React.Dispatch<React.SetStateAction<number>> }> = ({ balance, setBalance, referralCount, setReferralCount }) => {
  const telegramInitData = useInitData();
  const [userData, setUserData] = useState<any | null>(null);
  const [screen, setScreen] = useState<'splash' | 'home' | 'categories'>('splash');
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setReferralCount(userProfile.referralCount || 0);
        }
      }
    };
    fetchUserData();
  }, [user, setReferralCount]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userId = user.uid;
        const profile = await getUserProfile(userId);
        if (profile) {
          setUserData(profile);
          setBalance(profile.balance || 0);
        } else {
          const newProfile = { balance: 0 }; // Initial balance
          await saveUserProfile(userId, newProfile);
          setUserData(newProfile);
          setBalance(newProfile.balance);
        }
      }
    };
    fetchUserProfile();
  }, [user, setBalance]);

  useEffect(() => {
    if (process.env.REACT_APP_ENV !== 'development' && !telegramInitData) {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/telegram-init-data');
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Failed to fetch init data:', error);
        }
      };
      fetchData();
    }
  }, [telegramInitData]);

  useEffect(() => {
    const timer = setTimeout(() => setScreen('home'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => setScreen('categories');

  if (screen === 'splash') {
    return <SplashScreen />;
  } else if (screen === 'home') {
    return <HomeScreen onStart={handleStart} balance={balance} setBalance={setBalance} referralCount={referralCount} />;
  } else if (screen === 'categories') {
    return <CategoriesScreen />;
  }

  return null;
};

const Root: React.FC = () => {
  const [balance, setBalance] = useState<number>(0); // Shared state for balance
  const [referralCount, setReferralCount] = useState<number>(0); // Shared state for referral count
  const [user] = useAuthState(auth);

  const handleTaskComplete = async (reward: number) => {
    const newBalance = balance + reward;
    setBalance(newBalance);
    if (user) {
      const userId = user.uid;
      await saveUserProfile(userId, { balance: newBalance });
    }
  };

  return (
    <SDKProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App balance={balance} setBalance={setBalance} referralCount={referralCount} setReferralCount={setReferralCount} />} />
          <Route path="/home" element={<HomeScreen onStart={() => {}} balance={balance} setBalance={setBalance} referralCount={referralCount} />} />
          <Route 
            path="/tasks" 
            element={<TaskScreen onTaskComplete={handleTaskComplete} referralCount={referralCount} />} // Pass the referralCount prop
          />
          <Route path="/frens" element={<ReferralScreen />} />
        </Routes>
        <Navbar />
      </Router>
    </SDKProvider>
  );
};

export default Root;
