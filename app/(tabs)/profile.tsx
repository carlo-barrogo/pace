import { RunHistoryCard } from '@/components/RunHistoryCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRunningData } from '@/hooks/useRunningData';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const fs = Typography;

export default function ProfileScreen() {
  const { runs, profile, loading, getWeeklyStats, getMonthlyStats } = useRunningData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
    }
  }, [profile]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const StatCard = ({
    title,
    value,
    subtitle,
  }: {
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
      <ThemedText style={[styles.statTitle, { color: colors.textSecondary }]}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.statValue, { color: colors.text }]}>
        {value}
      </ThemedText>
      {subtitle && (
        <ThemedText style={[styles.statSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <ThemedText style={styles.avatarText}>
              {profile?.name.charAt(0).toUpperCase() || 'R'}
            </ThemedText>
          </View>
          
          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your name"
              />
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.tint }]}
                onPress={() => setIsEditing(false)}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameContainer}>
              <ThemedText type="title" style={styles.name}>
                {profile?.name || 'Runner'}
              </ThemedText>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <ThemedText style={[styles.editButtonText, { color: colors.tint }]}>
                  Edit
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Streak Badge */}
        <View style={[styles.streakBadge, { backgroundColor: colors.warning }]}>
          <ThemedText style={styles.streakEmoji}>🔥</ThemedText>
          <View style={styles.streakTextContainer}>
            <ThemedText style={styles.streakValue}>
              {profile?.currentStreak || 0} Day Streak!
            </ThemedText>
            <ThemedText style={styles.streakSubtitle}>
              Best: {profile?.longestStreak || 0} days
            </ThemedText>
          </View>
        </View>

        {/* Overall Stats */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          All Time Stats
        </ThemedText>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Runs"
            value={String(profile?.totalRuns || 0)}
          />
          <StatCard
            title="Total Distance"
            value={`${(profile?.totalDistance || 0).toFixed(1)} km`}
          />
          <StatCard
            title="Total Time"
            value={formatTime(profile?.totalTime || 0)}
          />
        </View>

        {/* Weekly Stats */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          This Week
        </ThemedText>
        <View style={styles.statsGrid}>
          <StatCard
            title="Runs"
            value={String(weeklyStats.runs)}
          />
          <StatCard
            title="Distance"
            value={`${weeklyStats.distance} km`}
          />
          <StatCard
            title="Avg Pace (min)"
            value={`${weeklyStats.avgPace.toFixed(1)} km`}
          />
        </View>

        {/* Monthly Stats */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          This Month
        </ThemedText>
        <View style={styles.statsGrid}>
          <StatCard
            title="Runs"
            value={String(monthlyStats.runs)}
          />
          <StatCard
            title="Distance"
            value={`${monthlyStats.distance} km`}
          />
          <StatCard
            title="Time"
            value={formatTime(monthlyStats.time)}
          />
        </View>

        {/* Running History */}
        <View style={styles.historyHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Runs
          </ThemedText>
          <Link href="/new-run">
            <ThemedText style={[styles.addRunLink, { color: colors.tint }]}>
              + Log Run
            </ThemedText>
          </Link>
        </View>
        
        {runs.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.cardBackground }]}>
            <ThemedText style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No runs yet. Start your journey!
            </ThemedText>
            <Link href="/new-run">
              <TouchableOpacity
                style={[styles.emptyStateButton, { backgroundColor: colors.tint }]}
              >
                <ThemedText style={styles.emptyStateButtonText}>
                  Log Your First Run
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          runs.slice(0, 10).map((run) => (
            <RunHistoryCard key={run.id} run={run} />
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: fs['3xl'],
    paddingHorizontal: fs.lg,
  },
  avatar: {
    width: fs['6xl'],
    height: fs['6xl'],
    borderRadius: fs['6xl'] / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: fs.base,
  },
  avatarText: {
    fontSize: fs['4xl'],
    fontWeight: 'bold',
    color: '#fff',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fs.sm,
  },
  name: {
    fontSize: fs['4xl'],
    fontWeight: 'bold',
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: fs.base,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: fs.sm,
  },
  nameInput: {
    fontSize: fs['3xl'],
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 8,
    minWidth: 150,
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: fs.lg,
    paddingVertical: fs.sm,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: fs.lg,
    marginBottom: fs['3xl'],
    padding: fs.lg,
    borderRadius: 16,
  },
  streakEmoji: {
    fontSize: fs['5xl'],
    marginRight: fs.base,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakValue: {
    fontSize: fs['2xl'],
    fontWeight: 'bold',
    color: '#fff',
  },
  streakSubtitle: {
    fontSize: fs.base,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: fs['2xl'],
    fontWeight: '600',
    marginBottom: fs.base,
    paddingHorizontal: fs.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: fs.lg,
    gap: fs.base,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    padding: fs.base,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statTitle: {
    fontSize: fs.xs,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: fs['2xl'],
    fontWeight: 'bold',
  },
  statSubtitle: {
    fontSize: fs.xs,
    marginTop: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: fs.lg,
    marginTop: fs.sm,
    marginBottom: fs.base,
  },
  addRunLink: {
    fontSize: fs.base,
    fontWeight: '600',
  },
  emptyState: {
    marginHorizontal: fs.lg,
    padding: fs['3xl'],
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: fs.lg,
    textAlign: 'center',
    marginBottom: fs.base,
  },
  emptyStateButton: {
    paddingHorizontal: fs['2xl'],
    paddingVertical: fs.sm,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: fs.lg,
  },
  bottomSpacing: {
    height: 100,
  },
});
