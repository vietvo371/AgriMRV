import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventCard from '../component/EventCard';
import Marquee from '../component/Marquee';
import { theme } from '../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const onboardingData = [
  {
    id: 1,
    title: 'Điểm tín dụng minh bạch',
    description: 'Theo dõi và cải thiện tín dụng từ mỗi mùa vụ.',
    image: require('../assets/images/started/hinh6.jpg'),
  },
  {
    id: 2,
    title: 'Blockchain đảm bảo niềm tin',
    description: 'Hồ sơ tín dụng được lưu trên blockchain, không thể chỉnh sửa.',
    image: require('../assets/images/started/hinh7.jpg'),
  },
  {
    id: 3,
    title: 'AI xác thực canh tác',
    description: 'Phân tích ảnh ruộng và dữ liệu mùa vụ bằng AI đáng tin cậy.',
    image: require('../assets/images/started/hinh8.jpg'),
  },
  {
    id: 4,
    title: 'Điểm số dễ hiểu',
    description: 'Chấm điểm tín dụng minh bạch (0–100), giải thích rõ từng yếu tố.',
    image: require('../assets/images/started/hinh1.jpg'),
  },
  {
    id: 5,
    title: 'Mở rộng cơ hội vay vốn',
    description: 'Nông dân không cần thế chấp vẫn có thể tiếp cận vốn.',
    image: require('../assets/images/started/hinh2.jpg'),
  },
  {
    id: 6,
    title: 'Tài chính toàn diện',
    description: 'Giảm tín dụng đen, mang lại sự thịnh vượng cho cộng đồng nông thôn.',
    image: require('../assets/images/started/hinh3.jpg'),
  },
  {
    id: 7,
    title: 'Hồ sơ tín dụng số',
    description: 'Chia sẻ dễ dàng với ngân hàng và hợp tác xã để xin vay.',
    image: require('../assets/images/started/hinh4.jpg'),
  },
  {
    id: 8,
    title: 'AgriCred – Trust in Every Harvest',
    description: 'Mỗi mùa vụ trở thành bằng chứng số minh bạch, giúp vay vốn công bằng.',
    image: require('../assets/images/started/hinh5.jpg'),
  },

];

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleComplete = async () => {
    try {
      navigation.replace('Login');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  };

  // Ensure activeIndex is always within bounds
  const safeActiveIndex = Math.max(0, Math.min(activeIndex, onboardingData.length - 1));
  const currentItem = onboardingData[safeActiveIndex];

  // Safety check - if no item is available, use the first one
  if (!currentItem) {
    return null; // or a loading state
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        key={currentItem.image}
        source={currentItem.image}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        entering={FadeIn.duration(1000)}
      />

      <View style={styles.overlay} />

      <BlurView blurType="dark" blurAmount={70} style={styles.blurContainer}>
        <SafeAreaView style={styles.safeArea}>
          {/* Top part - Marquee cards */}
          <Animated.View
            style={styles.marqueeContainer}
            entering={FadeInUp.springify().mass(1).damping(30)}
          >
            <Marquee
              items={onboardingData}
              renderItem={({ item }) => <EventCard event={item} />}
              onIndexChange={(index) => {
                // Ensure the index stays within bounds
                const safeIndex = Math.max(0, Math.min(index, onboardingData.length - 1));
                setActiveIndex(safeIndex);
              }}
            />
          </Animated.View>

          {/* Bottom part - Text and button */}
          <View style={styles.bottomContainer}>
            <Animated.Text
              style={styles.welcomeText}
              entering={FadeInUp.springify().mass(1).damping(30).delay(500)}
            >
              Welcome to
            </Animated.Text>

            <Animated.Text
              style={styles.title}
              entering={FadeIn.duration(500).delay(500)}
            >
              AgriMRV
            </Animated.Text>

            <Animated.Text
              style={styles.description}
              entering={FadeInUp.springify().mass(1).damping(30).delay(500)}
            >
              Join us on the journey to sustainable development with Vietnamese farmers
            </Animated.Text>

            <AnimatedPressable
              onPress={handleComplete}
              style={styles.button}
              entering={FadeInUp.springify().mass(1).damping(30).delay(500)}
            >
              <Animated.Text style={styles.buttonText}>
                Start MRV journey
              </Animated.Text>
            </AnimatedPressable>
          </View>
        </SafeAreaView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(66, 138, 104, 0.7)',
  },
  blurContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  marqueeContainer: {
    height: '50%',
    marginTop: 80,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
export default OnboardingScreen; 
