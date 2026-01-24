import React from 'react';
import { Trophy, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

interface ReportSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  qualityScore: number;
  pointsAwarded: number;
  reportId: string;
  status: 'pending_verification' | 'approved' | 'rejected';
  feedback?: string;
}

export default function ReportSubmissionDialog({
  isOpen,
  onClose,
  qualityScore,
  pointsAwarded,
  reportId,
  status,
  feedback
}: ReportSubmissionDialogProps) {
  if (!isOpen) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending_verification':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-12 h-12 text-white" />;
      case 'rejected':
        return <AlertCircle className="w-12 h-12 text-white" />;
      case 'pending_verification':
        return <Clock className="w-12 h-12 text-white" />;
      default:
        return <Trophy className="w-12 h-12 text-white" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'approved':
        return 'Report Approved!';
      case 'rejected':
        return 'Report Rejected';
      case 'pending_verification':
        return 'Report Submitted - Awaiting Verification';
      default:
        return 'Report Submitted';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'approved':
        return `Excellent work! Your report has been verified and ${pointsAwarded} points have been awarded to your account.`;
      case 'rejected':
        return feedback || 'Your report did not meet the quality standards. Please review the submission guidelines and try again.';
      case 'pending_verification':
        return `Your report has been submitted with a quality score of ${qualityScore}%. It is now pending verification by an officer.`;
      default:
        return 'Your report has been submitted successfully.';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          title="Close dialog"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          {getStatusTitle()}
        </h2>

        {/* Report ID */}
        <div className="text-center text-sm text-gray-500 mb-4">
          Report ID: #{reportId}
        </div>

        {/* Quality Score */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Quality Score</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getQualityColor(qualityScore)}`}>
              {qualityScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                qualityScore >= 90 ? 'bg-green-500' :
                qualityScore >= 80 ? 'bg-blue-500' :
                qualityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${qualityScore}%` }}
            ></div>
          </div>
        </div>

        {/* Points Awarded */}
        {status === 'approved' && (
          <div className="bg-green-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Points Awarded</span>
              </div>
              <span className="text-xl font-bold text-green-600">+{pointsAwarded}</span>
            </div>
          </div>
        )}

        {/* Status Message */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-blue-700 leading-relaxed">
            {getStatusMessage()}
          </p>
        </div>

        {/* Additional Info */}
        {status === 'pending_verification' && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-700 mb-1">Verification Process</p>
                <p className="text-xs text-yellow-600">
                  Your report is being reviewed by a senior officer. This typically takes 2-24 hours.
                  You will be notified once verification is complete.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          {status === 'approved' ? 'Great! Continue Working' : 'Understood'}
        </button>
      </div>
    </div>
  );
}
