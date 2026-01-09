import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Run } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

const fs = Typography;

interface RunHistoryCardProps {
  run: Run;
}

export function RunHistoryCard({ run }: RunHistoryCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.dateContainer}>
        <ThemedText style={[styles.dateText, { color: colors.textSecondary }]}>
          {formatDate(run.date)}
        </ThemedText>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: colors.text }]}>
            {run.distance.toFixed(2)} km
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Distance
          </ThemedText>
        </View>
        
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: colors.text }]}>
            {formatTime(run.duration)}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Time
          </ThemedText>
        </View>
        
        <View style={styles.stat}>
          <ThemedText style={[styles.statValue, { color: colors.text }]}>
            {run.pace.toFixed(1)}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            min/km
          </ThemedText>
        </View>
      </View>
      
      {run.notes && (
        <ThemedText style={[styles.notes, { color: colors.textSecondary }]}>
          {run.notes}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: fs.base,
    marginBottom: fs.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    marginBottom: fs.sm,
  },
  dateText: {
    fontSize: fs.sm,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fs.lg,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fs.xs,
  },
  notes: {
    marginTop: fs.sm,
    fontSize: fs.sm,
    fontStyle: 'italic',
  },
});
