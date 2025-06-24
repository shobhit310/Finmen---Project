import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService } from '../services/userService';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userProfile = await userService.getUserProfile(firebaseUser.uid);
          setUser(userProfile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to load user profile');
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const newUser: Omit<User, 'id' | 'joinDate' | 'lastActionDate'> = {
        username,
        email,
        xp: 0,
        level: 1,
        streak: 0,
        lastAction: 'Account created',
        totalActions: 0
      };
      
      await userService.createUserProfile(userCredential.user.uid, newUser);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!firebaseUser || !user) return;
    
    try {
      await userService.updateUserProfile(firebaseUser.uid, updates);
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user profile');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    user,
    firebaseUser,
    isLoading,
    error,
    login,
    register,
    updateUser,
    logout
  };
};