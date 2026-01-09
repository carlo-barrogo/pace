import { DailyActivity, LeaderboardEntry, Run, UserProfile } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const RUNS_KEY = '@runs';
const PROFILE_KEY = '@profile';
const LEADERBOARD_KEY = '@leaderboard';

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'user1', name: 'Sarah Johnson', totalDistance: 156.5, weeklyDistance: 28.3, streak: 12 },
  { rank: 2, userId: 'user2', name: 'Mike Chen', totalDistance: 142.2, weeklyDistance: 25.1, streak: 8 },
  { rank: 3, userId: 'user3', name: 'Emma Wilson', totalDistance: 128.7, weeklyDistance: 22.8, streak: 15 },
  { rank: 4, userId: 'user4', name: 'John Davis', totalDistance: 115.3, weeklyDistance: 18.5, streak: 5 },
  { rank: 5, userId: 'user5', name: 'Lisa Anderson', totalDistance: 98.4, weeklyDistance: 15.2, streak: 3 },
  { rank: 6, userId: 'user6', name: 'David Brown', totalDistance: 87.6, weeklyDistance: 12.1, streak: 7 },
  { rank: 7, userId: 'user7', name: 'Amy Taylor', totalDistance: 76.3, weeklyDistance: 10.5, streak: 4 },
  { rank: 8, userId: 'user8', name: 'Chris Lee', totalDistance: 65.8, weeklyDistance: 8.9, streak: 2 },
];

export function useRunningData() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      // Load or create profile
      const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        const newProfile: UserProfile = {
          id: 'current_user',
          name: 'Runner',
          totalRuns: 0,
          totalDistance: 0,
          totalTime: 0,
          currentStreak: 0,
          longestStreak: 0,
        };
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
        setProfile(newProfile);
      }

      // Load runs
      const storedRuns = await AsyncStorage.getItem(RUNS_KEY);
      if (storedRuns) {
        setRuns(JSON.parse(storedRuns));
      }

      // Load or initialize leaderboard
      const storedLeaderboard = await AsyncStorage.getItem(LEADERBOARD_KEY);
      if (storedLeaderboard) {
        setLeaderboard(JSON.parse(storedLeaderboard));
      } else {
        // Add current user to leaderboard
        const userLeaderboard = [...SAMPLE_LEADERBOARD];
        setLeaderboard(userLeaderboard);
        await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(userLeaderboard));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRun = useCallback(async (run: Omit<Run, 'id'>) => {
    try {
      const newRun: Run = {
        ...run,
        id: Date.now().toString(),
      };

      const updatedRuns = [newRun, ...runs];
      setRuns(updatedRuns);
      await AsyncStorage.setItem(RUNS_KEY, JSON.stringify(updatedRuns));

      // Update profile stats
      if (profile) {
        const newTotalRuns = profile.totalRuns + 1;
        const newTotalDistance = profile.totalDistance + run.distance;
        const newTotalTime = profile.totalTime + run.duration;

        const updatedProfile = {
          ...profile,
          totalRuns: newTotalRuns,
          totalDistance: parseFloat(newTotalDistance.toFixed(1)),
          totalTime: newTotalTime,
        };

        setProfile(updatedProfile);
        await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));

        // Update streak
        await updateStreak(updatedProfile, newRun.date);
      }
    } catch (error) {
      console.error('Error adding run:', error);
    }
  }, [runs, profile]);

  const updateStreak = async (currentProfile: UserProfile, runDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = currentProfile.currentStreak;

    if (runDate === today) {
      // Run today - check if we already ran yesterday
      const hasYesterdayRun = runs.some(run => run.date.startsWith(yesterday));
      if (hasYesterdayRun) {
        newStreak = currentProfile.currentStreak + 1;
      } else if (currentProfile.currentStreak === 0) {
        newStreak = 1;
      }
    } else if (runDate === yesterday && currentProfile.currentStreak === 0) {
      newStreak = 1;
    }

    const updatedProfile = {
      ...currentProfile,
      currentStreak: newStreak,
      longestStreak: Math.max(currentProfile.longestStreak, newStreak),
    };

    setProfile(updatedProfile);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
  };

  const getWeeklyStats = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyRuns = runs.filter(run => new Date(run.date) >= weekAgo);
    const totalDistance = weeklyRuns.reduce((sum, run) => sum + run.distance, 0);
    const totalTime = weeklyRuns.reduce((sum, run) => sum + run.duration, 0);
    const avgPace = weeklyRuns.length > 0 
      ? weeklyRuns.reduce((sum, run) => sum + run.pace, 0) / weeklyRuns.length 
      : 0;

    return {
      runs: weeklyRuns.length,
      distance: parseFloat(totalDistance.toFixed(1)),
      time: totalTime,
      avgPace: parseFloat(avgPace.toFixed(2)),
    };
  }, [runs]);

  const getMonthlyStats = useCallback(() => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const monthlyRuns = runs.filter(run => new Date(run.date) >= monthAgo);
    const totalDistance = monthlyRuns.reduce((sum, run) => sum + run.distance, 0);
    const totalTime = monthlyRuns.reduce((sum, run) => sum + run.duration, 0);

    return {
      runs: monthlyRuns.length,
      distance: parseFloat(totalDistance.toFixed(1)),
      time: totalTime,
    };
  }, [runs]);

  const getActivityCalendar = useCallback((): DailyActivity[] => {
    const activities: DailyActivity[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayRun = runs.find(run => run.date.startsWith(dateStr));
      
      activities.push({
        date: dateStr,
        hasRun: !!dayRun,
        distance: dayRun?.distance,
      });
    }
    
    return activities;
  }, [runs]);

  return {
    runs,
    profile,
    leaderboard,
    loading,
    addRun,
    getWeeklyStats,
    getMonthlyStats,
    getActivityCalendar,
  };
}
