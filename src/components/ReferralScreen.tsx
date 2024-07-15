import React, { useEffect, useState } from 'react';
import { FaStar, FaLink } from 'react-icons/fa';
import { useInitData } from '@telegram-apps/sdk-react';
import { getUserProfile, saveUserProfile } from '../firebaseUtils';

const ReferralScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const telegramInitData = useInitData();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (telegramInitData?.user) {
        const profile = await getUserProfile(telegramInitData.user.id.toString());
        setUser(profile);
      }
    };

    fetchProfile();
  }, [telegramInitData]);

  const generateReferralLink = async () => {
    if (user) {
      const userId = user.id;
      const link = `https://t.me/TRC_Miner_Bot?start=${userId}`;
      setReferralLink(link);
      try {
        await saveUserProfile(userId, { referralLink: link });
      } catch (error) {
        console.error('Error saving referral link:', error);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-500 to-indigo-800 text-white flex flex-col items-center p-6">
      <button 
        onClick={() => window.history.back()} 
        className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 mb-6"
      >
        Back to Home
      </button>
      <div className="bg-white text-gray-900 rounded-lg shadow-md p-6 w-full max-w-6xl mb-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Referral Program</h2>
        <div className="text-center">
          <button 
            onClick={generateReferralLink} 
            className="bg-green-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
          >
            Generate Referral Link
          </button>
          {referralLink && (
            <div className="mt-4">
              <p className="text-lg">Your Referral Link:</p>
              <div className="flex items-center justify-center mt-2">
                <FaLink className="mr-2" />
                <a href={referralLink} className="text-blue-600 hover:underline">{referralLink}</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralScreen;
