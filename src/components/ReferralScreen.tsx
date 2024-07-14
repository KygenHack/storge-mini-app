// src/components/ReferralScreen.tsx
import React, { useState, useEffect } from 'react';
import { FaStar, FaLink } from 'react-icons/fa';
import { useInitData } from '@telegram-apps/sdk-react';
import { getReferralLink, saveReferralLink, getUserProfile } from '../firebaseUtils';

const ReferralScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState<number | null>(null);
  const initData = useInitData();

  useEffect(() => {
    if (initData?.user) {
      const userId = initData.user.id.toString();
      const fetchReferralData = async () => {
        try {
          const profile = await getUserProfile(userId);
          if (profile?.referrals) {
            setReferralCount(profile.referrals.length);
          }

          let link = await getReferralLink(userId);
          if (!link) {
            // Generate a new referral link if it doesn't exist
            link = `https://t.me/TRC_Miner_Bot?start=${userId}`;
            await saveReferralLink(userId, link);
          }
          setReferralLink(link);
        } catch (error) {
          console.error('Error getting referral data:', error);
        }
      };

      fetchReferralData();
    }
  }, [initData]);

  const generateReferralLink = () => {
    if (initData?.user) {
      const userId = initData.user.id;
      const link = `https://t.me/TRC_Miner_Bot?start=${userId}`;
      setReferralLink(link);
      saveReferralLink(userId.toString(), link).catch(error => {
        console.error('Error saving referral link:', error);
      });
    } else {
      console.error('Telegram SDK not initialized or user not found.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-500 p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invite Friends</h1>
        </div>
        <div className="bg-gray-800 p-2 rounded-full">
          <FaStar size={24} />
        </div>
      </div>
      <div className="bg-white text-gray-900 rounded-lg shadow-md p-6 w-full max-w-lg mb-6 mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">Generate Your Referral Link</h2>
        <button
          onClick={generateReferralLink}
          className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 mb-4"
        >
          Generate Link
        </button>
        {referralLink && (
          <div>
            <p className="mb-2">Share this link with your friends:</p>
            <div className="bg-gray-100 p-2 rounded-lg flex items-center justify-between">
              <span className="break-words">{referralLink}</span>
              <button
                onClick={() => navigator.clipboard.writeText(referralLink)}
                className="ml-2 text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <FaLink size={20} />
              </button>
            </div>
          </div>
        )}
        {referralCount !== null && (
          <div className="mt-4">
            <p>You have {referralCount} referrals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralScreen;
