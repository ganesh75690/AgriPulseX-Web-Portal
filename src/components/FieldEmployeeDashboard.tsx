import React, { useEffect, useState } from 'react';
import { Upload, FileText, MapPin, CheckCircle, Clock, AlertTriangle, Plus, Camera, Trophy, Download, X, User, Calendar } from 'lucide-react';
import TransportAdvisory from './TransportAdvisory';
import RewardsSystem from './RewardsSystem';
import ReportSubmissionDialog from './ReportSubmissionDialog';

interface FieldEmployeeDashboardProps {
  onNavigateToReportSubmission: () => void;
  onNavigateToMyReports: () => void;
}

export default function FieldEmployeeDashboard({ onNavigateToReportSubmission, onNavigateToMyReports }: FieldEmployeeDashboardProps) {
  const [countersVisible, setCountersVisible] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    qualityScore: 0,
    pointsAwarded: 0,
    reportId: '',
    status: 'pending_verification' as 'pending_verification' | 'rejected' | 'approved',
    feedback: ''
  });

  useEffect(() => {
    setTimeout(() => setCountersVisible(true), 300);
  }, []);

  const [submittedToday, setSubmittedToday] = useState(0);
  const [pendingReview, setPendingReview] = useState(0);
  const [approvedReports, setApprovedReports] = useState(0);
  const [assignedVillages, setAssignedVillages] = useState(0);

  useEffect(() => {
    if (countersVisible) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setSubmittedToday(Math.floor(3 * progress));
        setPendingReview(Math.floor(2 * progress));
        setApprovedReports(Math.floor(47 * progress));
        setAssignedVillages(Math.floor(12 * progress));

        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [countersVisible]);

  const recentReports = [
    { id: 'F2024-001', farmer: 'Ramesh Kumar', village: 'Ludhiana - Village A', crop: 'Wheat', status: 'Under Review', time: '2 hours ago' },
    { id: 'F2024-002', farmer: 'Sunita Devi', village: 'Ludhiana - Village B', crop: 'Rice', status: 'Under Review', time: '4 hours ago' },
    { id: 'F2024-003', farmer: 'Gurpreet Singh', village: 'Ludhiana - Village C', crop: 'Cotton', status: 'Approved', time: '1 day ago' }
  ];

  const assignedAreas = [
    { village: 'Village A', population: '1,245', mainCrop: 'Wheat', lastVisit: 'Yesterday' },
    { village: 'Village B', population: '892', mainCrop: 'Rice', lastVisit: '2 days ago' },
    { village: 'Village C', population: '1,567', mainCrop: 'Cotton', lastVisit: '3 days ago' }
  ];

  const demoOfficerReports = [
    {
      id: 'OFF-2024-001',
      officer: 'Dr. Rajesh Kumar',
      title: 'Urgent: Wheat Rust Outbreak in Village A',
      date: '2024-01-23',
      priority: 'high',
      summary: 'Multiple cases of wheat rust detected. Immediate containment measures required.',
      content: 'Field inspection revealed severe wheat rust infection affecting approximately 15 hectares of farmland in Village A. The disease has spread rapidly due to recent humid conditions. Recommended immediate action: fungicide application and quarantine of affected areas.',
      attachments: ['field_photos.pdf', 'lab_analysis.pdf']
    },
    {
      id: 'OFF-2024-002',
      officer: 'Dr. Sunita Patel',
      title: 'Weekly Crop Health Report - Ludhiana District',
      date: '2024-01-22',
      priority: 'medium',
      summary: 'Overall crop health status with recommendations for the upcoming week.',
      content: 'Comprehensive analysis of crop health across Ludhiana district shows 78% healthy crops, 15% minor infections, and 7% requiring immediate attention. Weather conditions favorable for crop growth. Recommendations: continue regular monitoring and preventive treatments.',
      attachments: ['weekly_report.pdf']
    },
    {
      id: 'OFF-2024-003',
      officer: 'Dr. Amit Sharma',
      title: 'New Pest Alert: Fall Armyworm Detection',
      date: '2024-01-21',
      priority: 'high',
      summary: 'Fall armyworm detected in cotton fields. Emergency response protocol activated.',
      content: 'Fall armyworm (Spodoptera frugiperda) detected in cotton fields in Village B. This is the first reported case this season. Emergency response protocol has been activated. All field officers are instructed to conduct thorough inspections and report any sightings immediately.',
      attachments: ['pest_alert.pdf', 'identification_guide.pdf']
    },
    {
      id: 'OFF-2024-004',
      officer: 'Dr. Priya Nair',
      title: 'Training Schedule: Disease Identification Workshop',
      date: '2024-01-20',
      priority: 'low',
      summary: 'Upcoming training session for field employees on advanced disease identification.',
      content: 'Training workshop scheduled for next week covering advanced disease identification techniques, new detection technologies, and best practices for sample collection. All field employees are required to attend. Venue: District Agricultural Office.',
      attachments: ['training_schedule.pdf', 'course_materials.pdf']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-emerald-600/20 backdrop-blur-sm border-b border-emerald-400/30 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">Field Employee Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Data Collection & Reporting System
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-green-700">Field Status</div>
                <div className="text-sm text-green-900 mt-0.5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Active Duty
                </div>
              </div>
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-blue-700">District</div>
                <div className="text-sm text-blue-900 mt-0.5">Ludhiana</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-6">
          <button
            onClick={() => {
              console.log('Submit New Report button clicked!');
              // Simulate quality score calculation (in real system, this would be calculated based on report quality)
              const qualityScore = Math.floor(Math.random() * 30) + 70; // Random between 70-100
              const reportId = `RPT-${Date.now().toString().slice(-6)}`;
              
              // Determine status based on quality score
              const status = qualityScore >= 70 ? 'pending_verification' : 'rejected';
              const feedback = qualityScore < 70 ? 'Report quality is below minimum standards. Please ensure proper image quality and complete information.' : '';
              
              // Set submission data and show dialog
              setSubmissionData({
                qualityScore,
                pointsAwarded: qualityScore >= 70 ? 50 : 0,
                reportId,
                status,
                feedback
              });
              setShowSubmissionDialog(true);
              
              // Trigger report submission with quality validation
              const event = new CustomEvent('pointsEarned', { 
                detail: { 
                  points: 50, 
                  action: 'report_submission',
                  qualityScore: qualityScore
                } 
              });
              window.dispatchEvent(event);
              
              onNavigateToReportSubmission();
            }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">Submit New Report</h3>
                <p className="text-sm text-green-100">Report crop disease from field</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              console.log('My Reports button clicked!');
              onNavigateToMyReports();
            }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">My Reports</h3>
                <p className="text-sm text-blue-100">View submitted reports status</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowMessages(true)}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1">Messages</h3>
                <p className="text-sm text-purple-100">View officer communications</p>
              </div>
            </div>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Submitted Today', value: submittedToday, icon: Upload, color: 'from-green-500 to-green-600', textColor: 'text-green-600' },
            { label: 'Pending Review', value: pendingReview, icon: Clock, color: 'from-amber-500 to-amber-600', textColor: 'text-amber-600' },
            { label: 'Approved Reports', value: approvedReports, icon: CheckCircle, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600' },
            { label: 'Assigned Villages', value: assignedVillages, icon: MapPin, color: 'from-purple-500 to-purple-600', textColor: 'text-purple-600' }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`bg-emerald-50/80 backdrop-blur-sm rounded-xl border-2 border-emerald-200/50 shadow-sm overflow-hidden transition-all hover:shadow-xl cursor-pointer hover:scale-[1.03] group ${countersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{metric.value}</div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                  <div className="mt-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click for details →
                  </div>
                </div>
                <div className={`h-1 bg-gradient-to-r ${metric.color}`}></div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Reports */}
          <div className="bg-emerald-50/80 backdrop-blur-sm rounded-xl border-2 border-emerald-200/50 shadow-sm">
            <div className="bg-gradient-to-r from-emerald-100/80 to-green-100/80 px-6 py-4 border-b-2 border-emerald-300/50">
              <h2 className="text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Recent Reports
              </h2>
              <p className="text-xs text-blue-700 mt-1">Your latest field submissions</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-gray-900 mb-1 group-hover:text-blue-800 transition-colors">{report.id}</div>
                        <div className="text-xs text-gray-600">{report.farmer} - {report.village}</div>
                        <div className="text-xs text-gray-500">{report.crop}</div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        report.status === 'Approved' 
                          ? 'bg-green-100 text-green-700 border border-green-300' 
                          : 'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">Submitted {report.time}</div>
                      <div className="flex items-center gap-2">
                        <Camera className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">Image</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={onNavigateToMyReports}
                className="w-full mt-4 flex items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 text-sm py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                <span>View All Reports</span>
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Assigned Areas */}
          <div className="bg-emerald-50/80 backdrop-blur-sm rounded-xl border-2 border-emerald-200/50 shadow-sm">
            <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 px-6 py-4 border-b-2 border-green-300/50">
              <h2 className="text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Assigned Areas
              </h2>
              <p className="text-xs text-green-700 mt-1">Villages under your supervision</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {assignedAreas.map((area, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm text-gray-900 mb-1 group-hover:text-green-800 transition-colors">{area.village}</div>
                        <div className="text-xs text-gray-600">Population: {area.population}</div>
                        <div className="text-xs text-gray-500">Main Crop: {area.mainCrop}</div>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-300">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">Last visit: {area.lastVisit}</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400 group-hover:text-green-600 transition-colors" />
                        <span className="text-xs text-gray-400 group-hover:text-green-600 transition-colors">Navigate</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                <p className="text-xs text-green-900 leading-relaxed">
                  <strong>Field Guidelines:</strong> Visit each assigned village weekly and report any suspicious crop conditions immediately. 
                  Your reports help officers make timely containment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transport Advisory Section */}
        <TransportAdvisory employeeVillages={assignedAreas.map(area => area.village)} />

        {/* Field Advisory */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all group">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-green-900 mb-1 font-semibold group-hover:text-green-800">Field Advisory: Report Quality Matters</h3>
                <p className="text-xs text-green-900 leading-relaxed mb-3">
                  High-quality images and accurate location data significantly improve disease detection accuracy. 
                  Ensure proper lighting and focus when capturing crop images. Include field context and surrounding conditions in your notes.
                </p>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Quality First</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>AI Assisted</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Officer Reviewed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowRewards(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-center gap-4">
              <Trophy className="w-8 h-8 text-yellow-300 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xl font-bold">🏆 Rewards System</div>
                <div className="text-sm opacity-90">Work more, earn more!</div>
              </div>
            </div>
          </button>
        </div>

        {/* Rewards Modal */}
        {showRewards && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">🏆 Employee Rewards</h2>
                <button
                  onClick={() => setShowRewards(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-600 text-xl">×</span>
                </button>
              </div>
              <RewardsSystem employeeName="Field Employee" />
            </div>
          </div>
        )}

        {/* Messages Modal */}
        {showMessages && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">📨 Officer Communications</h2>
                <button
                  onClick={() => setShowMessages(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label="Close messages"
                  title="Close messages"
                >
                  <X className="text-gray-600 text-xl" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {demoOfficerReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{report.officer}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {report.date}
                            </div>
                          </div>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{report.title}</h4>
                        <p className="text-gray-600 mb-3">{report.summary}</p>
                        <p className="text-gray-700 text-sm leading-relaxed">{report.content}</p>
                      </div>
                      <div className="ml-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.priority === 'high' 
                            ? 'bg-red-100 text-red-700' 
                            : report.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {report.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {report.attachments.length > 0 && (
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">📎 Attachments</h5>
                        <div className="flex flex-wrap gap-2">
                          {report.attachments.map((attachment, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                // Simulate PDF download
                                const link = document.createElement('a');
                                link.href = '#';
                                link.download = attachment;
                                link.click();
                                alert(`Downloading ${attachment}...`);
                              }}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              {attachment}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report Submission Dialog */}
        <ReportSubmissionDialog
          isOpen={showSubmissionDialog}
          onClose={() => setShowSubmissionDialog(false)}
          qualityScore={submissionData.qualityScore}
          pointsAwarded={submissionData.pointsAwarded}
          reportId={submissionData.reportId}
          status={submissionData.status}
          feedback={submissionData.feedback}
        />
      </div>
    </div>
  );
}
