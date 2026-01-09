import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRunningData } from '@/hooks/useRunningData';
import { LeaderboardEntry } from '@/types';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const fs = Typography;

type SortOption = 'weekly' | 'allTime' | 'streak';

export default function LeaderboardScreen() {
  const { leaderboard, profile, runs } = useRunningData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [sortBy, setSortBy] = useState<SortOption>('weekly');

  // Add current user to leaderboard
  const getSortedLeaderboard = () => {
    const currentUserEntry: LeaderboardEntry = {
      rank: 0,
      userId: 'current_user',
      name: profile?.name || 'You',
      totalDistance: profile?.totalDistance || 0,
      weeklyDistance: 0,
      streak: profile?.currentStreak || 0,
    };

    // Calculate weekly distance for current user
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRuns = runs.filter(run => new Date(run.date) >= weekAgo);
    currentUserEntry.weeklyDistance = weeklyRuns.reduce((sum, run) => sum + run.distance, 0);

    let combined = [...leaderboard];
    if (profile) {
      // Check if current user is already in leaderboard
      const existingIndex = combined.findIndex(e => e.userId === 'current_user');
      if (existingIndex === -1) {
        combined = [...combined, currentUserEntry];
      }
    }

    // Sort based on selected option
    switch (sortBy) {
      case 'weekly':
        return combined.sort((a, b) => b.weeklyDistance - a.weeklyDistance);
      case 'allTime':
        return combined.sort((a, b) => b.totalDistance - a.totalDistance);
      case 'streak':
        return combined.sort((a, b) => b.streak - a.streak);
      default:
        return combined;
    }
  };

  const sortedLeaderboard = getSortedLeaderboard();

  const renderLeaderboardItem = (entry: LeaderboardEntry, index: number) => {
    const isCurrentUser = entry.userId === 'current_user';
    const rank = index + 1;
    
    let rankColor;
    if (rank === 1) {
      rankColor = '#FFD700'; // Gold
    } else if (rank === 2) {
      rankColor = '#C0C0C0'; // Silver
    } else if (rank === 3) {
      rankColor = '#CD7F32'; // Bronze
    } else {
      rankColor = colors.textSecondary;
    }

    return (
      <View
        key={entry.userId}
        style={[
          styles.leaderboardItem,
          {
            backgroundColor: colors.cardBackground,
            borderWidth: isCurrentUser ? 2 : 0,
            borderColor: colors.tint,
          },
        ]}
      >
        <View style={styles.rankContainer}>
          <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
            <ThemedText style={styles.rankText}>
              {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : String(rank)}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: isCurrentUser ? colors.tint : colors.icon }]}>
            <ThemedText style={styles.avatarText}>
              {entry.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.userDetails}>
            <ThemedText style={[styles.userName, { color: colors.text }]}>
              {entry.name}
              {isCurrentUser && ' (You)'}
            </ThemedText>
            <ThemedText style={[styles.userStreak, { color: colors.textSecondary }]}>
              🔥 {entry.streak} day streak
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {entry.weeklyDistance.toFixed(1)} km
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
              This Week
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {entry.totalDistance.toFixed(1)} km
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
              All Time
            </ThemedText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.title}>
          Leaderboard
        </ThemedText>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              {
                backgroundColor: sortBy === 'weekly' ? colors.tint : colors.cardBackground,
              },
            ]}
            onPress={() => setSortBy('weekly')}
          >
            <ThemedText
              style={[
                styles.sortButtonText,
                { color: sortBy === 'weekly' ? '#fff' : colors.text },
              ]}
            >
              This Week
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortButton,
              {
                backgroundColor: sortBy === 'allTime' ? colors.tint : colors.cardBackground,
              },
            ]}
            onPress={() => setSortBy('allTime')}
          >
            <ThemedText
              style={[
                styles.sortButtonText,
                { color: sortBy === 'allTime' ? '#fff' : colors.text },
              ]}
            >
              All Time
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortButton,
              {
                backgroundColor: sortBy === 'streak' ? colors.tint : colors.cardBackground,
              },
            ]}
            onPress={() => setSortBy('streak')}
          >
            <ThemedText
              style={[
                styles.sortButtonText,
                { color: sortBy === 'streak' ? '#fff' : colors.text },
              ]}
            >
              Streaks
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Your Position */}
        {profile && (
          <View style={[styles.yourPosition, { backgroundColor: colors.tint }]}>
            <ThemedText style={styles.yourPositionTitle}>
              Your Position
            </ThemedText>
            <ThemedText style={styles.yourPositionValue}>
              #{sortedLeaderboard.findIndex(e => e.userId === 'current_user') + 1}
            </ThemedText>
          </View>
        )}

        {/* Leaderboard List */}
        <View style={styles.listContainer}>
          {sortedLeaderboard.map((entry, index) =>
            renderLeaderboardItem(entry, index)
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: fs['4xl'],
    fontWeight: 'bold',
    paddingHorizontal: fs.lg,
    paddingTop: fs.lg,
    paddingBottom: fs.base,
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: fs.lg,
    gap: fs.sm,
    marginBottom: fs.base,
  },
  sortButton: {
    flex: 1,
    paddingVertical: fs.sm,
    borderRadius: 10,
    alignItems: 'center',
  },
  sortButtonText: {
    fontWeight: '600',
    fontSize: fs.sm,
  },
  yourPosition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: fs.lg,
    marginBottom: fs.base,
    padding: fs.lg,
    borderRadius: 16,
  },
  yourPositionTitle: {
    fontSize: fs.lg,
    fontWeight: '600',
    color: '#fff',
  },
  yourPositionValue: {
    fontSize: fs['3xl'],
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: fs.lg,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: fs.base,
    borderRadius: 14,
    marginBottom: fs.sm,
  },
  rankContainer: {
    marginRight: fs.sm,
  },
  rankBadge: {
    width: fs['3xl'],
    height: fs['3xl'],
    borderRadius: fs['3xl'] / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: fs['2xl'],
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: fs['3xl'],
    height: fs['3xl'],
    borderRadius: fs['3xl'] / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: fs.sm,
  },
  avatarText: {
    fontSize: fs.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: fs.lg,
    fontWeight: '600',
  },
  userStreak: {
    fontSize: fs.sm,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: fs.base,
  },
  statItem: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: fs.base,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: fs.xs,
    textTransform: 'uppercase',
  },
  bottomSpacing: {
    height: 100,
  },
});
