import React, { useState, useEffect } from 'react';
import { Trophy, Star, Target, TrendingUp, Award, Medal, Crown, Zap, MapPin, Shield, Navigation } from 'lucide-react';

interface RewardData {
  points: number;
  level: string;
  badges: Badge[];
  monthlyRank: number;
  totalReports: number;
  earlyDetections: number;
  streak: number;
  qualityScore: number;
  verifiedReports: number;
  rejectedReports: number;
  pendingVerification: number;
  // Geo-verification specific fields
  geoVerificationPoints: number;
  totalGeoVerifications: number;
  perfectGeoVerifications: number;
  geoStreak: number;
  villagesCovered: number;
  locationAccuracy: number;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
  verificationRequired?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  reports: number;
  badge: string;
}

interface RewardsSystemProps {
  employeeName: string;
  onPointsEarned?: (points: number) => void;
}

export default function RewardsSystem({ employeeName, onPointsEarned }: RewardsSystemProps) {
  const [rewardData, setRewardData] = useState<RewardData>({
    points: 0,
    level: 'Beginner',
    badges: [],
    monthlyRank: 0,
    totalReports: 0,
    earlyDetections: 0,
    streak: 0,
    qualityScore: 0,
    verifiedReports: 0,
    rejectedReports: 0,
    pendingVerification: 0,
    // Geo-verification specific fields
    geoVerificationPoints: 0,
    totalGeoVerifications: 0,
    perfectGeoVerifications: 0,
    geoStreak: 0,
    villagesCovered: 0,
    locationAccuracy: 0
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Rajesh Kumar', points: 2450, reports: 89, badge: '🏆' },
    { rank: 2, name: 'Priya Sharma', points: 2180, reports: 76, badge: '🥈' },
    { rank: 3, name: 'Amit Patel', points: 1920, reports: 68, badge: '🥉' },
    { rank: 4, name: 'Sunita Devi', points: 1650, reports: 54, badge: '⭐' },
    { rank: 5, name: 'Mohammed Ali', points: 1420, reports: 48, badge: '🌟' }
  ]);

  const [showAnimation, setShowAnimation] = useState(false);

  // Initialize badges
  const allBadges: Badge[] = [
    { id: 'first_report', name: 'First Report', icon: '🎯', description: 'Submitted your first field report', earned: false, verificationRequired: true },
    { id: 'early_bird', name: 'Early Bird', icon: '🌅', description: 'Detected disease before outbreak', earned: false, verificationRequired: true },
    { id: 'week_streak', name: 'Week Warrior', icon: '🔥', description: '7-day reporting streak', earned: false, verificationRequired: true },
    { id: 'month_hero', name: 'Month Hero', icon: '🦸', description: '30-day reporting streak', earned: false, verificationRequired: true },
    { id: 'quality_inspector', name: 'Quality Inspector', icon: '🔍', description: '50 high-quality reports', earned: false, verificationRequired: true },
    { id: 'disease_expert', name: 'Disease Expert', icon: '🧬', description: 'Correctly identified 10 different diseases', earned: false, verificationRequired: true },
    { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Submitted 5 reports in one day', earned: false, verificationRequired: true },
    { id: 'community_hero', name: 'Community Hero', icon: '🦸', description: 'Helped prevent major outbreak', earned: false, verificationRequired: true },
    { id: 'perfect_month', name: 'Perfect Month', icon: '💎', description: '100% accuracy for a month', earned: false, verificationRequired: true },
    { id: 'legend', name: 'Legend', icon: '👑', description: 'Reached 1000 points with 90%+ quality', earned: false, verificationRequired: true },
    // Geo-verification specific badges
    { id: 'location_verified', name: 'Location Verified', icon: '📍', description: 'Successfully verified first geo-tagged image', earned: false, verificationRequired: true },
    { id: 'geo_expert', name: 'Geo Expert', icon: '🗺️', description: 'Verified 5 geo-tagged images in a row', earned: false, verificationRequired: true },
    { id: 'navigation_master', name: 'Navigation Master', icon: '🧭', description: 'Verified 10 geo-tagged images in a row', earned: false, verificationRequired: true },
    { id: 'perfect_gps', name: 'Perfect GPS', icon: '🎯', description: 'Achieved 100% trust score on geo-verification', earned: false, verificationRequired: true },
    { id: 'location_guardian', name: 'Location Guardian', icon: '🛡️', description: 'Prevented 5 false location reports', earned: false, verificationRequired: true },
    { id: 'precision_expert', name: 'Precision Expert', icon: '📍', description: '10 verifications within 50m accuracy', earned: false, verificationRequired: true },
    { id: 'area_master', name: 'Area Coverage Master', icon: '🗺️', description: 'Verified locations in 5 different villages', earned: false, verificationRequired: true }
  ];

  useEffect(() => {
    // Load reward data from localStorage
    const savedData = localStorage.getItem(`rewards_${employeeName}`);
    if (savedData) {
      setRewardData(JSON.parse(savedData));
    } else {
      // Initialize with some starting data
      const initialData = {
        points: 150,
        level: 'Beginner',
        badges: allBadges.slice(0, 4), // First four badges earned
        monthlyRank: 12,
        totalReports: 15,
        earlyDetections: 3,
        streak: 5,
        qualityScore: 85, // Quality score out of 100
        verifiedReports: 12,
        rejectedReports: 1,
        pendingVerification: 2,
        // Geo-verification specific fields
        geoVerificationPoints: 60,
        totalGeoVerifications: 8,
        perfectGeoVerifications: 3,
        geoStreak: 3,
        villagesCovered: 2,
        locationAccuracy: 85
      };
      setRewardData(initialData);
      localStorage.setItem(`rewards_${employeeName}`, JSON.stringify(initialData));
    }

    // Listen for automatic point updates from report submissions
    const handlePointsEarned = (event: CustomEvent) => {
      const { points, action, qualityScore } = event.detail;
      console.log(`Report submitted: ${points} potential points, quality: ${qualityScore}%`);
      
      // Only award points if quality score is above threshold
      const MIN_QUALITY_THRESHOLD = 70; // 70% quality required
      
      if (qualityScore >= MIN_QUALITY_THRESHOLD) {
        // Points are pending verification first
        const newPendingVerification = rewardData.pendingVerification + 1;
        
        setRewardData(prev => ({
          ...prev,
          pendingVerification: newPendingVerification,
          totalReports: action === 'report_submission' ? prev.totalReports + 1 : prev.totalReports
        }));

        // Show pending notification instead of immediate points
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2000);

        // Store pending report for verification
        const pendingReport = {
          id: Date.now().toString(),
          action,
          potentialPoints: points,
          qualityScore,
          timestamp: new Date().toISOString(),
          status: 'pending_verification'
        };
        
        const pendingReports = JSON.parse(localStorage.getItem(`pending_reports_${employeeName}`) || '[]');
        pendingReports.push(pendingReport);
        localStorage.setItem(`pending_reports_${employeeName}`, JSON.stringify(pendingReports));

        if (onPointsEarned) {
          onPointsEarned(0); // 0 points until verified
        }
      } else {
        // Low quality - no points, show improvement message
        console.log(`Report quality too low (${qualityScore}%). Minimum required: ${MIN_QUALITY_THRESHOLD}%`);
        // Could show a quality improvement notification here
      }
    };

    window.addEventListener('pointsEarned', handlePointsEarned as EventListener);

    return () => {
      window.removeEventListener('pointsEarned', handlePointsEarned as EventListener);
    };
  }, [employeeName, onPointsEarned, rewardData.points]);

  
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Legend': return 'text-purple-600 bg-purple-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      case 'Advanced': return 'text-orange-600 bg-orange-100';
      case 'Intermediate': return 'text-blue-600 bg-blue-100';
      case 'Skilled': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  
  
  const getBadgeIcon = (icon: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '🎯': <Target className="w-6 h-6" />,
      '🌅': <Zap className="w-6 h-6" />,
      '🔥': <TrendingUp className="w-6 h-6" />,
      '🦸': <Award className="w-6 h-6" />,
      '🔍': <Star className="w-6 h-6" />,
      '🧬': <Trophy className="w-6 h-6" />,
      '⚡': <Zap className="w-6 h-6" />,
      '👑': <Crown className="w-6 h-6" />
    };
    return iconMap[icon] || <Star className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      {/* Points Animation Overlay */}
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-yellow-500 text-white px-8 py-4 rounded-full text-2xl font-bold animate-bounce shadow-lg">
            📋 Report Submitted - Awaiting Verification!
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Rewards System</h1>
                <p className="text-gray-600">Work more, earn more!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Welcome back,</div>
              <div className="text-xl font-bold text-purple-600">{employeeName}</div>
            </div>
          </div>
        </div>

        {/* Stats Overview - Old Card System with Different Colors */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold text-purple-600">{rewardData.points}</span>
            </div>
            <div className="text-sm text-purple-600">Verified Points</div>
            <div className="text-xs text-purple-400 mt-2">Level: {rewardData.level}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-blue-600">{rewardData.totalReports}</span>
            </div>
            <div className="text-sm text-blue-600">Reports Submitted</div>
            <div className="text-xs text-blue-400 mt-2">This month: {Math.floor(rewardData.totalReports * 0.3)}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-green-600">{rewardData.verifiedReports}</span>
            </div>
            <div className="text-sm text-green-600">Verified Reports</div>
            <div className="text-xs text-green-400 mt-2">Approved quality</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-orange-600">{rewardData.qualityScore}%</span>
            </div>
            <div className="text-sm text-orange-600">Quality Score</div>
            <div className="text-xs text-orange-400 mt-2">Average accuracy</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold text-red-600">{rewardData.pendingVerification}</span>
            </div>
            <div className="text-sm text-red-600">Pending Review</div>
            <div className="text-xs text-red-400 mt-2">Awaiting verification</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Level Progress</h2>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full font-bold ${getLevelColor(rewardData.level)}`}>
              {rewardData.level}
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((rewardData.points % 200) / 200 * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {200 - (rewardData.points % 200)} points to next level
              </div>
            </div>
          </div>
        </div>

        {/* Geo-Verification Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-500" />
            Geo-Verification Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{rewardData.totalGeoVerifications}</div>
              <div className="text-sm text-gray-600">Total Verifications</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{rewardData.perfectGeoVerifications}</div>
              <div className="text-sm text-gray-600">Perfect GPS</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{rewardData.geoStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{rewardData.villagesCovered}</div>
              <div className="text-sm text-gray-600">Villages Covered</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Location Accuracy</span>
              <span>{rewardData.locationAccuracy}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${rewardData.locationAccuracy}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badges Earned Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-500" />
            Badges Earned Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {rewardData.badges.filter(badge => badge.earned).length}
              </div>
              <div className="text-lg text-gray-700 font-semibold">Total Badges Earned</div>
              <div className="text-sm text-gray-500">
                out of {allBadges.length} available badges
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {rewardData.badges.filter(badge => badge.earned && badge.verificationRequired).length}
              </div>
              <div className="text-lg text-gray-700 font-semibold">Verified Badges</div>
              <div className="text-sm text-gray-500">
                requiring verification
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {rewardData.badges.filter(badge => badge.earned && badge.icon === '📍' || badge.icon === '🗺️' || badge.icon === '🧭' || badge.icon === '🛡️').length}
              </div>
              <div className="text-lg text-gray-700 font-semibold">Geo-Verification Badges</div>
              <div className="text-sm text-gray-500">
                location-specific achievements
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Badge Collection Progress</span>
              <span>{Math.round((rewardData.badges.filter(badge => badge.earned).length / allBadges.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(rewardData.badges.filter(badge => badge.earned).length / allBadges.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Badges Collection</h2>
          <div className="grid grid-cols-5 gap-4">
            {allBadges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-105 cursor-pointer ${
                  badge.earned 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
                title={badge.description}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <div className="text-xs font-semibold text-gray-900">{badge.name}</div>
                {badge.earned && (
                  <div className="text-xs text-green-600 mt-1">✓ Earned</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Monthly Leaderboard</h2>
            <div className="text-sm text-purple-600">Your Rank: #{rewardData.monthlyRank}</div>
          </div>
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-102 ${
                  entry.name === employeeName
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-700 w-8">
                    {entry.badge}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{entry.name}</div>
                    <div className="text-xs text-gray-600">{entry.reports} reports</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">{entry.points}</div>
                  <div className="text-xs text-gray-600">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all hover:scale-105 shadow-lg"
              title="Submit Report"
              aria-label="Submit Report"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-semibold">Submit Report</div>
              <div className="text-xs">+50 points (auto)</div>
            </button>

            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 shadow-lg"
              title="Early Detection"
              aria-label="Early Detection"
            >
              <div className="text-2xl mb-2">🚨</div>
              <div className="text-sm font-semibold">Early Detection</div>
              <div className="text-xs">+100 points (auto)</div>
            </button>

            <button
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all hover:scale-105 shadow-lg"
              title="Photo Report"
              aria-label="Photo Report"
            >
              <div className="text-2xl mb-2">📸</div>
              <div className="text-sm font-semibold">Photo Report</div>
              <div className="text-xs">+25 points (auto)</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
