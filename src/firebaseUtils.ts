// src/firebaseUtils.ts
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from './firebase';

export const saveInitData = async (userId: string, initData: any) => {
  try {
    await setDoc(doc(db, "users", userId), { initData }, { merge: true });
    console.log("Initialization data saved successfully");
  } catch (error) {
    console.error("Error saving initialization data:", error);
  }
};

export const getInitData = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()?.initData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching initialization data:", error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, profile: any) => {
  try {
    await setDoc(doc(db, "users", userId), { profile }, { merge: true });
    console.log("User profile saved successfully");
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()?.profile;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const getReferralLink = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()?.referralLink;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching referral link:", error);
    return null;
  }
};

export const saveReferralLink = async (userId: string, referralLink: string) => {
  try {
    await updateDoc(doc(db, "users", userId), { referralLink });
    console.log("Referral link saved successfully");
  } catch (error) {
    console.error("Error saving referral link:", error);
  }
};
