import React, { useState, useEffect } from 'react';
import { FaLink, FaUserFriends } from 'react-icons/fa';
import { useInitData } from '@telegram-apps/sdk-react';
import { getUserProfile, saveUserProfile } from '../firebaseUtils';

const ReferralScreen: React.FC = () => {
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState<number | null>(null);
  const telegramInitData = useInitData();
  const [user, setUser] = useState<any | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (telegramInitData?.user) {
        const userId = telegramInitData.user.id.toString();
        const profile = await getUserProfile(userId);
        if (profile) {
          setUser(profile);
          setReferrals(profile.referrals || []);
          setReferralCount(profile.referrals?.length || 0);

          let link = profile.referralLink;
          if (!link) {
            // Generate a new referral link if it doesn't exist
            link = `https://t.me/TRC_Miner_Bot?start=${userId}`;
            await saveUserProfile(userId, { referralLink: link });
          }
          setReferralLink(link);
        }
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
    } else {
      console.error('User is undefined, cannot generate referral link.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-500 p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invite Friends</h1>
        </div>
        <div className="bg-gray-800 p-2 rounded-full">
          <FaUserFriends size={24} />
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
              <span className="break-words text-ref">{referralLink}</span>
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
            <p>You have {referralCount} referral{referralCount !== 1 && 's'}.</p>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
        <h3 className="text-lg font-bold text-black mb-4">Your Referrals</h3>
        {referrals.length > 0 ? (
          referrals.map((referral, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-900 p-4 rounded-lg mb-2">
              <div className="flex items-center">
                <img src={referral.photoUrl || 'https://storges.xyz/images/storges.png'} alt="Referral" className="w-10 h-10 rounded-full mr-4" />
                <div>
                  <p className="font-bold">{referral.username}</p>
                  <p className="text-gray-400 text-xs">👥 {referral.referralsCount}</p>
                </div>
              </div>
              <p className="font-bold text-lg">{referral.balance.toLocaleString()} STG</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No referrals yet</p>
        )}
      </div>
    </div>
  );
};

export default ReferralScreen;
