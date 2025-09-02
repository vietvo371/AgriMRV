// Demo file to test status-based display logic

export interface PlotData {
  id: string;
  plot_name: string;
  location: string;
  status: 'verified' | 'pending' | 'processing';
  mrvData: {
    mrvScores: {
      carbonPerformance: number;
      mrvReliability: number;
      grade: string;
    };
    blockchainAnchor: {
      hash: string;
      timestamp: string;
      reportUrl: string;
    };
  };
}

// Sample data for testing different statuses
export const samplePlots: PlotData[] = [
  {
    id: '1',
    plot_name: 'Rice Field A - Verified',
    location: 'Ho Chi Minh City, Vietnam',
    status: 'verified',
    mrvData: {
      mrvScores: {
        carbonPerformance: 85,
        mrvReliability: 92,
        grade: 'A'
      },
      blockchainAnchor: {
        hash: '0x1234567890abcdef...',
        timestamp: '2024-01-15T10:30:00Z',
        reportUrl: 'https://example.com/mrv-report-1'
      }
    }
  },
  {
    id: '2',
    plot_name: 'Rice Field B - Pending',
    location: 'Can Tho, Vietnam',
    status: 'pending',
    mrvData: {
      mrvScores: {
        carbonPerformance: 0,
        mrvReliability: 0,
        grade: 'N/A'
      },
      blockchainAnchor: {
        hash: '',
        timestamp: '',
        reportUrl: ''
      }
    }
  },
  {
    id: '3',
    plot_name: 'Rice Field C - Processing',
    location: 'Da Nang, Vietnam',
    status: 'processing',
    mrvData: {
      mrvScores: {
        carbonPerformance: 0,
        mrvReliability: 0,
        grade: 'N/A'
      },
      blockchainAnchor: {
        hash: '',
        timestamp: '',
        reportUrl: ''
      }
    }
  }
];

// Function to test status-based rendering logic
export const testStatusLogic = () => {
  console.log('🧪 Testing Status-Based Display Logic\n');
  
  samplePlots.forEach(plot => {
    console.log(`📍 Plot: ${plot.plot_name}`);
    console.log(`   Status: ${plot.status}`);
    
    // Test MRV section visibility
    const showMRV = plot.status === 'verified';
    console.log(`   Show MRV Section: ${showMRV ? '✅ YES' : '❌ NO'}`);
    
    if (showMRV) {
      console.log(`   MRV Data Available:`);
      console.log(`     - Carbon Performance: ${plot.mrvData.mrvScores.carbonPerformance}/100`);
      console.log(`     - MRV Reliability: ${plot.mrvData.mrvScores.mrvReliability}/100`);
      console.log(`     - Grade: ${plot.mrvData.mrvScores.grade}`);
      console.log(`     - Blockchain Hash: ${plot.mrvData.blockchainAnchor.hash || 'N/A'}`);
    } else {
      console.log(`   Status Message: ${plot.status === 'pending' ? 'Pending Verification' : 'Processing'}`);
      if (plot.status === 'pending') {
        console.log(`   Next Steps: Submit evidence, Complete documentation, Wait for AI verification`);
      }
    }
    
    console.log('');
  });
  
  console.log('🎉 Status logic test completed!');
};

// Function to simulate status changes
export const simulateStatusChange = (plotId: string, newStatus: 'verified' | 'pending' | 'processing') => {
  const plot = samplePlots.find(p => p.id === plotId);
  if (plot) {
    const oldStatus = plot.status;
    plot.status = newStatus;
    
    console.log(`🔄 Status Change Simulation:`);
    console.log(`   Plot: ${plot.plot_name}`);
    console.log(`   Old Status: ${oldStatus}`);
    console.log(`   New Status: ${newStatus}`);
    console.log(`   MRV Section: ${newStatus === 'verified' ? 'Will Show' : 'Will Hide'}`);
    
    return plot;
  }
  return null;
};

// Function to get status-specific UI configuration
export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'verified':
      return {
        showMRV: true,
        showVerificationBanner: true,
        showStatusSection: false,
        icon: 'shield-check',
        color: 'success',
        title: 'MRV Verification Complete',
        description: 'This plot has been verified by our AI system and contributes to your carbon credit score.'
      };
    case 'pending':
      return {
        showMRV: false,
        showVerificationBanner: false,
        showStatusSection: true,
        icon: 'clock-outline',
        color: 'warning',
        title: 'Pending Verification',
        description: 'Your plot is waiting for MRV verification. Once verified, you will see detailed carbon impact calculations and blockchain anchoring.',
        showNextSteps: true
      };
    case 'processing':
      return {
        showMRV: false,
        showVerificationBanner: false,
        showStatusSection: true,
        icon: 'cog',
        color: 'warning',
        title: 'Processing',
        description: 'Your plot is currently being processed for MRV verification. Please check back later for updates.',
        showNextSteps: false
      };
    default:
      return {
        showMRV: false,
        showVerificationBanner: false,
        showStatusSection: true,
        icon: 'help-circle',
        color: 'textLight',
        title: 'Unknown Status',
        description: 'The status of this plot is unknown.',
        showNextSteps: false
      };
  }
};

// Example usage in React Native component
export const useStatusDemo = () => {
  const runDemo = () => {
    testStatusLogic();
  };
  
  const changeStatus = (plotId: string, newStatus: 'verified' | 'pending' | 'processing') => {
    return simulateStatusChange(plotId, newStatus);
  };
  
  const getConfig = (status: string) => {
    return getStatusConfig(status);
  };
  
  return { runDemo, changeStatus, getConfig };
};
