import React from 'react';
import { User } from '../types';
import { Trophy, Zap, Flame, Calendar } from 'lucide-react';

interface UserStatsProps {
  user: User;
  getCurrentLevelXP: (xp: number) => number;
  calculateXPForNextLevel: (level: number) => number;
}

export const UserStats: React.FC<UserStatsProps> = ({ 
  user, 
  getCurrentLevelXP, 
  calculateXPForNextLevel 
}) => {
  const currentLevelXP = getCurrentLevelXP(user.xp);
  const xpForNextLevel = calculateXPForNextLevel(user.level);
  const progressPercentage = (currentLevelXP / 100) * 100;

  const stats = [
    {
      icon: Trophy,
      label: 'Level',
      value: user.level,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Zap,
      label: 'Total XP',
      value: user.xp.toLocaleString(),
      color: 'from-blue-400 to-purple-500'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${user.streak} days`,
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: Calendar,
      label: 'Total Actions',
      value: user.totalActions,
      color: 'from-green-400 to-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Level Progress</h3>
          <span className="text-2xl font-bold text-indigo-600">Level {user.level}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{currentLevelXP} XP</span>
            <span>{xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            {100 - currentLevelXP} XP until next level
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};