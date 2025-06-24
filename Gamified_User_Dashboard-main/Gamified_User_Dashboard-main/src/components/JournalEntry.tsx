import React, { useState } from 'react';
import { JournalEntry as JournalEntryType } from '../types';
import { BookOpen, Save } from 'lucide-react';

interface JournalEntryProps {
  onJournalSubmit: (entry: JournalEntryType) => void;
  recentEntries: JournalEntryType[];
}

export const JournalEntry: React.FC<JournalEntryProps> = ({ onJournalSubmit, recentEntries }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    const entry: JournalEntryType = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date()
    };

    onJournalSubmit(entry);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setTitle('');
      setContent('');
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Entry Saved!</h3>
          <p className="text-gray-600">Your journal entry has been saved. +20 XP earned!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Entry Form */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">New Journal Entry</h3>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={6}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Save Entry (+20 XP)
          </button>
        </div>
      </div>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Recent Entries</h4>
          <div className="space-y-3">
            {recentEntries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-800">{entry.title}</h5>
                  <span className="text-xs text-gray-500">
                    {entry.date.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};