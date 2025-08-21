import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { theme } from '../theme/colors';
import Header from '../component/Header';
import ButtonCustom from '../component/ButtonCustom';
import Card from '../component/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface ImageUploadScreenProps {
  navigation: any;
  route: {
    params: {
      seasonId: string;
    };
  };
}

interface FieldImage {
  id: string;
  uri: string;
  type: string;
  status: 'uploading' | 'uploaded' | 'error';
}

const ImageUploadScreen: React.FC<ImageUploadScreenProps> = ({
  navigation,
  route,
}) => {
  const { seasonId } = route.params;
  const [images, setImages] = useState<FieldImage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
      });

      if (result.assets && result.assets[0]) {
        const newImage: FieldImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri || '',
          type: result.assets[0].type || 'image/jpeg',
          status: 'uploading',
        };
        setImages((prev) => [...prev, newImage]);
        await uploadImage(newImage);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.assets && result.assets[0]) {
        const newImage: FieldImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri || '',
          type: result.assets[0].type || 'image/jpeg',
          status: 'uploading',
        };
        setImages((prev) => [...prev, newImage]);
        await uploadImage(newImage);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const uploadImage = async (image: FieldImage) => {
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, status: 'uploaded' } : img
        )
      );
    } catch (error) {
      console.error('Upload error:', error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, status: 'error' } : img
        )
      );
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    }
  };

  const handleDeleteImage = (imageId: string) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setImages((prev) => prev.filter((img) => img.id !== imageId));
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    if (images.length === 0) {
      Alert.alert('Error', 'Please upload at least one photo to continue.');
      return;
    }

    if (images.some((img) => img.status === 'uploading')) {
      Alert.alert('Error', 'Please wait for all photos to finish uploading.');
      return;
    }

    navigation.navigate('CreditDashboard', { seasonId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Upload Field Photos"
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>Photo Guidelines</Text>
            <View style={styles.instructionItem}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <Text style={styles.instructionText}>
                Take clear, well-lit photos of your field
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <Text style={styles.instructionText}>
                Include the entire field in the frame
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <Text style={styles.instructionText}>
                Take photos from different angles
              </Text>
            </View>
          </Card>

          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>Upload Photos</Text>
            <View style={styles.uploadButtons}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleTakePhoto}>
                <Icon name="camera" size={32} color={theme.colors.primary} />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleChoosePhoto}>
                <Icon name="image" size={32} color={theme.colors.primary} />
                <Text style={styles.uploadButtonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {images.length > 0 && (
            <View style={styles.imagesSection}>
              <Text style={styles.sectionTitle}>Uploaded Photos</Text>
              <View style={styles.imageGrid}>
                {images.map((image) => (
                  <View key={image.id} style={styles.imageContainer}>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <View
                      style={[
                        styles.imageStatus,
                        {
                          backgroundColor:
                            image.status === 'uploaded'
                              ? theme.colors.success
                              : image.status === 'error'
                              ? theme.colors.error
                              : theme.colors.primary,
                        },
                      ]}>
                      <Icon
                        name={
                          image.status === 'uploaded'
                            ? 'check'
                            : image.status === 'error'
                            ? 'alert'
                            : 'upload'
                        }
                        size={16}
                        color={theme.colors.white}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteImage(image.id)}>
                      <Icon name="delete" size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          <ButtonCustom
            title="Continue to Analysis"
            onPress={handleContinue}
            style={styles.continueButton}
            disabled={images.length === 0 || images.some((img) => img.status === 'uploading')}
          />
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
  instructionCard: {
    marginBottom: theme.spacing.xl,
  },
  instructionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  instructionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  uploadSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadButton: {
    flex: 1,
    height: 120,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  uploadButtonText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  imagesSection: {
    marginBottom: theme.spacing.xl,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.sm,
  },
  imageContainer: {
    width: '50%',
    padding: theme.spacing.sm,
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.md,
  },
  imageStatus: {
    position: 'absolute',
    top: theme.spacing.sm + theme.spacing.xs,
    right: theme.spacing.sm + theme.spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  deleteButton: {
    position: 'absolute',
    bottom: theme.spacing.sm + theme.spacing.xs,
    right: theme.spacing.sm + theme.spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  continueButton: {
    marginTop: theme.spacing.md,
  },
});

export default ImageUploadScreen;
