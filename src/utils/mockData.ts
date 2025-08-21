// Sample mock data aligned with the provided database schema

export const mockUsers = [
  {
    user_id: 1,
    role: 'farmer',
    name: 'Nguyen Van A',
    dob: '1990-05-12',
    phone: '0777777777',
    email: 'nguyenvana@example.com',
    gps_location: '10.762622, 106.660172',
    org_name: 'Field A, North Section',
    employee_id: 'EMP-001',
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const mockFarmProfiles = [
  {
    profile_id: 101,
    user_id: 1,
    crop_type: 'Rice',
    area_ha: 2.5,
    sowing_date: '2024-02-10',
    expected_yield: 2500,
    created_at: '2024-02-10T10:00:00Z',
  },
  {
    profile_id: 102,
    user_id: 1,
    crop_type: 'Wheat',
    area_ha: 1.8,
    sowing_date: '2024-01-05',
    expected_yield: 1800,
    created_at: '2024-01-05T10:00:00Z',
  },
];

export const mockYieldHistory = [
  {
    history_id: 1001,
    profile_id: 101,
    season: '2024-S1',
    quantity: 2500,
    avg_price: 5.2,
    delivery_date: '2024-07-20',
  },
  {
    history_id: 1002,
    profile_id: 102,
    season: '2024-S1',
    quantity: 1800,
    avg_price: 6.1,
    delivery_date: '2024-05-15',
  },
];

export const mockAnchors = [
  {
    anchor_id: 5001,
    profile_id: 101,
    profile_hash: 'hash_rice_101',
    tx_hash: '0xabc',
    chain: 'Polygon',
    verified: true,
    anchored_at: '2024-07-21T08:00:00Z',
  },
  {
    anchor_id: 5002,
    profile_id: 102,
    profile_hash: 'hash_wheat_102',
    tx_hash: '0xdef',
    chain: 'Polygon',
    verified: false,
    anchored_at: '2024-05-16T08:00:00Z',
  },
];

export const mockImages = [
  {
    image_id: 9001,
    profile_id: 101,
    image_url: 'https://images2.thanhnien.vn/528068263637045248/2023/8/4/ban-sao-cua-dji0901-1691132710706875636958.jpg',
    upload_date: '2024-07-18T10:00:00Z',
    image_meta: '{}',
  },
  {
    image_id: 9002,
    profile_id: 102,
    image_url: 'https://images2.thanhnien.vn/528068263637045248/2023/8/4/ban-sao-cua-dji0901-1691132710706875636958.jpg',
    upload_date: '2024-05-12T10:00:00Z',
    image_meta: '{}',
  },
];

export const mockAiResults = [
  {
    ai_result_id: 7001,
    profile_id: 101,
    image_score: 88,
    yield_risk: 22,
    credit_score: 76,
    breakdown_json: '{}',
    processed_at: '2024-07-19T12:00:00Z',
  },
  {
    ai_result_id: 7002,
    profile_id: 102,
    image_score: 80,
    yield_risk: 35,
    credit_score: 70,
    breakdown_json: '{}',
    processed_at: '2024-05-13T12:00:00Z',
  },
];

export const mockCreditScore = [
  {
    score_id: 8001,
    profile_id: 101,
    credit_score: 76,
    score_rank: 'B',
    max_loan: 500,
    eligible: true,
    calculated_at: '2024-07-21T09:00:00Z',
  },
  {
    score_id: 8002,
    profile_id: 102,
    credit_score: 70,
    score_rank: 'C',
    max_loan: 400,
    eligible: true,
    calculated_at: '2024-05-16T09:00:00Z',
  },
];

// Helpers to derive API view models
export const deriveRecentBatches = () => {
  return mockFarmProfiles.map((profile) => {
    const latestYield = mockYieldHistory
      .filter((y) => y.profile_id === profile.profile_id)
      .sort((a, b) => new Date(b.delivery_date).getTime() - new Date(a.delivery_date).getTime())[0];
    const anchor = mockAnchors.find((a) => a.profile_id === profile.profile_id);
    const image = mockImages.find((img) => img.profile_id === profile.profile_id);
    return {
      id: String(profile.profile_id),
      product_name: profile.crop_type,
      category: 'Field ' + (mockUsers.find(u => u.user_id === profile.user_id)?.org_name || ''),
      weight: latestYield?.quantity || profile.expected_yield,
      harvest_date: latestYield?.delivery_date || profile.sowing_date,
      cultivation_method: 'Conventional',
      status: anchor?.verified ? 'completed' : 'submitted',
      image: image?.image_url || '',
    };
  });
};

export const deriveDashboardStats = () => {
  const total = mockFarmProfiles.length;
  const verified = mockAnchors.filter((a) => a.verified).length;
  const products = new Set(mockFarmProfiles.map((f) => f.crop_type)).size;
  return {
    batches: { total, trend: { value: 5, isPositive: true } },
    qr_scans: { total: verified * 3, trend: { value: 2, isPositive: true } },
    products: { total: products, trend: { value: 1, isPositive: true } },
  };
};

// Detailed record view model used by RecordDetailScreen
export const deriveRecordDetail = (profileId: string) => {
  const idNum = Number(profileId);
  const profile = mockFarmProfiles.find((p) => p.profile_id === idNum);
  if (!profile) return null;
  const user = mockUsers.find((u) => u.user_id === profile.user_id)!;
  const latestYield = mockYieldHistory
    .filter((y) => y.profile_id === profile.profile_id)
    .sort((a, b) => new Date(b.delivery_date).getTime() - new Date(a.delivery_date).getTime())[0];
  const anchor = mockAnchors.find((a) => a.profile_id === profile.profile_id);
  const image = mockImages.find((img) => img.profile_id === profile.profile_id);

  const [latStr, lngStr] = (user.gps_location || '10.762622,106.660172').split(',');

  return {
    id: String(profile.profile_id),
    product_name: profile.crop_type,
    category: user.org_name,
    weight: latestYield?.quantity || profile.expected_yield,
    area_ha: profile.area_ha,
    expected_yield: profile.expected_yield,
    season: latestYield?.season || '',
    avg_price: latestYield?.avg_price || 0,
    variety: 'N/A',
    planting_date: profile.sowing_date,
    harvest_date: latestYield?.delivery_date || profile.sowing_date,
    cultivation_method: 'Conventional',
    status: anchor?.verified ? 'completed' : 'submitted',
    location: {
      latitude: parseFloat(latStr),
      longitude: parseFloat(lngStr),
      address: user.org_name,
    },
    images: {
      farm: image?.image_url || null,
      product: image?.image_url || null,
      farmer: null,
    },
    traceability: {
      batch_code: `PRF-${profile.profile_id}`,
      packaging_date: latestYield?.delivery_date || profile.sowing_date,
      best_before: latestYield ? latestYield.delivery_date : profile.sowing_date,
    },
    stats: {
      total_scans: 12,
      unique_customers: 8,
      average_rating: 4.5,
    },
    farmer: {
      name: user.name,
      phone: user.phone,
      email: user.email,
    },
    certification: {
      number: 'VietGAP-123456',
      validUntil: '2025-12-31',
    },
    sustainability: {
      water_usage: 'Low',
      carbon_footprint: 'Medium',
      pesticide_usage: 'Low',
    },
    reviews: [
      {
        id: '1',
        reviewer: { name: 'Customer A' },
        rating: 5,
        comment: 'Great quality!',
        date: '2024-07-25',
      },
    ],
  };
};


