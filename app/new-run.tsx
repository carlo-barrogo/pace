import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRunningData } from '@/hooks/useRunningData';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const fs = Typography;

export default function NewRunScreen() {
  const { addRun, profile } = useRunningData();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    const dist = parseFloat(distance);
    const hrs = parseInt(hours) || 0;
    const mins = parseInt(minutes) || 0;

    if (!distance || isNaN(dist) || dist <= 0) {
      Alert.alert('Error', 'Please enter a valid distance');
      return;
    }

    if (hrs === 0 && mins === 0) {
      Alert.alert('Error', 'Please enter your running time');
      return;
    }

    const totalMinutes = hrs * 60 + mins;
    const pace = totalMinutes / dist;

    const runData = {
      date: new Date().toISOString(),
      distance: dist,
      duration: totalMinutes,
      pace: pace,
      calories: Math.round(dist * 60), // rough estimate
      notes: notes || undefined,
    };

    await addRun(runData);
    Alert.alert('Success', 'Run saved!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const fillSampleData = () => {
    setDistance('5.0');
    setHours('0');
    setMinutes('30');
    setNotes('Morning run');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.title}>
          Log Your Run
        </ThemedText>

        {/* Distance Input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Distance (km)</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.cardBackground,
              },
            ]}
            value={distance}
            onChangeText={setDistance}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Time Input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Time</ThemedText>
          <View style={styles.timeRow}>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
                value={hours}
                onChangeText={setHours}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
              <ThemedText style={styles.timeLabel}>Hours</ThemedText>
            </View>
            <ThemedText style={styles.timeSeparator}>:</ThemedText>
            <View style={styles.timeInputContainer}>
              <TextInput
                style={[
                  styles.timeInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardBackground,
                  },
                ]}
                value={minutes}
                onChangeText={setMinutes}
                placeholder="00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
              <ThemedText style={styles.timeLabel}>Minutes</ThemedText>
            </View>
          </View>
        </View>

        {/* Pace Display */}
        {distance && (parseInt(hours) || parseInt(minutes)) && (
          <View style={[styles.paceCard, { backgroundColor: colors.cardBackground }]}>
            <ThemedText style={styles.paceLabel}>Estimated Pace</ThemedText>
            <ThemedText style={styles.paceValue}>
              {(() => {
                const dist = parseFloat(distance);
                const mins = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
                if (dist > 0) {
                  const pace = mins / dist;
                  const paceMins = Math.floor(pace);
                  const paceSecs = Math.round((pace - paceMins) * 60);
                  return `${paceMins}:${paceSecs.toString().padStart(2, '0')} min/km`;
                }
                return '--:-- min/km';
              })()}
            </ThemedText>
          </View>
        )}

        {/* Notes Input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Notes (optional)</ThemedText>
          <TextInput
            style={[
              styles.textArea,
              {
                color: colors.text,
                backgroundColor: colors.cardBackground,
              },
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder="How was your run?"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Sample Data Button */}
        <TouchableOpacity
          style={[styles.sampleButton, { backgroundColor: colors.cardBackground }]}
          onPress={fillSampleData}
        >
          <ThemedText style={[styles.sampleButtonText, { color: colors.textSecondary }]}>
            Fill Sample Data (5km in 30min)
          </ThemedText>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          onPress={handleSave}
        >
          <ThemedText style={styles.saveButtonText}>Save Run</ThemedText>
        </TouchableOpacity>

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
    padding: fs.lg,
  },
  title: {
    fontSize: fs['4xl'],
    fontWeight: 'bold',
    marginBottom: fs['3xl'],
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: fs['2xl'],
  },
  label: {
    fontSize: fs.lg,
    fontWeight: '600',
    marginBottom: fs.sm,
  },
  input: {
    fontSize: fs['3xl'],
    fontWeight: 'bold',
    padding: fs.base,
    borderRadius: 12,
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: fs.base,
  },
  timeInputContainer: {
    alignItems: 'center',
    flex: 1,
  },
  timeInput: {
    fontSize: fs['4xl'],
    fontWeight: 'bold',
    padding: fs.base,
    borderRadius: 12,
    textAlign: 'center',
    width: '100%',
  },
  timeLabel: {
    fontSize: fs.xs,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  timeSeparator: {
    fontSize: fs['4xl'],
    fontWeight: 'bold',
    marginBottom: fs['2xl'],
  },
  paceCard: {
    padding: fs.lg,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: fs['2xl'],
  },
  paceLabel: {
    fontSize: fs.sm,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  paceValue: {
    fontSize: fs['3xl'],
    fontWeight: 'bold',
  },
  textArea: {
    fontSize: fs.base,
    padding: fs.base,
    borderRadius: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sampleButton: {
    padding: fs.base,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: fs.base,
  },
  sampleButtonText: {
    fontSize: fs.sm,
    fontStyle: 'italic',
  },
  saveButton: {
    padding: fs['2xl'],
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: fs['2xl'],
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomSpacing: {
    height: 40,
  },
});
