import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Search, Eye, User, ArrowLeft, AlertTriangle } from 'lucide-react';
import TakeActionModal from './TakeActionModal';

interface FieldReportsInboxProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface FieldReport {
  id: string;
  farmerName: string;
  farmerId: string;
  village: string;
  district: string;
  cropType: string;
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  submittedBy: string;
  submittedDate: string;
  status: 'New' | 'Under Review' | 'Approved' | 'Action Required' | 'Emergency' | 'Monitoring' | 'Controlled';
  imageUrl: string;
  clusterDetected?: boolean;
  fieldArea: string;
  fieldLocation: string;
  soilType: string;
  irrigationSource: string;
  lastTreatment: string;
}

export default function FieldReportsInbox({ onBack, onNavigate }: FieldReportsInboxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<FieldReport | null>(null);
  const [takeActionReport, setTakeActionReport] = useState<FieldReport | null>(null);
  const [activeSection, setActiveSection] = useState<'farmer' | 'village'>('farmer');
  const [farmerReports, setFarmerReports] = useState<FieldReport[]>([]);
  const [villageReports, setVillageReports] = useState<FieldReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load demo reports on component mount
  useEffect(() => {
    const loadDemoReports = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo field reports data
        const demoReports: FieldReport[] = [
          {
            id: 'F2024-001',
            farmerName: 'Rajesh Kumar',
            farmerId: '123456',
            village: 'Village A - Ludhiana',
            district: 'Ludhiana',
            cropType: 'Wheat',
            disease: 'Leaf Blight',
            confidence: 87,
            severity: 'Medium',
            submittedBy: 'Field Officer Amit',
            submittedDate: '2024-01-15 10:30 AM',
            status: 'New',
            imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
            clusterDetected: true,
            fieldArea: '2.5 hectares',
            fieldLocation: 'North Block, Plot 15',
            soilType: 'Clay Loam',
            irrigationSource: 'Canal + Tubewell',
            lastTreatment: 'Fungicide spray - 7 days ago'
          },
          {
            id: 'F2024-002',
            farmerName: 'Sunita Devi',
            farmerId: '234567',
            village: 'Village B - Ludhiana',
            district: 'Ludhiana',
            cropType: 'Rice',
            disease: 'Bacterial Leaf Blight',
            confidence: 92,
            severity: 'High',
            submittedBy: 'Field Officer Priya',
            submittedDate: '2024-01-15 09:15 AM',
            status: 'Action Required',
            imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
            clusterDetected: false,
            fieldArea: '1.8 hectares',
            fieldLocation: 'South Block, Plot 8',
            soilType: 'Sandy Clay',
            irrigationSource: 'Tubewell',
            lastTreatment: 'Bactericide spray - 3 days ago'
          },
          {
            id: 'F2024-003',
            farmerName: 'Mohammed Ali',
            farmerId: '345678',
            village: 'Village C - Ludhiana',
            district: 'Ludhiana',
            cropType: 'Cotton',
            disease: 'Healthy',
            confidence: 95,
            severity: 'Low',
            submittedBy: 'Field Officer Raj',
            submittedDate: '2024-01-14 04:45 PM',
            status: 'Approved',
            imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
            clusterDetected: false,
            fieldArea: '3.2 hectares',
            fieldLocation: 'East Block, Plot 22',
            soilType: 'Black Cotton',
            irrigationSource: 'Drip Irrigation',
            lastTreatment: 'Pesticide spray - 14 days ago'
          },
          {
            id: 'V2024-001',
            farmerName: 'Village Report',
            farmerId: 'village_1705123456789',
            village: 'Village D - Ludhiana',
            district: 'Ludhiana',
            cropType: 'Wheat',
            disease: 'Wheat Rust',
            confidence: 78,
            severity: 'Medium',
            submittedBy: 'Field Officer Anita',
            submittedDate: '2024-01-15 11:00 AM',
            status: 'Under Review',
            imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
            clusterDetected: true,
            fieldArea: '5.0 hectares',
            fieldLocation: 'Central Block, Multiple plots',
            soilType: 'Mixed Soil',
            irrigationSource: 'Canal System',
            lastTreatment: 'Fungicide spray - 5 days ago'
          }
        ];

        console.log('Demo reports loaded:', demoReports);
        
        setFarmerReports(demoReports);
        setVillageReports(demoReports.filter(report => report.clusterDetected));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load demo reports');
        console.error('Error loading demo reports:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDemoReports();
  }, []);

  const filteredReports = activeSection === 'farmer' ? farmerReports : villageReports;

  const filteredReportsList = filteredReports.filter(report => {
    const matchesSearch = report.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-red-100 text-red-700 border-red-300';
      case 'Under Review': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'Action Required': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Emergency': return 'bg-red-600 text-white border-red-700';
      case 'Monitoring': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Controlled': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleSectionChange = (section: 'farmer' | 'village') => {
    setActiveSection(section);
    setSelectedReport(null);
  };

  const handleRowClick = (report: FieldReport) => {
    setSelectedReport(report);
  };

  const handleTakeAction = (report: FieldReport) => {
    setTakeActionReport(report);
  };

  const handleActionComplete = (actionData: any) => {
    console.log('Action completed:', actionData);
    setTakeActionReport(null);
    setSelectedReport(null);
  };

  const handleImageClick = (imageUrl: string) => {
    console.log('Opening image URL:', imageUrl);
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    } else {
      console.log('No image URL available');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">Field Reports Inbox</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Review and analyze submitted field reports
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-xs text-red-700">New Reports</div>
                <div className="text-sm text-red-900 mt-0.5">
                  {filteredReportsList.filter(r => r.status === 'New').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Section Tabs */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => handleSectionChange('farmer')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'farmer'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Farmer's Land Reports
            </button>
            <button
              onClick={() => handleSectionChange('village')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === 'village'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏘️ Village's Land Reports
            </button>
          </div>
        </div>

        {/* Tables */}
        {activeSection === 'farmer' ? (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🌾 Individual Farmer Reports</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-green-50">
                  <tr className="text-left">
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Report ID</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Farmer Name</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Village</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Crop Type</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Disease</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Severity</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Date</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Status</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Images</th>
                  </tr>
                </thead>
                <tbody>
                  {farmerReports.map((report) => (
                    <tr 
                      key={report.id}
                      onClick={() => handleRowClick(report)}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedReport?.id === report.id ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <td className="p-3 border-b border-gray-200 text-sm font-medium">{report.id}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.farmerName}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.village}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.cropType}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.disease}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          report.severity === 'High' ? 'bg-red-100 text-red-700 border-red-300' :
                          report.severity === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                          'bg-green-100 text-green-700 border-green-300'
                        }`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.submittedDate}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="p-3 border-b border-gray-200 text-sm">
                        {report.imageUrl ? (
                          <img 
                            src={report.imageUrl} 
                            alt="Report image" 
                            className="w-12 h-12 object-cover rounded border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => handleImageClick(report.imageUrl)}
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🏘️ Village Cluster Reports</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-50">
                  <tr className="text-left">
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Report ID</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Village</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">District</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Crop Type</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Disease</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Severity</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Date</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Status</th>
                    <th className="p-3 font-semibold text-gray-900 border-b border-gray-300">Images</th>
                  </tr>
                </thead>
                <tbody>
                  {villageReports.map((report) => (
                    <tr 
                      key={report.id}
                      onClick={() => handleRowClick(report)}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedReport?.id === report.id ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <td className="p-3 border-b border-gray-200 text-sm font-medium">{report.id}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.village}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.district}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.cropType}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">{report.disease}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.severity === 'High' ? 'bg-red-100 text-red-800' :
                          report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="p-3 border-b border-gray-200 text-sm">{new Date(report.submittedDate).toLocaleDateString()}</td>
                      <td className="p-3 border-b border-gray-200 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          report.status === 'Action Required' ? 'bg-orange-100 text-orange-800' :
                          report.status === 'Emergency' ? 'bg-red-100 text-red-800' :
                          report.status === 'Monitoring' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="p-3 border-b border-gray-200 text-sm">
                        {report.imageUrl ? (
                          <img 
                            src={report.imageUrl} 
                            alt="Report image" 
                            className="w-12 h-12 object-cover rounded border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => handleImageClick(report.imageUrl)}
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-gray-900 font-semibold">Field Report Details - {selectedReport.id}</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Farmer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Name:</span> <span className="text-gray-900">{selectedReport.farmerName}</span></div>
                    <div><span className="text-gray-500">ID:</span> <span className="text-gray-900">{selectedReport.farmerId}</span></div>
                    <div><span className="text-gray-500">Village:</span> <span className="text-gray-900">{selectedReport.village}</span></div>
                    <div><span className="text-gray-500">District:</span> <span className="text-gray-900">{selectedReport.district}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Report Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Crop Type:</span> <span className="text-gray-900">{selectedReport.cropType}</span></div>
                    <div><span className="text-gray-500">Disease:</span> <span className="text-gray-900">{selectedReport.disease}</span></div>
                    <div><span className="text-gray-500">AI Confidence:</span> <span className="text-gray-900">{selectedReport.confidence}%</span></div>
                    <div><span className="text-gray-500">Severity:</span> <span className="text-gray-900">{selectedReport.severity}</span></div>
                  </div>
                </div>
              </div>

              {/* Field Area Details Section */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-green-800 mb-3">🌾 Field Area Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 text-sm">
                    <div><span className="text-green-600">Field Area:</span> <span className="text-green-900 font-medium">{selectedReport.fieldArea}</span></div>
                    <div><span className="text-green-600">Location:</span> <span className="text-green-900 font-medium">{selectedReport.fieldLocation}</span></div>
                    <div><span className="text-green-600">Soil Type:</span> <span className="text-green-900 font-medium">{selectedReport.soilType}</span></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-green-600">Irrigation Source:</span> <span className="text-green-900 font-medium">{selectedReport.irrigationSource}</span></div>
                    <div><span className="text-green-600">Last Treatment:</span> <span className="text-green-900 font-medium">{selectedReport.lastTreatment}</span></div>
                    <div><span className="text-green-600">Cluster Detected:</span> <span className="text-green-900 font-medium">{selectedReport.clusterDetected ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleTakeAction(selectedReport)}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Take Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Take Action Modal */}
      {takeActionReport && (
        <TakeActionModal
          report={takeActionReport}
          onClose={() => setTakeActionReport(null)}
          onActionComplete={handleActionComplete}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
