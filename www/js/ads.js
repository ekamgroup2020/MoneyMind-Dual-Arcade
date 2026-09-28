// ============================================
// MoneyMind Dual Arcade - Ad Integration
// Company: Ekam Group
// Real Ads Mode (NO TEST MODE)
// ============================================

// ============================================
// UNITY ADS CONFIGURATION (From Dashboard)
// ============================================
const UNITY_CONFIG = {
  gameId: "800379901",
  organizationCoreId: "13469976020592",
  placements: {
    rewarded: "BP_Rewarded_Android",
    interstitial: "Interstitial_Android",
    banner: "Banner_Android"
  },
  testMode: false // REAL ADS - NO TEST MODE
};

// ============================================
// START.IO CONFIGURATION (From Portal)
// ============================================
const STARTIO_CONFIG = {
  appId: "208449971",
  testMode: false // REAL ADS - NO TEST MODE
};

// ============================================
// AD COOLDOWN SYSTEM (Ban Protection)
// ============================================
let lastAdTime = 0;
const AD_COOLDOWN_TIME = 45000; // 45 seconds between interstitial ads
let isRewardedAdPlaying = false;
let bannerAdVisible = false;

// ============================================
// INITIALIZE ADS ON APP START
// ============================================
async function initializeAds() {
  console.log('🚀 Initializing ad networks...');
  
  // Initialize Unity Ads
  try {
    if (typeof UnityAds !== 'undefined') {
      await UnityAds.initialize(UNITY_CONFIG.gameId, {
        testMode: UNITY_CONFIG.testMode
      });
      console.log('✅ Unity Ads initialized with Game ID:', UNITY_CONFIG.gameId);
    } else {
      console.warn('️ UnityAds SDK not found');
    }
  } catch (error) {
    console.error('❌ Unity Ads initialization error:', error);
  }
  
  // Initialize Start.io
  try {
    if (typeof StartApp !== 'undefined') {
      StartApp.init(STARTIO_CONFIG.appId, {
        testMode: STARTIO_CONFIG.testMode
      });
      console.log('✅ Start.io initialized with App ID:', STARTIO_CONFIG.appId);
    } else {
      console.warn('⚠️ StartApp SDK not found');
    }
  } catch (error) {
    console.error('❌ Start.io initialization error:', error);
  }
}

// ============================================
// SHOW INTERSTITIAL AD (Full Screen)
// ============================================
async function showInterstitialAd() {
  const now = Date.now();
  
  // Check cooldown to prevent ban
  if (now - lastAdTime < AD_COOLDOWN_TIME) {
    const remaining = Math.ceil((AD_COOLDOWN_TIME - (now - lastAdTime)) / 1000);
    console.log(`⏳ Ad cooldown active. Wait ${remaining} seconds`);
    return false;
  }
  
  // Don't show if rewarded ad is playing
  if (isRewardedAdPlaying) {
    console.log('⚠️ Rewarded ad is playing, skipping interstitial');
    return false;
  }
  
  try {
    // Try Unity Ads first
    if (typeof UnityAds !== 'undefined') {
      const placement = await UnityAds.getPlacement(UNITY_CONFIG.placements.interstitial);
      if (placement && placement.isReady()) {
        await UnityAds.show(UNITY_CONFIG.placements.interstitial);
        lastAdTime = Date.now();
        console.log('✅ Unity Interstitial ad shown');
        return true;
      }
    }
    
    // Fallback to Start.io
    if (typeof StartApp !== 'undefined') {
      StartApp.showAd();
      lastAdTime = Date.now();
      console.log('✅ Start.io Interstitial ad shown');
      return true;
    }
    
    console.warn('⚠️ No ad network available');
    return false;
  } catch (error) {
    console.error('❌ Interstitial ad error:', error);
    return false;
  }
}

