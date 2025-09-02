# Geocoding Utility

Utility functions để thực hiện reverse geocoding (chuyển đổi tọa độ lat/lng thành địa chỉ).

## Tính năng

- **Reverse Geocoding**: Chuyển đổi tọa độ lat/lng thành địa chỉ chi tiết
- **Hỗ trợ nhiều API**: OpenStreetMap Nominatim (miễn phí) và Google Maps API
- **Format địa chỉ**: Các hàm tiện ích để format địa chỉ theo nhiều cách khác nhau
- **Error handling**: Xử lý lỗi và fallback khi API không khả dụng

## Cách sử dụng

### 1. Import functions

```typescript
import { 
  reverseGeocode, 
  formatAddress, 
  getShortAddress,
  GeocodingResult 
} from '../utils/geocoding';
```

### 2. Sử dụng reverse geocoding

```typescript
// Sử dụng OpenStreetMap Nominatim (miễn phí)
const result = await reverseGeocode(10.8231, 106.6297);

console.log(result);
// Output:
// {
//   address: "123 Main St",
//   city: "Ho Chi Minh City", 
//   state: "Ho Chi Minh",
//   country: "Vietnam",
//   formattedAddress: "123 Main St, Ho Chi Minh City, Vietnam"
// }
```

### 3. Format địa chỉ

```typescript
// Format địa chỉ đầy đủ
const fullAddress = formatAddress(result);
// "123 Main St, Ho Chi Minh City, Ho Chi Minh, Vietnam"

// Format địa chỉ ngắn gọn
const shortAddress = getShortAddress(result);
// "Ho Chi Minh City, Ho Chi Minh, Vietnam"
```

### 4. Sử dụng trong React Native component

```typescript
import React, { useState, useEffect } from 'react';
import { reverseGeocode, formatAddress } from '../utils/geocoding';

const MyComponent = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      setLoading(true);
      try {
        const result = await reverseGeocode(10.8231, 106.6297);
        setAddress(formatAddress(result));
      } catch (error) {
        console.error('Geocoding failed:', error);
        setAddress('Unknown Location');
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  return (
    <Text>{loading ? 'Loading...' : address}</Text>
  );
};
```

## API Reference

### `reverseGeocode(lat: number, lng: number): Promise<GeocodingResult>`

Thực hiện reverse geocoding sử dụng OpenStreetMap Nominatim API.

**Parameters:**
- `lat`: Vĩ độ (latitude)
- `lng`: Kinh độ (longitude)

**Returns:** Promise<GeocodingResult>

**GeocodingResult interface:**
```typescript
interface GeocodingResult {
  address: string;        // Địa chỉ đường
  city: string;          // Thành phố
  state: string;         // Tỉnh/thành phố
  country: string;       // Quốc gia
  formattedAddress: string; // Địa chỉ đầy đủ từ API
}
```

### `formatAddress(geocodingResult: GeocodingResult): string`

Format các thành phần địa chỉ thành chuỗi địa chỉ đầy đủ.

### `getShortAddress(geocodingResult: GeocodingResult): string`

Format địa chỉ ngắn gọn (chỉ city, state, country).

### `reverseGeocodeGoogle(lat: number, lng: number, apiKey: string): Promise<GeocodingResult>`

Thực hiện reverse geocoding sử dụng Google Maps API (cần API key).

## Demo và Testing

Sử dụng file `geocodingDemo.ts` để test với tọa độ thực:

```typescript
import { testGeocoding, testCustomCoordinates } from '../utils/geocodingDemo';

// Test với các tọa độ mẫu
await testGeocoding();

// Test với tọa độ tùy chỉnh
const result = await testCustomCoordinates(10.8231, 106.6297);
```

## Lưu ý

1. **Rate Limiting**: OpenStreetMap Nominatim có giới hạn 1 request/giây. Sử dụng delay giữa các request.

2. **Error Handling**: Luôn có fallback khi API không khả dụng.

3. **Caching**: Nên cache kết quả geocoding để tránh gọi API nhiều lần cho cùng tọa độ.

4. **Google Maps API**: Cần API key và có thể phát sinh chi phí.

## Ví dụ thực tế

Trong `RecordDetailScreen.tsx`, geocoding được sử dụng để:

1. Hiển thị địa chỉ ngắn gọn trong header
2. Hiển thị địa chỉ đầy đủ trong section Plot Location
3. Hiển thị chi tiết từng thành phần địa chỉ (street, city, state, country)

```typescript
// Trong component
const [geocodingResult, setGeocodingResult] = useState<GeocodingResult | null>(null);

useEffect(() => {
  if (plot?.mrvData?.plotBoundaries?.coordinates?.[0]) {
    const coordinates = plot.mrvData.plotBoundaries.coordinates[0];
    reverseGeocode(coordinates.lat, coordinates.lng)
      .then(setGeocodingResult)
      .catch(console.error);
  }
}, [plot?.mrvData?.plotBoundaries?.coordinates]);

// Trong render
<Text>{geocodingResult ? getShortAddress(geocodingResult) : plot.location}</Text>
```
