# AgriMR Database Schema Documentation

## Overview
This document describes the complete database schema for the AgriMR (Agricultural Monitoring and Reporting) system, which manages carbon credits for sustainable farming practices.

## Database Tables

### 1. Users Table
Stores all user information with different types: farmers, banks, cooperatives, verifiers, government, and buyers.

**Key Fields:**
- `user_type`: farmer, bank, cooperative, verifier, government, buyer
- `gps_latitude/gps_longitude`: Location coordinates
- `organization_name/type`: For institutional users

### 2. Farm Profiles Table
Contains detailed information about farming operations and land use.

**Key Fields:**
- `total_area_hectares`: Total farm area
- `rice_area_hectares`: Area dedicated to rice cultivation
- `agroforestry_area_hectares`: Area for agroforestry practices
- `farming_experience_years`: Farmer's experience level

### 3. Plot Boundaries Table
Defines specific plot areas within farms with GPS coordinates.

**Key Fields:**
- `boundary_coordinates`: JSON array of GPS coordinates
- `plot_type`: rice, agroforestry, mixed
- `area_hectares`: Individual plot area

### 4. MRV Declarations Table
Core table for Monitoring, Reporting, and Verification declarations.

**Key Fields:**
- Rice farming data (sowing/harvest dates, AWD cycles, water management)
- Agroforestry data (tree density, species, planting dates)
- Performance scores and estimated carbon credits
- Status tracking (draft, submitted, verified, rejected)

### 5. Evidence Files Table
Stores supporting documentation and evidence for MRV declarations.

**Key Fields:**
- `file_type`: satellite_image, field_photo, document, etc.
- `gps_latitude/longitude`: Location where evidence was captured
- `capture_timestamp`: When evidence was collected

### 6. AI Analysis Results Table
Contains AI-powered analysis of evidence files.

**Key Fields:**
- `confidence_score`: AI confidence in analysis
- `crop_health_score`: Health assessment of crops
- `authenticity_score`: Verification of evidence authenticity
- `recommendations`: AI-generated farming recommendations

### 7. Verification Records Table
Tracks verification processes and results.

**Key Fields:**
- `verification_type`: remote, field, hybrid
- `verification_status`: pending, approved, rejected, requires_revision
- `verification_score`: Quality score of verification process

### 8. Carbon Credits Table
Manages issued carbon credits.

**Key Fields:**
- `credit_amount`: Number of carbon credits
- `serial_number`: Unique identifier
- `status`: issued, sold, retired, cancelled
- `vintage_year`: Year credits were generated

### 9. Carbon Transactions Table
Records carbon credit trading activities.

**Key Fields:**
- `seller_id/buyer_id`: Transaction parties
- `quantity`: Number of credits traded
- `price_per_credit`: Price per credit
- `transaction_hash`: Blockchain transaction reference

### 10. Cooperative Memberships Table
Manages farmer-cooperative relationships.

**Key Fields:**
- `membership_status`: active, inactive, suspended
- `membership_fee_paid`: Payment status

### 11. Training Records Table
Tracks farmer training and certification.

**Key Fields:**
- `training_type`: sustainable_farming, carbon_accounting, etc.
- `completion_status`: completed, in_progress, failed
- `score`: Training assessment score

### 12. Financial Records Table
Manages financial transactions and records.

**Key Fields:**
- `record_type`: loan, payment, carbon_revenue
- `amount`: Transaction amount
- `currency`: Transaction currency

### 13. Blockchain Anchors Table
Links database records to blockchain for transparency.

**Key Fields:**
- `record_type`: Type of record anchored
- `transaction_hash`: Blockchain transaction hash
- `anchor_data`: JSON data stored on blockchain

## Installation and Usage

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Seed Database (Optional)
```bash
php artisan db:seed
```

### 3. Sample Data
The seeder creates sample data including:
- Different user types (farmer, bank, verifier, cooperative)
- Sample farm profile with rice and agroforestry areas
- MRV declaration with evidence files
- AI analysis results
- Verification records
- Carbon credits and transactions

## Key Relationships

### User Relationships
- **Farmers**: Have farm profiles, MRV declarations, training records
- **Banks**: Process financial records, buy carbon credits
- **Verifiers**: Conduct verification processes
- **Cooperatives**: Manage farmer memberships

### Data Flow
1. **Farmer** creates **Farm Profile** with **Plot Boundaries**
2. **Farmer** submits **MRV Declaration** with **Evidence Files**
3. **AI Analysis** processes evidence files
4. **Verifier** reviews and verifies declarations
5. **Carbon Credits** are issued based on verified declarations
6. **Carbon Transactions** occur between buyers and sellers
7. **Blockchain Anchors** provide transparency and immutability

## API Endpoints (Suggested)

### User Management
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user

### Farm Management
- `POST /api/farm-profiles` - Create farm profile
- `GET /api/farm-profiles/{id}` - Get farm details
- `POST /api/plot-boundaries` - Add plot boundaries

### MRV Process
- `POST /api/mrv-declarations` - Submit declaration
- `POST /api/evidence-files` - Upload evidence
- `GET /api/mrv-declarations/{id}/ai-analysis` - Get AI analysis

### Verification
- `POST /api/verification-records` - Create verification record
- `PUT /api/verification-records/{id}` - Update verification status

### Carbon Credits
- `GET /api/carbon-credits` - List available credits
- `POST /api/carbon-transactions` - Execute transaction
- `GET /api/carbon-transactions` - Transaction history

## Security Considerations

1. **User Authentication**: Implement proper authentication for all endpoints
2. **Role-Based Access**: Control access based on user types
3. **Data Validation**: Validate all input data, especially GPS coordinates
4. **File Upload Security**: Secure file uploads with proper validation
5. **Blockchain Integration**: Ensure secure blockchain interactions

## Performance Optimization

1. **Indexing**: Add indexes on frequently queried fields
2. **JSON Fields**: Use appropriate JSON operators for PostgreSQL
3. **Caching**: Implement caching for frequently accessed data
4. **Pagination**: Use pagination for large datasets

## Monitoring and Maintenance

1. **Database Backups**: Regular automated backups
2. **Performance Monitoring**: Monitor query performance
3. **Data Integrity**: Regular integrity checks
4. **Blockchain Sync**: Monitor blockchain synchronization status

## Future Enhancements

1. **Real-time GPS Tracking**: Live location updates
2. **Satellite Integration**: Direct satellite data feeds
3. **Machine Learning**: Enhanced AI analysis capabilities
4. **Mobile App**: Native mobile applications
5. **IoT Integration**: Sensor data integration

## Support

For technical support or questions about the database schema, please refer to the development team or create an issue in the project repository.
