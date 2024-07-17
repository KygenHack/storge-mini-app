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
    <div className="relative min-h-screen bg-gradient-to-b from-blue-500 to-indigo-800 text-white flex flex-col items-center p-4">
      <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-3xl mb-6">
        <div className="flex flex-col items-center mb-6">
          <FaUserFriends className="text-6xl mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-center">Invite Friends</h1>
          <p className="text-gray-400 text-xs text-center mb-4">Score 10% from buddies + 2.5% from their referrals. Get a 🎟 play pass for each friend.</p>
          <div className="bg-gray-700 p-4 rounded-lg mb-4 w-full">
            <p className="text-gray-300 text-center">Calculating...</p>
          </div>
          <button 
            onClick={generateReferralLink} 
            className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 mb-4"
          >
            Generate Link
          </button>
          {referralLink && (
            <div className="w-full">
              <p className="text-xs text-center mb-2">Your Referral Link:</p>
              <div className="bg-gray-600 p-2 rounded-lg flex items-center justify-between">
                <span className="break-words text-ref">{referralLink}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(referralLink)}
                  className="ml-2 text-blue-400 hover:text-blue-600 transition duration-300"
                >
                  <FaLink size={20} />
                </button>
              </div>
            </div>
          )}
          {referralCount !== null && (
            <div className="mt-4">
              <p className="text-center text-xs">You have {referralCount} referral{referralCount !== 1 && 's'}.</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-black mb-4">Your Referrals</h3>
        {referrals.length > 0 ? (
          referrals.map((referral, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg mb-2">
              <div className="flex items-center">
                <img src={referral.photoUrl || 'https://storges.xyz/images/storges.png'} alt="Referral" className="w-10 h-10 rounded-full mr-4" />
                <div>
                  <p className="font-bold">{referral.username}</p>
                  <p className="text-gray-400 text-xs">👥 {referral.referralsCount}</p>
                </div>
              </div>
              <p className="font-bold text-lg">{(referral.balance || 0).toLocaleString()} STG</p>
            </div>
          ))
        ) : (
          <p className="text-black">No referrals yet</p>
        )}
      </div>
    </div>
  );
};

export default ReferralScreen;
