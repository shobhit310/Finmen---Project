import React, { useState } from 'react';
import { MoodEntry } from '../types';
import { Smile } from 'lucide-react';

interface MoodCheckInProps {
  onMoodSubmit: (mood: MoodEntry) => void;
}

const moods = [
  { emoji: '😄', label: 'Excellent', value: 'excellent' },
  { emoji: '😊', label: 'Good', value: 'good' },
  { emoji: '😐', label: 'Okay', value: 'okay' },
  { emoji: '😔', label: 'Low', value: 'low' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '🤗', label: 'Grateful', value: 'grateful' },
  { emoji: '💪', label: 'Motivated', value: 'motivated' },
  { emoji: '😴', label: 'Tired', value: 'tired' }
];

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onMoodSubmit }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood) return;

    const moodEntry: MoodEntry = {
      id: Date.now().toString(),
      emoji: moods.find(m => m.value === selectedMood)?.emoji || '😊',
      mood: selectedMood,
      note: note.trim() || null,
      date: new Date()
    };

    onMoodSubmit(moodEntry);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedMood('');
      setNote('');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smile className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Thanks for sharing!</h3>
          <p className="text-gray-600">Your mood has been recorded. +10 XP earned!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">How are you feeling today?</h3>
      
      <div className="grid grid-cols-4 gap-3 mb-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
              selectedMood === mood.value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <div className="text-xs text-gray-600">{mood.label}</div>
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Any thoughts to add? (optional)"
        className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        rows={3}
      />

      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        Record Mood (+10 XP)
      </button>
    </div>
  );
};