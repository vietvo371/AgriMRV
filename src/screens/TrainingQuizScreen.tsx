import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularProgress from '../component/CircularProgress';

interface TrainingQuizScreenProps {
  navigation: any;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const TrainingQuizScreen: React.FC<TrainingQuizScreenProps> = ({
  navigation,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the recommended minimum spacing between rice plants?',
      options: ['10 cm', '20 cm', '30 cm', '40 cm'],
      correctAnswer: 1,
    },
    {
      id: '2',
      text: 'Which of these is NOT a sign of nitrogen deficiency in crops?',
      options: [
        'Yellowing of older leaves',
        'Stunted growth',
        'Purple leaf coloration',
        'Increased leaf size',
      ],
      correctAnswer: 3,
    },
    {
      id: '3',
      text: 'How often should you monitor soil moisture during the growing season?',
      options: [
        'Once a month',
        'Weekly',
        'Daily',
        'Only when plants show stress',
      ],
      correctAnswer: 2,
    },
    {
      id: '4',
      text: 'What is the best time to apply fertilizer?',
      options: [
        'Early morning',
        'Midday',
        'Late afternoon',
        'Any time is fine',
      ],
      correctAnswer: 0,
    },
    {
      id: '5',
      text: 'Which practice helps prevent soil erosion?',
      options: [
        'Deep plowing',
        'Contour farming',
        'Removing crop residue',
        'Frequent tilling',
      ],
      correctAnswer: 1,
    },
  ];

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
  }, []);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      Alert.alert('Error', 'Please select an answer before continuing');
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.reduce((count: number, answer, index) => {
      return count + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
    setAnswers(new Array(questions.length).fill(null));
  };

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Training Results" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Card style={styles.resultsCard}>
              <View style={styles.scoreContainer}>
                <CircularProgress
                  size={150}
                  strokeWidth={15}
                  progress={score}
                  color={
                    score >= 80
                      ? theme.colors.success
                      : score >= 60
                      ? theme.colors.warning
                      : theme.colors.error
                  }>
                  <View style={styles.scoreCenter}>
                    <Text style={styles.scoreValue}>{score}%</Text>
                    <Text style={styles.scoreLabel}>Score</Text>
                  </View>
                </CircularProgress>
              </View>

              <Text style={styles.resultMessage}>
                {score >= 80
                  ? "Excellent! You've earned a credit score boost!"
                  : score >= 60
                  ? "Good job! Keep learning to improve your score."
                  : "Keep practicing to improve your knowledge."}
              </Text>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Icon
                    name="check-circle"
                    size={24}
                    color={theme.colors.success}
                  />
                  <Text style={styles.statLabel}>Correct</Text>
                  <Text style={styles.statValue}>
                    {answers.filter(
                      (answer, index) => answer === questions[index].correctAnswer
                    ).length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon
                    name="close-circle"
                    size={24}
                    color={theme.colors.error}
                  />
                  <Text style={styles.statLabel}>Incorrect</Text>
                  <Text style={styles.statValue}>
                    {answers.filter(
                      (answer, index) => answer !== questions[index].correctAnswer
                    ).length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon
                    name="clock"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.statLabel}>Questions</Text>
                  <Text style={styles.statValue}>{questions.length}</Text>
                </View>
              </View>
            </Card>

            <ButtonCustom
              title="Retake Quiz"
              onPress={handleRetake}
              style={styles.retakeButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Training Quiz" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <Card style={styles.questionCard}>
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex].text}
            </Text>

            <View style={styles.optionsContainer}>
              {questions[currentQuestionIndex].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === index && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleAnswer(index)}>
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.optionDot,
                        selectedAnswer === index && styles.optionDotSelected,
                      ]}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        selectedAnswer === index && styles.optionTextSelected,
                      ]}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <View style={styles.navigationButtons}>
            <ButtonCustom
              title="Previous"
              onPress={handlePrevious}
              variant="outline"
              style={{
                ...styles.navButton,
                ...(currentQuestionIndex === 0 ? { opacity: 0.5 } : {}),
              }}
              disabled={currentQuestionIndex === 0}
            />
            <ButtonCustom
              title={
                currentQuestionIndex === questions.length - 1
                  ? 'Finish'
                  : 'Next'
              }
              onPress={handleNext}
              style={styles.navButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  questionCard: {
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  optionsContainer: {
    gap: theme.spacing.md,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
  },
  optionDotSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  navButton: {
    flex: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  resultsCard: {
    marginBottom: theme.spacing.xl,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  scoreCenter: {
    alignItems: 'center',
  },
  scoreValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 36,
    color: theme.colors.text,
  },
  scoreLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
  },
  resultMessage: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    marginVertical: theme.spacing.xs,
  },
  statValue: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
  },
  retakeButton: {
    marginTop: theme.spacing.md,
  },
});

export default TrainingQuizScreen;
