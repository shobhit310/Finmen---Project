import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, MoodEntry, JournalEntry } from '../types';

export const userService = {
  // Create or update user profile
  async createUserProfile(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      joinDate: serverTimestamp(),
      lastActionDate: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        id: userSnap.id,
        joinDate: data.joinDate?.toDate() || new Date(),
        lastActionDate: data.lastActionDate?.toDate() || new Date()
      } as User;
    }
    return null;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      lastActionDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  // Add mood entry
  async addMoodEntry(userId: string, moodEntry: Omit<MoodEntry, 'id'>): Promise<string> {
    const moodRef = collection(db, 'users', userId, 'moods');
    const docRef = await addDoc(moodRef, {
      ...moodEntry,
      date: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Get recent mood entries
  async getMoodEntries(userId: string, limitCount: number = 10): Promise<MoodEntry[]> {
    const moodRef = collection(db, 'users', userId, 'moods');
    const q = query(moodRef, orderBy('date', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date()
    })) as MoodEntry[];
  },

  // Add journal entry
  async addJournalEntry(userId: string, journalEntry: Omit<JournalEntry, 'id'>): Promise<string> {
    const journalRef = collection(db, 'users', userId, 'journal');
    const docRef = await addDoc(journalRef, {
      ...journalEntry,
      date: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Get recent journal entries
  async getJournalEntries(userId: string, limitCount: number = 10): Promise<JournalEntry[]> {
    const journalRef = collection(db, 'users', userId, 'journal');
    const q = query(journalRef, orderBy('date', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date()
    })) as JournalEntry[];
  }
};