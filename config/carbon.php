<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Carbon Credit Configuration
    |--------------------------------------------------------------------------
    |
    | Cấu hình cho carbon credit system
    |
    */

    // Giá fallback khi API không hoạt động
    'price_fallback' => env('CARBON_PRICE_FALLBACK', 52.5),

    // API endpoints
    'api' => [
        'primary' => env('CARBON_PRICE_API_PRIMARY', 'https://api.carboncreditprice.com/v1'),
        'secondary' => env('CARBON_PRICE_API_SECONDARY', 'https://carbonpriceapi.com'),
        'timeout' => env('CARBON_PRICE_API_TIMEOUT', 10),
    ],

    // Cache settings
    'cache' => [
        'current_price_ttl' => env('CARBON_PRICE_CACHE_TTL', 3600), // 1 hour
        'historical_price_ttl' => env('CARBON_HISTORICAL_CACHE_TTL', 86400), // 24 hours
    ],

    // Market thresholds
    'market' => [
        'high_demand_threshold' => env('CARBON_HIGH_DEMAND_THRESHOLD', 1000),
        'low_demand_threshold' => env('CARBON_LOW_DEMAND_THRESHOLD', 100),
        'price_volatility_threshold' => env('CARBON_PRICE_VOLATILITY_THRESHOLD', 0.1), // 10%
    ],

    // Default values
    'defaults' => [
        'trend' => 'stable',
        'volume' => 0,
        'change_24h' => 0,
        'market_cap' => 0,
    ],
];
