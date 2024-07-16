import { doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface Task {
  id: number;
  description: string;
  reward: number;
  completed: boolean;
}

export const saveInitData = async (userId: string, initData: any) => {
  try {
    await setDoc(doc(db, 'users', userId), { initData }, { merge: true });
    console.log('Initialization data saved successfully');
  } catch (error) {
    console.error('Error saving initialization data:', error);
  }
};

export const saveGameProgress = async (userId: string, progress: any) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, { progress });
  } else {
    await updateDoc(userRef, {
      progress: progress
    });
  }
};

export const getInitData = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()?.initData;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching initialization data:', error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, profile: any) => {
  try {
    await setDoc(doc(db, 'users', userId), profile, { merge: true });
    console.log('User profile saved successfully');
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserBalance = async (userId: string, amount: number) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, { balance: amount });
  } else {
    await updateDoc(userRef, {
      balance: amount
    });
  }
};

export const updateUserTasks = async (userId: string, tasks: Task[]) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, { tasks });
  } else {
    await updateDoc(userRef, {
      tasks: tasks
    });
  }
};

export const getLeaderboard = async () => {
  const leaderboardRef = query(
    collection(db, 'users'),
    orderBy('balance', 'desc'),
    limit(10)
  );
  const snapshot = await getDocs(leaderboardRef);
  return snapshot.docs.map(doc => doc.data());
};

/// Get referrals
export const getReferrals = async (referralIds: string[]) => {
  const referrals = [];
  for (const id of referralIds) {
    const referral = await getUserProfile(id);
    if (referral) {
      referrals.push(referral);
    }
  }
  return referrals;
};