// ============================================
// SHOW REWARDED AD (User chooses to watch)
// ============================================
async function showRewardedAd(onReward) {
  if (isRewardedAdPlaying) {
    console.log('⚠️ Rewarded ad already playing');
    return false;
  }
  
  isRewardedAdPlaying = true;
  
  try {
    // Try Unity Ads first
    if (typeof UnityAds !== 'undefined') {
      const placement = await UnityAds.getPlacement(UNITY_CONFIG.placements.rewarded);
      if (placement && placement.isReady()) {
        UnityAds.show(UNITY_CONFIG.placements.rewarded, {
          onFinished: (result) => {
            isRewardedAdPlaying = false;
            if (result === 'COMPLETED') {
              console.log('✅ Unity Rewarded ad completed - Reward given');
              if (onReward) onReward();
            } else {
              console.log('⚠️ Unity Rewarded ad not completed');
            }
          },
          onFailed: (error) => {
            isRewardedAdPlaying = false;
            console.error('❌ Unity Rewarded ad failed:', error);
          }
        });
        return true;
      }
    }
    
    // Fallback to Start.io
    if (typeof StartApp !== 'undefined') {
      StartApp.showRewardedVideo({
        onVideoCompleted: () => {
          isRewardedAdPlaying = false;
          console.log('✅ Start.io Rewarded ad completed - Reward given');
          if (onReward) onReward();
        },
        onVideoFailed: (error) => {
          isRewardedAdPlaying = false;
          console.error(' Start.io Rewarded ad failed:', error);
        }
      });
      return true;
    }
    
    isRewardedAdPlaying = false;
    console.warn('⚠️ No rewarded ad network available');
    return false;
  } catch (error) {
    isRewardedAdPlaying = false;
    console.error('❌ Rewarded ad error:', error);
    return false;
  }
}

// ============================================
// SHOW BANNER AD (Always visible at bottom)
// ============================================
function showBannerAd() {
  if (bannerAdVisible) {
    console.log('ℹ️ Banner ad already visible');
    return;
  }
  
  try {
    if (typeof UnityAds !== 'undefined') {
      UnityAds.showBanner(UNITY_CONFIG.placements.banner, {
        position: 'BOTTOM_CENTER'
      });
      bannerAdVisible = true;
      console.log('✅ Unity Banner ad shown');
      return;
    }
    
    if (typeof StartApp !== 'undefined') {
      StartApp.showBanner();
      bannerAdVisible = true;
      console.log('✅ Start.io Banner ad shown');
      return;
    }
    
    console.warn('⚠️ No banner ad network available');
  } catch (error) {
    console.error('❌ Banner ad error:', error);
  }
}

// ============================================
// HIDE BANNER AD
// ============================================
function hideBannerAd() {
  if (!bannerAdVisible) {
    return;
  }
  
  try {
    if (typeof UnityAds !== 'undefined') {
      UnityAds.hideBanner();
    }
    
    if (typeof StartApp !== 'undefined') {
      StartApp.hideBanner();
    }
    
    bannerAdVisible = false;
    console.log('✅ Banner ad hidden');
  } catch (error) {
    console.error('❌ Hide banner error:', error);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Check if ads are ready
function areAdsReady() {
  const unityReady = typeof UnityAds !== 'undefined';
  const startioReady = typeof StartApp !== 'undefined';
  return unityReady || startioReady;
}

// Get ad network status
function getAdNetworkStatus() {
  return {
    unity: typeof UnityAds !== 'undefined',
    startio: typeof StartApp !== 'undefined',
    cooldownActive: (Date.now() - lastAdTime) < AD_COOLDOWN_TIME,
    rewardedPlaying: isRewardedAdPlaying,
    bannerVisible: bannerAdVisible
  };
}

// Force reset cooldown (for debugging only - use carefully)
function resetAdCooldown() {
  lastAdTime = 0;
  console.log('🔄 Ad cooldown reset');
}

// ============================================
// INITIALIZE ON APP LOAD
// ============================================
window.addEventListener('load', () => {
  console.log('📱 App loaded - Initializing ads in 1 second...');
  setTimeout(initializeAds, 1000);
});

// ============================================
// EXPORT FUNCTIONS (for use in other files)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAds,
    showInterstitialAd,
    showRewardedAd,
    showBannerAd,
    hideBannerAd,
    areAdsReady,
    getAdNetworkStatus,
    resetAdCooldown
  };
}
