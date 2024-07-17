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
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center p-6">
      <div className="bg-black text-white rounded-lg shadow-md p-6 w-full max-w-6xl mb-6 text-center">
        <button 
          onClick={() => window.history.back()} 
          className="absolute top-4 left-4 bg-gray-800 text-white px-6 py-2 rounded-full shadow-lg hover:bg-gray-700 transition duration-300"
        >
          Cancel
        </button>
        <div className="flex justify-center items-center mb-4">
          <span className="text-4xl">👨‍👩‍👧‍👦</span>
        </div>
        <h1 className="text-xl font-bold mb-4">Invite Frens</h1>
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <p className="text-gray-400 mb-2">Calculating...</p>
        </div>
        <p className="text-gray-400 text-xs mb-6">Score 10% from buddies + 2.5% from their referrals. Get a 🎟 play pass for each fren.</p>
        <div className="text-left mb-6">
          {referralCount !== null ? (
            <h2 className="text-lg font-bold mb-2">{referralCount} fren{referralCount !== 1 && 's'}</h2>
          ) : (
            <h2 className="text-lg font-bold mb-2">No referrals yet</h2>
          )}
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
                <p className="font-bold text-lg">{(referral.balance || 0).toLocaleString()} STG</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No referrals yet</p>
          )}
        </div>
        <button 
          onClick={generateReferralLink} 
          className="bg-green-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-green-700 transition duration-300 mb-6"
        >
          Invite a fren (10 left)
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
      <div className="bg-black p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
        <h3 className="text-lg font-bold text-white mb-4">Your Referrals</h3>
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
              <p className="font-bold text-lg">{(referral.balance || 0).toLocaleString()} STG</p>
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
