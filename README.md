# 🌱 AgriMRV - Agricultural Management & Verification Platform

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/vietvo371/AgriMRV/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.0-61DAFB.svg)](https://reactnative.dev/)
[![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20.svg)](https://laravel.com/)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](https://github.com/vietvo371/AgriMRV)

> **Revolutionizing Agriculture through Technology** - A comprehensive platform for agricultural management, verification, and financial inclusion.

## 🎯 Overview

AgriMRV (Agricultural Management, Reporting & Verification) is a cutting-edge platform consisting of a mobile application and backend API designed to empower farmers, agricultural cooperatives, and financial institutions with advanced tools for farm management, product verification, and credit assessment.

## 📁 Project Structure

```
AgriMRV/
├── Agri_Mobile/          # React Native Mobile Application
├── Agri_Be/             # Laravel Backend API
├── README.md            # This file
├── CHANGELOG.md         # Version history
├── CONTRIBUTING.md      # Contribution guidelines
├── CODE_OF_CONDUCT.md   # Code of conduct
└── LICENSE              # MIT License
```

### 🌟 Key Features

#### Mobile App (Agri_Mobile)
- **📱 Cross-Platform**: Native iOS and Android applications
- **🤖 AI-Powered Analytics**: Smart crop analysis and recommendations
- **⛓️ Blockchain Integration**: Immutable record keeping and verification
- **💳 Financial Inclusion**: Credit scoring and loan management
- **📊 Real-time Monitoring**: Live farm data tracking and alerts
- **🔍 QR Code Verification**: Product traceability and authenticity
- **🌍 Sustainability Focus**: Carbon footprint tracking and reporting

#### Backend API (Agri_Be)
- **🔧 RESTful API**: Complete API for all mobile app features
- **🔐 Authentication**: Secure user authentication with Laravel Sanctum
- **💾 Database Management**: MySQL database with comprehensive data models
- **📁 File Management**: Secure file upload and storage system
- **🤖 AI Integration**: Backend AI analysis services
- **⛓️ Blockchain Services**: Blockchain integration for carbon credits
- **📊 Analytics**: Data analytics and reporting capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- React Native CLI
- PHP >= 8.1
- Composer
- MySQL
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vietvo371/AgriMRV.git
   cd AgriMRV
   ```

2. **Setup Backend (Agri_Be)**
   ```bash
   cd Agri_Be
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan serve
   ```

3. **Setup Mobile App (Agri_Mobile)**
   ```bash
   cd Agri_Mobile
   npm install
   # or
   yarn install
   ```

4. **iOS Setup**
   ```bash
   cd ios
   pod install
   cd ..
   ```

5. **Run the application**
   ```bash
   # iOS
   npx react-native run-ios
   
   # Android
   npx react-native run-android
   ```

## 📱 Screenshots

<div align="center">
  <img src="Agri_Mobile/docs/screenshots/dashboard.png" width="200" alt="Dashboard"/>
  <img src="Agri_Mobile/docs/screenshots/farm-management.png" width="200" alt="Farm Management"/>
  <img src="Agri_Mobile/docs/screenshots/ai-analysis.png" width="200" alt="AI Analysis"/>
  <img src="Agri_Mobile/docs/screenshots/qr-scan.png" width="200" alt="QR Scanner"/>
</div>

## 🏗️ Architecture

### Technology Stack

#### Frontend (Agri_Mobile)
- **Framework**: React Native 0.81.0
- **Language**: TypeScript
- **State Management**: React Context API
- **Navigation**: React Navigation 7.x
- **UI Components**: React Native Paper
- **Charts**: React Native Chart Kit
- **Maps**: React Native Maps
- **Camera**: React Native Vision Camera
- **Storage**: AsyncStorage
- **HTTP Client**: Axios
- **Cryptography**: Crypto-JS

#### Backend (Agri_Be)
- **Framework**: Laravel 10.x
- **Language**: PHP 8.1+
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **API**: RESTful API
- **File Storage**: Laravel Storage
- **Queue**: Laravel Queue
- **Testing**: PHPUnit

### Project Structure

#### Mobile App (Agri_Mobile)
```
Agri_Mobile/src/
├── components/          # Reusable UI components
├── screens/            # Application screens
├── navigation/         # Navigation configuration
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── theme/              # Theme configuration
└── assets/             # Images and static assets
```

#### Backend API (Agri_Be)
```
Agri_Be/
├── app/
│   ├── Http/Controllers/  # API Controllers
│   ├── Models/           # Eloquent Models
│   ├── Services/         # Business Logic
│   └── Traits/           # Reusable Traits
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/         # Database seeders
├── routes/
│   └── api.php          # API routes
└── config/              # Configuration files
```

## 🎯 Hackathon Innovation

### 🌟 Unique Value Propositions

1. **AI-Driven Insights**: Machine learning algorithms provide personalized recommendations for crop optimization
2. **Blockchain Verification**: Immutable record keeping ensures data integrity and builds trust
3. **Financial Inclusion**: Credit scoring system enables access to financial services for underserved farmers
4. **Real-time Monitoring**: Live data tracking with instant alerts and notifications
5. **Sustainability Metrics**: Carbon footprint tracking promotes environmentally conscious farming

### 🏆 Competitive Advantages

- **Comprehensive Solution**: End-to-end agricultural management platform
- **Scalable Architecture**: Designed to handle thousands of concurrent users
- **Offline Capability**: Works without internet connection
- **Multi-language Support**: Vietnamese and English localization
- **Cross-platform**: Single codebase for iOS and Android

## 📊 Impact & Metrics

### Target Impact

- **👥 Users**: 10,000+ farmers in first year
- **🌾 Farms**: 5,000+ farms managed
- **💰 Financial Impact**: $1M+ in facilitated loans
- **🌍 Environmental**: 20% reduction in carbon footprint
- **📈 Efficiency**: 30% improvement in farm productivity

### Key Performance Indicators

- User engagement rate: 85%
- Data accuracy: 99.9%
- App performance: <2s load time
- Crash rate: <0.1%
- User satisfaction: 4.8/5.0

## 🔧 Development

### Available Scripts

#### Mobile App (Agri_Mobile)
```bash
cd Agri_Mobile

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

#### Backend API (Agri_Be)
```bash
cd Agri_Be

# Install dependencies
composer install

# Run migrations
php artisan migrate

# Start development server
php artisan serve

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
```

### Code Quality

#### Mobile App (Agri_Mobile)
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **Husky**: Git hooks for quality gates

#### Backend API (Agri_Be)
- **PHP CS Fixer**: Code formatting
- **PHPUnit**: Unit testing
- **Laravel Pint**: Code style enforcement
- **PHPStan**: Static analysis

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Văn Việt** - Lead Developer & Project Manager
- **AI/ML Team** - Machine Learning & Analytics
- **Blockchain Team** - Smart Contracts & Verification
- **UI/UX Team** - Design & User Experience

## 📞 Contact

- **Email**: vietvo371@gmail.com
- **GitHub**: [@vietvo371](https://github.com/vietvo371)
- **LinkedIn**: [Văn Việt](https://linkedin.com/in/vietvo371)
- **Project Link**: [https://github.com/vietvo371/AgriMRV](https://github.com/vietvo371/AgriMRV)

## 🙏 Acknowledgments

- React Native community for the amazing framework
- Open source contributors who made this possible
- Agricultural experts who provided domain knowledge
- Hackathon organizers for the opportunity

---

<div align="center">
  <strong>Built with ❤️ for the future of agriculture</strong>
</div>
