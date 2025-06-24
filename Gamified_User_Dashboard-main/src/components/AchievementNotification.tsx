import React from 'react';
import { Achievement } from '../types';
import { X } from 'lucide-react';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onClose: (id: string) => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievements, 
  onClose 
}) => {
  if (achievements.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-lg transform animate-slide-in-right max-w-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h4 className="font-bold text-sm">{achievement.title}</h4>
                <p className="text-xs opacity-90">{achievement.description}</p>
                {achievement.xpReward > 0 && (
                  <p className="text-xs font-medium mt-1">+{achievement.xpReward} XP</p>
                )}
              </div>
            </div>
            <button
              onClick={() => onClose(achievement.id)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};