import React, { useState } from 'react';
import { FileText, Camera, CheckCircle, Clock, AlertTriangle, ArrowLeft, Search, Filter, Eye, Download, X, MapPin, Shield, Navigation } from 'lucide-react';

interface MyReportsProps {
  onBack: () => void;
}

interface Report {
  id: string;
  reportType: 'farmer' | 'village';
  farmerName?: string;
  contactNumber?: string;
  village: string;
  totalLandArea?: string;
  pincode?: string;
  cropType: string;
  disease: string;
  confidence: number;
  status: 'Under Review' | 'Approved' | 'Action Required' | 'Resolved';
  submittedDate: string;
  reviewedDate?: string;
  officerNotes?: string;
  imageUrl: string;
  // Geo-verification fields
  geoVerification?: {
    status: 'VERIFIED' | 'REVIEW_REQUIRED' | 'REJECTED' | 'PENDING';
    trustScore?: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    distance?: number;
    accuracy?: string;
    verificationTime?: string;
    deviceInfo?: string;
    locationDetails?: string;
  };
}

export default function MyReports({ onBack }: MyReportsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const reports: Report[] = [
    // Farmer Reports
    {
      id: 'F2024-001',
      reportType: 'farmer',
      farmerName: 'Ramesh Kumar',
      contactNumber: '9876543210',
      village: 'Village A - Ludhiana',
      cropType: 'Wheat',
      disease: 'Leaf Rust',
      confidence: 92,
      status: 'Under Review',
      submittedDate: '12 Jan 2026, 10:30 AM',
      imageUrl: '/api/placeholder/150/100',
      geoVerification: {
        status: 'VERIFIED',
        trustScore: 87,
        coordinates: {
          latitude: 30.9010,
          longitude: 75.8573
        },
        distance: 45,
        accuracy: 'High',
        verificationTime: '12 Jan 2026, 10:35 AM',
        deviceInfo: 'Samsung Galaxy S21',
        locationDetails: 'Verified within village boundary'
      }
    },
    {
      id: 'F2024-002',
      reportType: 'farmer',
      farmerName: 'Sunita Devi',
      contactNumber: '9123456789',
      village: 'Village B - Ludhiana',
      cropType: 'Rice',
      disease: 'Blast',
      confidence: 88,
      status: 'Approved',
      submittedDate: '11 Jan 2026, 02:15 PM',
      reviewedDate: '11 Jan 2026, 04:30 PM',
      officerNotes: 'Approved for containment treatment',
      imageUrl: '/api/placeholder/150/100',
      geoVerification: {
        status: 'VERIFIED',
        trustScore: 91,
        coordinates: {
          latitude: 30.9150,
          longitude: 75.8620
        },
        distance: 25,
        accuracy: 'Perfect',
        verificationTime: '11 Jan 2026, 02:20 PM',
        deviceInfo: 'iPhone 13',
        locationDetails: 'Precise location verification'
      }
    },
    // Village Reports
    {
      id: 'V2024-001',
      reportType: 'village',
      village: 'Village C - Ludhiana',
      totalLandArea: '450 acres',
      pincode: '141001',
      cropType: 'Cotton',
      disease: 'Bollworm',
      confidence: 85,
      status: 'Under Review',
      submittedDate: '12 Jan 2026, 09:15 AM',
      imageUrl: '/api/placeholder/150/100',
      geoVerification: {
        status: 'REVIEW_REQUIRED',
        trustScore: 72,
        coordinates: {
          latitude: 30.9200,
          longitude: 75.8700
        },
        distance: 320,
        accuracy: 'Medium',
        verificationTime: '12 Jan 2026, 09:25 AM',
        deviceInfo: 'Redmi Note 10',
        locationDetails: 'Location near village boundary - requires manual review'
      }
    },
    {
      id: 'V2024-002',
      reportType: 'village',
      village: 'Village D - Ludhiana',
      totalLandArea: '320 acres',
      pincode: '141002',
      cropType: 'Sugarcane',
      disease: 'Red Rot',
      confidence: 91,
      status: 'Action Required',
      submittedDate: '11 Jan 2026, 11:45 AM',
      reviewedDate: '11 Jan 2026, 03:20 PM',
      officerNotes: 'Immediate containment recommended',
      imageUrl: '/api/placeholder/150/100',
      geoVerification: {
        status: 'REJECTED',
        trustScore: 45,
        coordinates: {
          latitude: 30.9500,
          longitude: 75.9000
        },
        distance: 850,
        accuracy: 'Low',
        verificationTime: '11 Jan 2026, 11:50 AM',
        deviceInfo: 'Unknown Device',
        locationDetails: 'Location does not match reported village'
      }
    },
    {
      id: 'V2024-003',
      reportType: 'village',
      village: 'Village E - Ludhiana',
      totalLandArea: '280 acres',
      pincode: '141003',
      cropType: 'Maize',
      disease: 'Northern Leaf Blight',
      confidence: 89,
      status: 'Resolved',
      submittedDate: '10 Jan 2026, 04:30 PM',
      reviewedDate: '10 Jan 2026, 06:15 PM',
      officerNotes: 'Area treated successfully',
      imageUrl: '/api/placeholder/150/100',
      geoVerification: {
        status: 'VERIFIED',
        trustScore: 93,
        coordinates: {
          latitude: 30.9050,
          longitude: 75.8550
        },
        distance: 15,
        accuracy: 'Perfect',
        verificationTime: '10 Jan 2026, 04:35 PM',
        deviceInfo: 'OnePlus 9',
        locationDetails: 'Excellent GPS accuracy achieved'
      }
    },
    {
      id: 'F2024-005',
      reportType: 'farmer',
      farmerName: 'Priya Sharma',
      contactNumber: '9876543214',
      village: 'Village A - Ludhiana',
      cropType: 'Wheat',
      disease: 'Yellow Rust',
      confidence: 91,
      status: 'Under Review',
      submittedDate: '2024-01-12 01:45 PM',
      imageUrl: '/api/placeholder/300/200',
      geoVerification: {
        status: 'PENDING',
        coordinates: {
          latitude: 30.9100,
          longitude: 75.8600
        },
        trustScore: 0,
        accuracy: 'Unknown',
        deviceInfo: 'Unknown Device',
        locationDetails: 'Verification pending'
      }
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.disease.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = reportTypeFilter === 'all' || report.reportType === reportTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'Under Review': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Action Required': return 'bg-red-100 text-red-700 border-red-300';
      case 'Resolved': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Under Review': return <Clock className="w-4 h-4" />;
      case 'Action Required': return <AlertTriangle className="w-4 h-4" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">My Reports</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Track your field report submissions
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-blue-700">Total Reports</div>
                <div className="text-sm text-blue-900 mt-0.5">{reports.length}</div>
              </div>
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs text-green-700">Approved</div>
                <div className="text-sm text-green-900 mt-0.5">
                  {reports.filter(r => r.status === 'Approved').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by farmer name, village, crop, or disease..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Action Required">Action Required</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={reportTypeFilter}
                onChange={(e) => setReportTypeFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                aria-label="Filter by report type"
              >
                <option value="all">All Types</option>
                <option value="farmer">Farmer Reports</option>
                <option value="village">Village Reports</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] group"
              onClick={() => setSelectedReport(report)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg text-gray-900 font-semibold group-hover:text-blue-600 transition-colors">
                        {report.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 text-gray-900">
                          {report.reportType === 'farmer' ? '👤 Farmer Report' : '🗺️ Village Report'}
                        </span>
                      </div>
                      {report.reportType === 'farmer' ? (
                        <>
                          <div>
                            <span className="text-gray-500">Farmer:</span>
                            <span className="ml-2 text-gray-900">{report.farmerName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Contact:</span>
                            <span className="ml-2 text-gray-900">{report.contactNumber}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-gray-500">Land Area:</span>
                            <span className="ml-2 text-gray-900">{report.totalLandArea}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Pincode:</span>
                            <span className="ml-2 text-gray-900">{report.pincode}</span>
                          </div>
                        </>
                      )}
                      <div>
                        <span className="text-gray-500">Village:</span>
                        <span className="ml-2 text-gray-900">{report.village}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Crop:</span>
                        <span className="ml-2 text-gray-900">{report.cropType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Disease:</span>
                        <span className="ml-2 text-gray-900">{report.disease}</span>
                      </div>
                      {report.geoVerification && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs text-indigo-600">
                            {report.geoVerification.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={report.imageUrl}
                        alt="Crop image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Submitted: {report.submittedDate}</span>
                    </div>
                    {report.reviewedDate && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Reviewed: {report.reviewedDate}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-600">
                      AI Confidence: <span className="font-semibold">{report.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">View Details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-gray-900 font-semibold">Report Details - {selectedReport.id}</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close report details"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
                  <div className="space-y-3">
                    <div><span className="text-gray-500">Report Type:</span> <span className="text-gray-900">{selectedReport.reportType === 'farmer' ? '👤 Farmer Report' : '🗺️ Village Report'}</span></div>
                    <div><span className="text-gray-500">Report ID:</span> <span className="text-gray-900">{selectedReport.id}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReport.status)}`}>{selectedReport.status}</span></div>
                    <div><span className="text-gray-500">Submitted:</span> <span className="text-gray-900">{selectedReport.submittedDate}</span></div>
                    {selectedReport.reviewedDate && <div><span className="text-gray-500">Reviewed:</span> <span className="text-gray-900">{selectedReport.reviewedDate}</span></div>}
                    <div><span className="text-gray-500">AI Confidence:</span> <span className="text-gray-900">{selectedReport.confidence}%</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedReport.reportType === 'farmer' ? 'Farmer Information' : 'Village Information'}
                  </h3>
                  <div className="space-y-3">
                    {selectedReport.reportType === 'farmer' ? (
                      <>
                        <div><span className="text-gray-500">Farmer Name:</span> <span className="text-gray-900">{selectedReport.farmerName}</span></div>
                        <div><span className="text-gray-500">Contact Number:</span> <span className="text-gray-900">{selectedReport.contactNumber}</span></div>
                      </>
                    ) : (
                      <>
                        <div><span className="text-gray-500">Total Land Area:</span> <span className="text-gray-900">{selectedReport.totalLandArea}</span></div>
                        <div><span className="text-gray-500">Pincode:</span> <span className="text-gray-900">{selectedReport.pincode}</span></div>
                      </>
                    )}
                    <div><span className="text-gray-500">Village:</span> <span className="text-gray-900">{selectedReport.village}</span></div>
                    <div><span className="text-gray-500">Crop Type:</span> <span className="text-gray-900">{selectedReport.cropType}</span></div>
                    <div><span className="text-gray-500">Disease:</span> <span className="text-gray-900">{selectedReport.disease}</span></div>
                  </div>
                </div>
              </div>

              {/* Geo-Verification Section */}
              {selectedReport.geoVerification && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Geo-Verification Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedReport.geoVerification.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                          selectedReport.geoVerification.status === 'REVIEW_REQUIRED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedReport.geoVerification.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Trust Score:</span>
                        <span className="text-gray-900 font-semibold">{selectedReport.geoVerification.trustScore}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Accuracy:</span>
                        <span className="text-gray-900">{selectedReport.geoVerification.accuracy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Distance:</span>
                        <span className="text-gray-900">{selectedReport.geoVerification.distance}m</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-indigo-600" />
                        <span className="text-gray-600 text-sm">Coordinates:</span>
                        <span className="text-gray-900">
                          {selectedReport.geoVerification.coordinates?.latitude.toFixed(6)}°N, {selectedReport.geoVerification.coordinates?.longitude.toFixed(6)}°E
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        <span className="text-gray-600 text-sm">Device:</span>
                        <span className="text-gray-900">{selectedReport.geoVerification.deviceInfo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span className="text-gray-600 text-sm">Verified:</span>
                        <span className="text-gray-900">{selectedReport.geoVerification.verificationTime}</span>
                      </div>
                      <div className="mt-3 p-3 bg-indigo-100 rounded-lg">
                        <p className="text-sm text-indigo-800">
                          <strong>Location Details:</strong> {selectedReport.geoVerification.locationDetails}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {selectedReport.officerNotes && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Officer Notes</h4>
                  <p className="text-amber-800">{selectedReport.officerNotes}</p>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Image</h3>
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedReport.imageUrl}
                    alt="Crop disease image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {selectedReport.officerNotes && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3"> Officer Notes</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">{selectedReport.officerNotes}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
