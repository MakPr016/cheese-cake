import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { theme } from '../utils/theme';
import { PolarisService } from '../services/PolarisService';

interface VoiceInputProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
  polarisService: PolarisService | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ visible, onClose, onConfirm, polarisService }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && visible) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        Alert.alert(
          'Not Supported',
          'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.'
        );
        onClose();
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
        setTranscript('');
      };

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        console.log('Transcript:', transcriptResult);
        setTranscript(transcriptResult);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          Alert.alert('Permission Denied', 'Please allow microphone access to use voice input.');
        } else if (event.error === 'no-speech') {
          Alert.alert('No Speech', 'No speech was detected. Please try again.');
        } else {
          Alert.alert('Error', `Speech recognition error: ${event.error}`);
        }
      };

      recognitionInstance.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };

      setRecognition(recognitionInstance);

      return () => {
        if (recognitionInstance) {
          recognitionInstance.stop();
        }
      };
    }
  }, [visible, onClose]);

  useEffect(() => {
    if (Platform.OS !== 'web' && visible) {
      requestAudioPermissions();
    }
  }, [visible]);

  const requestAudioPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required for voice input.');
        onClose();
      }
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
    }
  };

  const startListening = async () => {
    if (Platform.OS === 'web') {
      if (recognition) {
        setTranscript('');
        try {
          recognition.start();
        } catch (error) {
          console.error('Failed to start recognition:', error);
          Alert.alert('Error', 'Failed to start voice recognition. Please try again.');
        }
      }
    } else {
      await startRecording();
    }
  };

  const stopListening = async () => {
    if (Platform.OS === 'web') {
      if (recognition) {
        recognition.stop();
      }
    } else {
      await stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsListening(true);
      setTranscript('');
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsListening(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log('Recording stopped, URI:', uri);

      if (uri && polarisService) {
        setIsTranscribing(true);
        try {
          const transcribedText = await polarisService.transcribeAudio(uri);
          setTranscript(transcribedText);
        } catch (error) {
          console.error('Transcription error:', error);
          Alert.alert('Error', 'Failed to transcribe audio. Please try again.');
        } finally {
          setIsTranscribing(false);
        }
      }

      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
      setIsTranscribing(false);
    }
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onConfirm(transcript.trim());
      setTranscript('');
      onClose();
    } else {
      Alert.alert('No Input', 'Please speak something before confirming.');
    }
  };

  const handleRetry = () => {
    setTranscript('');
    startListening();
  };

  const handleCancel = async () => {
    if (Platform.OS === 'web') {
      if (recognition && isListening) {
        recognition.stop();
      }
    } else {
      if (recording && isListening) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
        setIsListening(false);
      }
    }
    setTranscript('');
    setIsTranscribing(false);
    onClose();
  };

  if (!polarisService && Platform.OS !== 'web') {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={48} color={theme.colors.warning} />
            <Text style={styles.title}>API Key Required</Text>
            <Text style={styles.message}>
              Please configure your OpenRouter API key first to use voice input on mobile.
            </Text>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Voice Input</Text>
            <Pressable onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.microphoneContainer}>
            <View style={[styles.microphoneCircle, isListening && styles.microphoneActive]}>
              <Ionicons
                name={isListening ? 'mic' : 'mic-outline'}
                size={64}
                color={isListening ? theme.colors.text : theme.colors.primary}
              />
            </View>
            <Text style={styles.statusText}>
              {isListening 
                ? 'Listening...' 
                : isTranscribing 
                ? 'Transcribing...' 
                : transcript 
                ? 'Ready to confirm' 
                : 'Tap to start'}
            </Text>
          </View>

          {isTranscribing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Processing your voice...</Text>
            </View>
          )}

          {transcript && !isTranscribing ? (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptLabel}>Transcribed Text:</Text>
              <Text style={styles.transcript}>{transcript}</Text>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            {!isListening && !transcript && !isTranscribing && (
              <Pressable style={[styles.button, styles.startButton]} onPress={startListening}>
                <Ionicons name="mic" size={24} color={theme.colors.text} />
                <Text style={styles.buttonText}>Start Recording</Text>
              </Pressable>
            )}

            {isListening && (
              <Pressable style={[styles.button, styles.stopButton]} onPress={stopListening}>
                <Ionicons name="stop" size={24} color={theme.colors.text} />
                <Text style={styles.buttonText}>Stop</Text>
              </Pressable>
            )}

            {!isListening && transcript && !isTranscribing && (
              <>
                <Pressable style={[styles.button, styles.retryButton]} onPress={handleRetry}>
                  <Ionicons name="refresh" size={20} color={theme.colors.text} />
                  <Text style={styles.buttonText}>Retry</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                  <Ionicons name="checkmark" size={24} color={theme.colors.text} />
                  <Text style={styles.buttonText}>Confirm</Text>
                </Pressable>
              </>
            )}
          </View>

          <Text style={styles.hint}>
            {Platform.OS === 'web' 
              ? 'Speak clearly and wait for the text to appear above' 
              : 'Tap record, speak clearly, then tap stop. Your audio will be transcribed.'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 500,
    ...theme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  microphoneContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  microphoneCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  microphoneActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.success,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  statusText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  transcriptContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  transcriptLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  transcript: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
  },
  stopButton: {
    backgroundColor: theme.colors.danger,
  },
  retryButton: {
    backgroundColor: theme.colors.surfaceLight,
  },
  confirmButton: {
    backgroundColor: theme.colors.success,
  },
  buttonText: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  message: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    lineHeight: 22,
  },
  hint: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
});
