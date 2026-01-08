import React, { useState } from 'react';
import { FileText, Download, Filter, CheckCircle, Clock, XCircle, Search, X, MapPin, Calendar, User, AlertTriangle, TrendingUp, Shield } from 'lucide-react';

export default function ReportsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const reports = [
    {
      id: 'CNT-2026-001',
      date: '2026-01-02',
      region: 'Punjab - Amritsar',
      disease: 'Late Blight (Potato)',
      officer: 'Dr. Rajesh Kumar Sharma',
      action: 'Targeted Containment (5km)',
      economicImpact: '₹14.2 crore protected',
      status: 'Active',
      duration: '14 days'
    },
    {
      id: 'CNT-2025-342',
      date: '2025-12-28',
      region: 'Maharashtra - Nashik',
      disease: 'Powdery Mildew (Grape)',
      officer: 'Dr. Priya Deshmukh',
      action: 'Advisory & Monitoring',
      economicImpact: '₹8.5 crore protected',
      status: 'Closed',
      duration: 'Completed'
    },
    {
      id: 'CNT-2025-340',
      date: '2025-12-25',
      region: 'Karnataka - Bangalore Rural',
      disease: 'Bacterial Wilt (Tomato)',
      officer: 'Shri Venkatesh Rao',
      action: 'Targeted Containment (3km)',
      economicImpact: '₹6.8 crore protected',
      status: 'Closed',
      duration: 'Completed'
    },
    {
      id: 'CNT-2025-338',
      date: '2025-12-22',
      region: 'Uttar Pradesh - Meerut',
      disease: 'Yellow Rust (Wheat)',
      officer: 'Dr. Amit Singh',
      action: 'Chemical Treatment Advisory',
      economicImpact: '₹12.3 crore protected',
      status: 'Active',
      duration: '10 days'
    },
    {
      id: 'CNT-2025-335',
      date: '2025-12-18',
      region: 'Gujarat - Anand',
      disease: 'Stem Rot (Paddy)',
      officer: 'Dr. Nisha Patel',
      action: 'Field Monitoring Only',
      economicImpact: '₹4.2 crore at risk',
      status: 'Monitoring',
      duration: 'Ongoing'
    },
    {
      id: 'CNT-2025-330',
      date: '2025-12-15',
      region: 'Tamil Nadu - Coimbatore',
      disease: 'Leaf Blight (Cotton)',
      officer: 'Shri Murugan Subramanian',
      action: 'Targeted Containment (4km)',
      economicImpact: '₹9.7 crore protected',
      status: 'Closed',
      duration: 'Completed'
    },
    {
      id: 'CNT-2025-328',
      date: '2025-12-12',
      region: 'Rajasthan - Jaipur',
      disease: 'Downy Mildew (Mustard)',
      officer: 'Dr. Kavita Sharma',
      action: 'Advisory & Monitoring',
      economicImpact: '₹5.4 crore protected',
      status: 'Closed',
      duration: 'Completed'
    },
    {
      id: 'CNT-2025-325',
      date: '2025-12-08',
      region: 'West Bengal - Hooghly',
      disease: 'Blast Disease (Rice)',
      officer: 'Dr. Sourav Chatterjee',
      action: 'Targeted Containment (6km)',
      economicImpact: '₹18.5 crore protected',
      status: 'Closed',
      duration: 'Completed'
    }
  ];

  const filteredReports = reports.filter((report) => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = 
      report.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Active
        </span>;
      case 'Closed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Closed
        </span>;
      case 'Monitoring':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Monitoring
        </span>;
      default:
        return null;
    }
  };

  const handleExportPDF = () => {
    // Create demo PDF content
    const pdfContent = `
AGRICULTURAL DISEASE CONTAINMENT REPORT
=====================================

Generated: ${new Date().toLocaleDateString()}
Report Period: January 2025 - January 2026

EXECUTIVE SUMMARY
----------------
Total Decisions: 186
Currently Active: 8
Successfully Resolved: 142
Total Crop Value Protected: ₹428 Crore

DETAILED REPORTS
-----------------

${filteredReports.map(report => `
Case ID: ${report.id}
Date: ${report.date}
Region: ${report.region}
Disease: ${report.disease}
Action Taken: ${report.action}
Economic Impact: ${report.economicImpact}
Status: ${report.status}
Duration: ${report.duration}
Officer: ${report.officer}
----------------------------------------
`).join('\n')}

ACCOUNTABILITY & AUDIT TRAIL
----------------------------
All containment decisions are permanently logged with complete officer attribution, 
timestamps, and economic impact data. This system maintains full accountability 
for institutional review and policy analysis.

Report generated by: AgriPulseX Containment System
System Version: v2.1.0
Export ID: EXP-${Date.now()}
    `.trim();

    // Create a blob with the content
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `Containment_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <div>
            <h1 className="text-2xl text-gray-900 mb-1">Reports, History & Accountability</h1>
            <p className="text-sm text-gray-600">Complete audit trail of containment decisions and outcomes</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="text-2xl text-gray-900 mb-1">186</div>
            <div className="text-sm text-gray-600">Total Decisions (12 months)</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="text-2xl text-amber-700 mb-1">8</div>
            <div className="text-sm text-gray-600">Currently Active</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="text-2xl text-green-700 mb-1">142</div>
            <div className="text-sm text-gray-600">Successfully Resolved</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="text-2xl text-gray-900 mb-1">₹428 Cr</div>
            <div className="text-sm text-gray-600">Total Crop Value Protected</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Filter by Status:</span>
              </div>
              <div className="flex gap-2">
                {['all', 'Active', 'Closed', 'Monitoring'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      filterStatus === status
                        ? 'bg-[#2f9d58] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by region, disease, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded text-sm text-gray-900 w-80 focus:outline-none focus:ring-2 focus:ring-[#2f9d58] focus:ring-opacity-30"
              />
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Case ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Disease</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Action Taken</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Economic Impact</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Officer</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report, index) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{report.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{report.region}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{report.disease}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{report.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{report.economicImpact}</td>
                    <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{report.officer}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#2f9d58] text-white rounded text-sm hover:bg-[#237a3f] transition-colors shadow-sm"
                      >
                        <FileText className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredReports.length} of {reports.length} records
          </p>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export to PDF
          </button>
        </div>

        {/* Accountability Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">
                <strong>Audit & Transparency:</strong> All containment decisions are permanently logged with complete 
                officer attribution, timestamps, and economic impact data. This system maintains full accountability 
                for institutional review and policy analysis. Reports can be generated for ministerial briefings, 
                parliamentary questions, and external audits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedReport(null)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl border-2 border-[#2f9d58] p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close report details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Containment Report Details</h2>
                  <p className="text-lg font-semibold text-[#2f9d58]">{selectedReport.id}</p>
                </div>
                {getStatusBadge(selectedReport.status)}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Date Reported</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedReport.date}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Affected Region</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedReport.region}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Disease Type</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedReport.disease}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Responsible Officer</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedReport.officer}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Duration</span>
                  </div>
                  <p className="text-gray-900 font-medium">{selectedReport.duration}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">Economic Impact</span>
                  </div>
                  <p className="text-lg font-bold text-green-700">{selectedReport.economicImpact}</p>
                </div>
              </div>
            </div>

            {/* Action Taken Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Containment Action Taken</h3>
              </div>
              <p className="text-blue-800 font-medium">{selectedReport.action}</p>
            </div>

            {/* Additional Details */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-amber-800">Report Type:</span>
                  <span className="ml-2 text-amber-700">Disease Containment</span>
                </div>
                <div>
                  <span className="font-medium text-amber-800">Priority Level:</span>
                  <span className="ml-2 text-amber-700">
                    {selectedReport.status === 'Active' ? 'High' : selectedReport.status === 'Monitoring' ? 'Medium' : 'Resolved'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-amber-800">Last Updated:</span>
                  <span className="ml-2 text-amber-700">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-amber-800">Case Reference:</span>
                  <span className="ml-2 text-amber-700">{selectedReport.id}-2026</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f9d58]/50 transition-all shadow-sm hover:shadow-md"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Generate individual report PDF
                  const reportContent = `
DETAILED CONTAINMENT REPORT
============================

Case ID: ${selectedReport.id}
Date: ${selectedReport.date}
Region: ${selectedReport.region}
Disease: ${selectedReport.disease}
Officer: ${selectedReport.officer}
Action Taken: ${selectedReport.action}
Economic Impact: ${selectedReport.economicImpact}
Status: ${selectedReport.status}
Duration: ${selectedReport.duration}

Generated: ${new Date().toLocaleDateString()}
System: AgriPulseX Containment System v2.1.0
                  `.trim();
                  
                  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `Report_${selectedReport.id}_${new Date().toISOString().split('T')[0]}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#2f9d58] border-2 border-[#237a3f] rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-105 hover:bg-[#237a3f]"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

