import React, { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User, MoodEntry, JournalEntry } from '../types';
import { UserStats } from './UserStats';
import { MoodCheckIn } from './MoodCheckIn';
import { JournalEntry as JournalComponent } from './JournalEntry';
import { AchievementNotification } from './AchievementNotification';
import { useGameification } from '../hooks/useGameification';
import { userService } from '../services/userService';
import { LogOut, User as UserIcon, Clock } from 'lucide-react';

interface DashboardProps {
  user: User;
  firebaseUser: FirebaseUser;
  updateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  firebaseUser, 
  updateUser, 
  onLogout 
}) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    addXP,
    updateStreak,
    getCurrentLevelXP,
    calculateXPForNextLevel,
    recentAchievements,
    showAchievement
  } = useGameification(user, firebaseUser, updateUser);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [moods, journals] = await Promise.all([
          userService.getMoodEntries(firebaseUser.uid, 10),
          userService.getJournalEntries(firebaseUser.uid, 10)
        ]);
        
        setMoodEntries(moods);
        setJournalEntries(journals);
        await updateStreak();
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [firebaseUser.uid]);

  const handleMoodSubmit = async (mood: Omit<MoodEntry, 'id'>) => {
    try {
      const moodId = await userService.addMoodEntry(firebaseUser.uid, mood);
      const newMood = { ...mood, id: moodId };
      setMoodEntries(prev => [newMood, ...prev]);
      await addXP(10, 'Mood check-in completed');
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const handleJournalSubmit = async (entry: Omit<JournalEntry, 'id'>) => {
    try {
      const entryId = await userService.addJournalEntry(firebaseUser.uid, entry);
      const newEntry = { ...entry, id: entryId };
      setJournalEntries(prev => [newEntry, ...prev]);
      await addXP(20, 'Journal entry created');
      
      if (journalEntries.length + 1 === 5) {
        showAchievement({
          id: 'journal-5',
          title: 'Journaling Habit!',
          description: 'You\'ve written 5 journal entries!',
          xpReward: 50,
          icon: '📝',
          unlocked: true,
          unlockedDate: new Date()
        });
        await addXP(50, 'Journal milestone bonus');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleAchievementClose = (id: string) => {
    // This would typically update the achievements state, but for simplicity
    // we're letting the timeout handle it in useGameification
  };

  const formatLastAction = () => {
    const timeDiff = new Date().getTime() - new Date(user.lastActionDate).getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return minutes === 0 ? 'Just now' : `${minutes} minutes ago`;
    }
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <AchievementNotification 
        achievements={recentAchievements} 
        onClose={handleAchievementClose}
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Welcome back, {user.username}!
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last activity: {user.lastAction} • {formatLastAction()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1">
            <UserStats 
              user={user}
              getCurrentLevelXP={getCurrentLevelXP}
              calculateXPForNextLevel={calculateXPForNextLevel}
            />
          </div>

          {/* Middle Column - Activities */}
          <div className="lg:col-span-1 space-y-8">
            <MoodCheckIn onMoodSubmit={handleMoodSubmit} />
          </div>

          {/* Right Column - Journal */}
          <div className="lg:col-span-1">
            <JournalComponent 
              onJournalSubmit={handleJournalSubmit}
              recentEntries={journalEntries}
            />
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{moodEntries.length}</div>
              <div className="text-sm text-gray-600">Mood Check-ins</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{journalEntries.length}</div>
              <div className="text-sm text-gray-600">Journal Entries</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{user.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};