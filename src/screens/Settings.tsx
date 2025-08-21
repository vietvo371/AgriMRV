import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { responsive } from '../theme/responsive';
import { useAuth } from '../contexts/AuthContext';

const SettingsScreen = () => {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: responsive.wp('6%'),
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: responsive.hp('4%'),
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: responsive.wp('6%'),
    paddingVertical: responsive.hp('1.5%'),
    borderRadius: responsive.wp('2%'),
  },
  buttonText: {
    color: COLORS.white,
    fontSize: responsive.wp('4%'),
    fontWeight: '600',
  },
});

export default SettingsScreen; 