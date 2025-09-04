# AgriMRV - Agricultural Monitoring, Reporting & Verification System

## 🚀 Project Overview

AgriMRV là một hệ thống toàn diện cho việc giám sát, báo cáo và xác minh hoạt động nông nghiệp, tập trung vào việc quản lý carbon credits và tính bền vững trong nông nghiệp.

## 📁 Project Structure

```
AgriMRV/
├── Agri_Mobile/          # React Native Mobile Application
├── Agri_Be/             # Laravel Backend API
└── README.md            # This file
```

## 🎯 Key Features

### Mobile App (Agri_Mobile)
- **Farmer Dashboard**: Quản lý hồ sơ nông trại và lô đất
- **MRV Declarations**: Báo cáo hoạt động nông nghiệp
- **AI Analysis**: Phân tích tự động bằng AI
- **Carbon Credits**: Quản lý và giao dịch carbon credits
- **Blockchain Integration**: Tích hợp blockchain để đảm bảo tính minh bạch
- **QR Code System**: Hệ thống QR code cho truy xuất nguồn gốc
- **Cooperative Management**: Quản lý hợp tác xã

### Backend API (Agri_Be)
- **RESTful API**: API đầy đủ cho tất cả chức năng
- **Authentication**: Hệ thống xác thực với Laravel Sanctum
- **Database Management**: Quản lý cơ sở dữ liệu với MySQL
- **File Upload**: Xử lý upload và lưu trữ file
- **AI Integration**: Tích hợp AI cho phân tích dữ liệu
- **Blockchain Services**: Dịch vụ blockchain cho carbon credits

## 🛠️ Technology Stack

### Frontend (Mobile)
- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation management
- **Expo**: Development and deployment tools

### Backend
- **Laravel 10**: PHP framework
- **MySQL**: Database
- **Laravel Sanctum**: API authentication
- **Laravel Storage**: File management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- React Native CLI
- PHP (v8.1+)
- Composer
- MySQL
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
   npx react-native run-android  # for Android
   npx react-native run-ios      # for iOS
   ```

## 📱 Mobile App Features

### Screens
- **Authentication**: Login, Register, OTP Verification
- **Dashboard**: Overview of farm activities
- **Farm Management**: Farm profiles and plot boundaries
- **MRV Declarations**: Agricultural activity reporting
- **AI Analysis**: AI-powered analysis results
- **Carbon Credits**: Credit management and transactions
- **Blockchain**: Blockchain anchor verification
- **Cooperative**: Cooperative membership management
- **Finance**: Financial records and loan management
- **Profile**: User profile management

### Key Components
- **QR Scanner**: Scan QR codes for verification
- **Image Picker**: Upload evidence photos
- **Location Picker**: GPS location selection
- **Date Picker**: Date selection for records
- **File Upload**: Document upload functionality

## 🔧 Backend API Features

### Models
- **User**: User management
- **FarmProfile**: Farm information
- **PlotBoundary**: Land plot management
- **MrvDeclaration**: MRV declarations
- **EvidenceFile**: File evidence management
- **AiAnalysisResult**: AI analysis results
- **CarbonCredit**: Carbon credit management
- **BlockchainAnchor**: Blockchain verification

### API Endpoints
- **Authentication**: Login, register, logout
- **Farm Management**: CRUD operations for farms
- **MRV Declarations**: Create and manage declarations
- **File Upload**: Handle file uploads
- **AI Analysis**: Trigger and retrieve AI analysis
- **Carbon Credits**: Manage carbon credit transactions

## 🎨 UI/UX Features

- **Modern Design**: Clean and intuitive interface
- **Responsive Layout**: Optimized for different screen sizes
- **Dark/Light Theme**: Theme switching capability
- **Custom Components**: Reusable UI components
- **Smooth Animations**: Enhanced user experience

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **File Validation**: Secure file upload validation
- **Data Encryption**: Sensitive data encryption
- **API Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive input validation

## 📊 Data Management

- **Real-time Updates**: Live data synchronization
- **Offline Support**: Offline data storage
- **Data Export**: Export functionality
- **Backup & Recovery**: Data backup systems

## 🌱 Environmental Impact

- **Carbon Tracking**: Monitor carbon footprint
- **Sustainability Metrics**: Track environmental impact
- **Green Practices**: Promote sustainable agriculture
- **Climate Action**: Support climate change mitigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Development**: React Native, TypeScript
- **Backend Development**: Laravel, PHP
- **Database Design**: MySQL
- **UI/UX Design**: Modern mobile interface
- **AI Integration**: Machine learning analysis

## 🏆 Hackathon Goals

- **Innovation**: Cutting-edge agricultural technology
- **Sustainability**: Environmental impact reduction
- **Transparency**: Blockchain-based verification
- **Accessibility**: User-friendly mobile interface
- **Scalability**: Enterprise-ready solution

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for sustainable agriculture and climate action**
