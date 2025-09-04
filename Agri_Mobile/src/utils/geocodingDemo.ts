// Demo file to test geocoding with real coordinates
import { reverseGeocode, formatAddress, getShortAddress } from './geocoding';

// Test coordinates for different locations
const testCoordinates = [
  { name: 'Ho Chi Minh City, Vietnam', lat: 10.8231, lng: 106.6297 },
  { name: 'Hanoi, Vietnam', lat: 21.0285, lng: 105.8542 },
  { name: 'Can Tho, Vietnam', lat: 10.0452, lng: 105.7469 },
  { name: 'Da Nang, Vietnam', lat: 16.0544, lng: 108.2022 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
];

export const testGeocoding = async () => {
  console.log('🧪 Testing Geocoding with real coordinates...\n');
  
  for (const coord of testCoordinates) {
    try {
      console.log(`📍 Testing: ${coord.name} (${coord.lat}, ${coord.lng})`);
      
      const result = await reverseGeocode(coord.lat, coord.lng);
      
      console.log('✅ Results:');
      console.log(`   Full Address: ${formatAddress(result)}`);
      console.log(`   Short Address: ${getShortAddress(result)}`);
      console.log(`   Street: ${result.address || 'N/A'}`);
      console.log(`   City: ${result.city || 'N/A'}`);
      console.log(`   State: ${result.state || 'N/A'}`);
      console.log(`   Country: ${result.country || 'N/A'}`);
      console.log('');
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error testing ${coord.name}:`, error);
    }
  }
  
  console.log('🎉 Geocoding test completed!');
};

// Function to test with custom coordinates
export const testCustomCoordinates = async (lat: number, lng: number) => {
  console.log(`🧪 Testing custom coordinates: ${lat}, ${lng}`);
  
  try {
    const result = await reverseGeocode(lat, lng);
    
    console.log('✅ Results:');
    console.log(`   Full Address: ${formatAddress(result)}`);
    console.log(`   Short Address: ${getShortAddress(result)}`);
    console.log(`   Street: ${result.address || 'N/A'}`);
    console.log(`   City: ${result.city || 'N/A'}`);
    console.log(`   State: ${result.state || 'N/A'}`);
    console.log(`   Country: ${result.country || 'N/A'}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
};

// Example usage in React Native component
export const useGeocodingDemo = () => {
  const runDemo = async () => {
    await testGeocoding();
  };
  
  const testLocation = async (lat: number, lng: number) => {
    return await testCustomCoordinates(lat, lng);
  };
  
  return { runDemo, testLocation };
};
