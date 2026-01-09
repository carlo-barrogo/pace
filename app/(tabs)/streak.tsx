import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRunningData } from '@/hooks/useRunningData';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const fs = Typography;

export default function StreakScreen() {
  const { profile, getActivityCalendar } = useRunningData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const activityCalendar = getActivityCalendar();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Group calendar into weeks
  const weeks: Array<Array<{ date: string; hasRun: boolean; distance?: number }>> = [];
  for (let i = 0; i < activityCalendar.length; i += 7) {
    weeks.push(activityCalendar.slice(i, i + 7));
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.title}>
          Your Streak
        </ThemedText>

        {/* Main Streak Display */}
        <View style={[styles.streakMain, { backgroundColor: colors.warning }]}>
          <ThemedText style={styles.streakEmoji}>🔥</ThemedText>
          <ThemedText style={styles.streakNumber}>
            {profile?.currentStreak || 0}
          </ThemedText>
          <ThemedText style={styles.streakLabel}>Current Streak</ThemedText>
          <ThemedText style={styles.streakSubtext}>
            Keep running to extend your streak!
          </ThemedText>
        </View>

        {/* Best Streak */}
        <View style={[styles.bestStreak, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.bestStreakContent}>
            <ThemedText style={[styles.bestStreakIcon, { color: colors.tint }]}>
              🏆
            </ThemedText>
            <View style={styles.bestStreakText}>
              <ThemedText style={[styles.bestStreakTitle, { color: colors.text }]}>
                Best Streak
              </ThemedText>
              <ThemedText style={styles.bestStreakValue}>
                {profile?.longestStreak || 0} days
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Calendar Heatmap */}
        <View style={styles.calendarSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Activity Calendar
          </ThemedText>
          <ThemedText style={[styles.calendarSubtitle, { color: colors.textSecondary }]}>
            Last 30 days
          </ThemedText>

          {/* Day Labels */}
          <View style={styles.dayLabels}>
            {dayLabels.map((label, index) => (
              <View key={index} style={styles.dayLabel}>
                <ThemedText
                  style={[styles.dayLabelText, { color: colors.textSecondary }]}
                >
                  {label}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {dayLabels.map((_, dayIndex) => {
                const day = week[dayIndex];
                return (
                  <View
                    key={dayIndex}
                    style={[
                      styles.dayCell,
                      {
                        backgroundColor: day?.hasRun
                          ? colors.success
                          : colors.cardBackground,
                      },
                    ]}
                  >
                    {day?.hasRun && (
                      <ThemedText style={styles.dayEmoji}>✓</ThemedText>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Stats Summary */}
        <View style={styles.statsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            This Week
          </ThemedText>
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.cardBackground }]}>
              <ThemedText style={[styles.statEmoji, { color: colors.tint }]}>
                🏃
              </ThemedText>
              <ThemedText style={[styles.statNumber, { color: colors.text }]}>
                {activityCalendar.filter(
                  (d) =>
                    d.hasRun &&
                    new Date(d.date).getTime() >
                      Date.now() - 7 * 24 * 60 * 60 * 1000
                ).length}
              </ThemedText>
              <ThemedText
                style={[styles.statDescription, { color: colors.textSecondary }]}
              >
                Runs
              </ThemedText>
            </View>

            <View style={[styles.statBox, { backgroundColor: colors.cardBackground }]}>
              <ThemedText style={[styles.statEmoji, { color: colors.tint }]}>
                📅
              </ThemedText>
              <ThemedText style={[styles.statNumber, { color: colors.text }]}>
                {activityCalendar.filter((d) => d.hasRun).length}
              </ThemedText>
              <ThemedText
                style={[styles.statDescription, { color: colors.textSecondary }]}
              >
                Active Days
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Motivational Message */}
        <View
          style={[styles.motivationCard, { backgroundColor: colors.cardBackground }]}
        >
          <ThemedText style={styles.motivationIcon}>💪</ThemedText>
          <ThemedText
            style={[styles.motivationText, { color: colors.text }]}
          >
            {profile?.currentStreak && profile.currentStreak >= 7
              ? "Amazing! You've maintained a week-long streak. Keep it up!"
              : profile?.currentStreak && profile.currentStreak >= 3
              ? "Great progress! Every run counts toward your streak."
              : "Start your streak today! Every day counts."}
          </ThemedText>
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
  streakMain: {
    alignItems: 'center',
    marginHorizontal: fs.lg,
    marginBottom: fs.base,
    padding: fs['3xl'],
    borderRadius: 20,
  },
  streakEmoji: {
    fontSize: fs['6xl'],
    marginBottom: fs.sm,
  },
  streakNumber: {
    fontSize: fs.giant,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: fs.giant * 1.1,
  },
  streakLabel: {
    fontSize: fs['2xl'],
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  streakSubtext: {
    fontSize: fs.base,
    color: 'rgba(255,255,255,0.8)',
    marginTop: fs.sm,
  },
  bestStreak: {
    marginHorizontal: fs.lg,
    marginBottom: fs['3xl'],
    padding: fs.lg,
    borderRadius: 16,
  },
  bestStreakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestStreakIcon: {
    fontSize: fs['3xl'],
    marginRight: fs.base,
  },
  bestStreakText: {
    flex: 1,
  },
  bestStreakTitle: {
    fontSize: fs.sm,
    fontWeight: '500',
  },
  bestStreakValue: {
    fontSize: fs['3xl'],
    fontWeight: 'bold',
  },
  calendarSection: {
    paddingHorizontal: fs.lg,
    marginBottom: fs['3xl'],
  },
  sectionTitle: {
    fontSize: fs['2xl'],
    fontWeight: '600',
    marginBottom: 4,
  },
  calendarSubtitle: {
    fontSize: fs.base,
    marginBottom: fs.base,
  },
  dayLabels: {
    flexDirection: 'row',
    marginBottom: fs.sm,
  },
  dayLabel: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabelText: {
    fontSize: fs.xs,
    fontWeight: '500',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  dayEmoji: {
    fontSize: fs.sm,
    color: '#fff',
  },
  statsSection: {
    paddingHorizontal: fs.lg,
    marginBottom: fs['3xl'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: fs.base,
  },
  statBox: {
    flex: 1,
    padding: fs.base,
    borderRadius: 16,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: fs['3xl'],
    marginBottom: fs.sm,
  },
  statNumber: {
    fontSize: fs['3xl'],
    fontWeight: 'bold',
  },
  statDescription: {
    fontSize: fs.sm,
    marginTop: 4,
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: fs.lg,
    padding: fs.lg,
    borderRadius: 16,
  },
  motivationIcon: {
    fontSize: fs['3xl'],
    marginRight: fs.base,
  },
  motivationText: {
    flex: 1,
    fontSize: fs.base,
    lineHeight: fs.lg,
  },
  bottomSpacing: {
    height: 100,
  },
});
