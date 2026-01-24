import { useState, useEffect } from 'react';
import { FileText, Clock, User, CheckCircle, AlertTriangle, XCircle, Scale, Shield } from 'lucide-react';

export interface AuditEntry {
  id: string;
  timestamp: string;
  officerId: string;
  officerName: string;
  decisionType: 'CONTAINMENT_APPROVED' | 'CONTAINMENT_REJECTED' | 'FIELD_VERIFICATION' | 'REVIEW_ESCALATED' | 'ARI_LOW_RISK_BLOCKED';
  region: string;
  disease: string;
  ariScore: number;
  ariLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  riskScore: number;
  decision: string;
  justification: string;
  evidenceSummary: string;
  governanceCompliance: 'COMPLIANT' | 'DEVIATION' | 'EXCEPTION';
  auditStatus: 'PENDING' | 'REVIEWED' | 'APPROVED';
  reviewerId?: string;
  reviewerName?: string;
  reviewNotes?: string;
}

interface GovernanceAuditTrailProps {
  entries?: AuditEntry[];
  onEntrySelect?: (entry: AuditEntry) => void;
  showFilters?: boolean;
  compact?: boolean;
}

export default function GovernanceAuditTrail({ 
  entries: propEntries, 
  onEntrySelect, 
  showFilters = true, 
  compact = false 
}: GovernanceAuditTrailProps) {
  const [entries, setEntries] = useState<AuditEntry[]>(propEntries || []);
  const [filters, setFilters] = useState({
    decisionType: 'ALL',
    governanceCompliance: 'ALL',
    dateRange: '7days'
  });
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  // Sample data for demonstration
  useEffect(() => {
    if (!propEntries) {
      const sampleEntries: AuditEntry[] = [
        {
          id: 'AUD-2024-001',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          officerId: 'DAO-PB-2018-4523',
          officerName: 'Dr. Rajesh Kumar Sharma',
          decisionType: 'CONTAINMENT_APPROVED',
          region: 'Punjab - Amritsar',
          disease: 'Late Blight (Potato)',
          ariScore: 85,
          ariLevel: 'HIGH',
          riskScore: 0.78,
          decision: 'Containment approved and implemented',
          justification: 'High disease severity confirmed by multiple reliable reports with strong clustering evidence. ARI indicates optimal readiness for immediate action.',
          evidenceSummary: '3 independent field reports, 87% confidence, high-quality images, multi-village clustering detected',
          governanceCompliance: 'COMPLIANT',
          auditStatus: 'APPROVED',
          reviewerId: 'DIR-AGR-2020-1123',
          reviewerName: 'Shri S. K. Patel',
          reviewNotes: 'Decision follows protocol. Evidence base sufficient. ARI compliance verified.'
        },
        {
          id: 'AUD-2024-002',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          officerId: 'DAO-MH-2019-3341',
          officerName: 'Ms. Priya Deshmukh',
          decisionType: 'ARI_LOW_RISK_BLOCKED',
          region: 'Maharashtra - Nashik',
          disease: 'Powdery Mildew (Grape)',
          ariScore: 35,
          ariLevel: 'LOW',
          riskScore: 0.42,
          decision: 'Action blocked by ARI - insufficient evidence',
          justification: 'ARI indicated LOW readiness with insufficient evidence. Field verification requested before any containment action.',
          evidenceSummary: '1 field report, 52% confidence, poor image quality, no clustering detected',
          governanceCompliance: 'COMPLIANT',
          auditStatus: 'REVIEWED',
          reviewerId: 'DIR-AGR-2020-1123',
          reviewerName: 'Shri S. K. Patel',
          reviewNotes: 'Correct application of ARI protocol. Prevented premature action.'
        },
        {
          id: 'AUD-2024-003',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          officerId: 'DAO-KA-2021-5623',
          officerName: 'Dr. R. Venkatesh',
          decisionType: 'FIELD_VERIFICATION',
          region: 'Karnataka - Bangalore Rural',
          disease: 'Bacterial Wilt (Tomato)',
          ariScore: 58,
          ariLevel: 'MEDIUM',
          riskScore: 0.55,
          decision: 'Field verification team dispatched',
          justification: 'Medium readiness with moderate evidence. Additional verification required before containment decision.',
          evidenceSummary: '2 reports, 68% confidence, moderate image quality, limited clustering',
          governanceCompliance: 'COMPLIANT',
          auditStatus: 'PENDING'
        }
      ];
      setEntries(sampleEntries);
    }
  }, [propEntries]);

  const filteredEntries = entries.filter(entry => {
    if (filters.decisionType !== 'ALL' && entry.decisionType !== filters.decisionType) return false;
    if (filters.governanceCompliance !== 'ALL' && entry.governanceCompliance !== filters.governanceCompliance) return false;
    return true;
  });

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'COMPLIANT': return 'text-green-700 bg-green-100 border-green-300';
      case 'DEVIATION': return 'text-amber-700 bg-amber-100 border-amber-300';
      case 'EXCEPTION': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-700 bg-green-100 border-green-300';
      case 'REVIEWED': return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'PENDING': return 'text-amber-700 bg-amber-100 border-amber-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'CONTAINMENT_APPROVED': return CheckCircle;
      case 'CONTAINMENT_REJECTED': return XCircle;
      case 'ARI_LOW_RISK_BLOCKED': return AlertTriangle;
      case 'FIELD_VERIFICATION': return User;
      case 'REVIEW_ESCALATED': return FileText;
      default: return FileText;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Governance Audit Trail
          </h3>
          <div className="text-xs text-gray-500">
            Last {entries.length} decisions
          </div>
        </div>
        <div className="space-y-2">
          {filteredEntries.slice(0, 3).map((entry) => {
            const Icon = getDecisionIcon(entry.decisionType);
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => onEntrySelect?.(entry)}
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 truncate">{entry.region}</div>
                  <div className="text-xs text-gray-500">{formatTimeAgo(entry.timestamp)}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full border ${getComplianceColor(entry.governanceCompliance)}`}>
                  {entry.governanceCompliance}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-gray-900 font-semibold">Governance & Audit Trail</h2>
              <p className="text-xs text-blue-700">Decision accountability and compliance tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-gray-600">Deviation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Exception</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex gap-4">
            <select
              value={filters.decisionType}
              onChange={(e) => setFilters(prev => ({ ...prev, decisionType: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by decision type"
            >
              <option value="ALL">All Decisions</option>
              <option value="CONTAINMENT_APPROVED">Containment Approved</option>
              <option value="CONTAINMENT_REJECTED">Containment Rejected</option>
              <option value="ARI_LOW_RISK_BLOCKED">ARI Blocked</option>
              <option value="FIELD_VERIFICATION">Field Verification</option>
              <option value="REVIEW_ESCALATED">Review Escalated</option>
            </select>
            <select
              value={filters.governanceCompliance}
              onChange={(e) => setFilters(prev => ({ ...prev, governanceCompliance: e.target.value }))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by governance compliance"
            >
              <option value="ALL">All Compliance</option>
              <option value="COMPLIANT">Compliant</option>
              <option value="DEVIATION">Deviation</option>
              <option value="EXCEPTION">Exception</option>
            </select>
          </div>
        </div>
      )}

      {/* Entries */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const Icon = getDecisionIcon(entry.decisionType);
            return (
              <div
                key={entry.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{entry.decisionType.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-gray-600">{entry.region} - {entry.disease}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getComplianceColor(entry.governanceCompliance)}`}>
                      {entry.governanceCompliance}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(entry.auditStatus)}`}>
                      {entry.auditStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-500">ARI Assessment</div>
                    <div className="text-sm font-medium text-gray-900">
                      {entry.ariLevel} Readiness ({entry.ariScore}/100)
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Risk Score</div>
                    <div className="text-sm font-medium text-gray-900">
                      {(entry.riskScore * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-700 mb-2">
                  <strong>Decision:</strong> {entry.decision}
                </div>

                <div className="text-sm text-gray-700 mb-2">
                  <strong>Justification:</strong> {entry.justification}
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  <strong>Evidence:</strong> {entry.evidenceSummary}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{entry.officerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(entry.timestamp)}</span>
                    </div>
                  </div>
                  <div>
                    ID: {entry.id}
                  </div>
                </div>

                {entry.reviewerName && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      <strong>Reviewed by:</strong> {entry.reviewerName}
                      {entry.reviewNotes && <div className="mt-1">{entry.reviewNotes}</div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No audit entries found</h3>
            <p className="text-sm text-gray-600">
              No decisions match the current filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
