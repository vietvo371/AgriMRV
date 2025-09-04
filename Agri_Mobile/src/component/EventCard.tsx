import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    image: any;
  };
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <View style={styles.container}>
      <Image source={event.image} style={styles.image} />
      {/* <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0,0,0,0.8)']}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      >
        <View style={styles.contentContainer}>
          <ThemedText 
            type="title"
            style={styles.title}
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            {event.title}
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={styles.description}
            lightColor="rgba(255,255,255,0.9)"
            darkColor="rgba(255,255,255,0.9)"
          >
            {event.description}
          </ThemedText>
        </View>
      </LinearGradient> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 24,
  },
  image: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 24,
  },
  title: {
    textAlign: 'left',
    marginBottom: 8,
    fontSize: 26,
    letterSpacing: 0.5,
  },
  description: {
    textAlign: 'left',
    fontSize: 16,
    letterSpacing: 0.3,
    opacity: 0.95,
    lineHeight: 22,
  },
});
