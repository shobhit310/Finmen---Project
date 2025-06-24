import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, Achievement } from '../types';
import { userService } from '../services/userService';

export const useGameification = (
  user: User | null, 
  firebaseUser: FirebaseUser | null,
  updateUser: (updates: Partial<User>) => void
) => {
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);

  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 100) + 1;
  };

  const calculateXPForNextLevel = (level: number): number => {
    return level * 100;
  };

  const getCurrentLevelXP = (xp: number): number => {
    return xp % 100;
  };

  const addXP = async (amount: number, action: string) => {
    if (!user || !firebaseUser) return;

    const newXP = user.xp + amount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > user.level;
    
    const updates = {
      xp: newXP,
      level: newLevel,
      lastAction: action,
      lastActionDate: new Date(),
      totalActions: user.totalActions + 1
    };

    await updateUser(updates);

    if (leveledUp) {
      showAchievement({
        id: `level-${newLevel}`,
        title: `Level ${newLevel} Reached!`,
        description: `You've reached level ${newLevel}!`,
        xpReward: 0,
        icon: '🎉',
        unlocked: true,
        unlockedDate: new Date()
      });
    }
  };

  const updateStreak = async () => {
    if (!user || !firebaseUser) return;

    const today = new Date();
    const lastAction = new Date(user.lastActionDate);
    const daysDiff = Math.floor((today.getTime() - lastAction.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = user.streak;
    
    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      newStreak = user.streak + 1;
    } else {
      // Missed days, reset streak
      newStreak = 1;
    }

    await updateUser({ streak: newStreak });

    // Check for streak achievements
    if (newStreak === 7) {
      showAchievement({
        id: 'streak-7',
        title: '7-Day Streak!',
        description: 'You\'ve been active for 7 days in a row!',
        xpReward: 50,
        icon: '🔥',
        unlocked: true,
        unlockedDate: new Date()
      });
      await addXP(50, '7-day streak bonus');
    } else if (newStreak === 30) {
      showAchievement({
        id: 'streak-30',
        title: '30-Day Streak!',
        description: 'Amazing dedication! 30 days in a row!',
        xpReward: 200,
        icon: '👑',
        unlocked: true,
        unlockedDate: new Date()
      });
      await addXP(200, '30-day streak bonus');
    }
  };

  const showAchievement = (achievement: Achievement) => {
    setRecentAchievements(prev => [achievement, ...prev].slice(0, 3));
    setTimeout(() => {
      setRecentAchievements(prev => prev.filter(a => a.id !== achievement.id));
    }, 5000);
  };

  return {
    addXP,
    updateStreak,
    calculateLevel,
    calculateXPForNextLevel,
    getCurrentLevelXP,
    recentAchievements,
    showAchievement
  };
};