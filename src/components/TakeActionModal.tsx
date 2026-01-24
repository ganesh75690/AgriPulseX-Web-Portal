import { useState } from 'react';
import { AlertTriangle, X, SprayCan, Truck, AlertCircle } from 'lucide-react';
import { API_CONFIG, createApiUrl } from '../api/config';
import authService from '../api/auth';

interface TakeActionModalProps {
  report: {
    id: string;
    farmerName: string;
    farmerId: string;
    village: string;
    district: string;
    cropType: string;
    disease: string;
    severity: string;
    confidence: number;
    submittedBy: string;
    submittedDate: string;
    status: string;
  };
  onClose: () => void;
  onActionComplete: (action: any) => void;
  onNavigate?: (page: string) => void;
}

export default function TakeActionModal({ report, onClose, onActionComplete, onNavigate }: TakeActionModalProps) {
  console.log('TakeActionModal rendered with report:', report);
  console.log('onNavigate prop:', onNavigate);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImmediateContainment = async () => {
    setIsSubmitting(true);
    try {
      const response = await authService.authenticatedFetch(
        createApiUrl(API_CONFIG.ENDPOINTS.TAKE_ACTION),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reportId: report.id,
            action: 'immediate-containment',
            timestamp: new Date().toISOString(),
            officerNotes: 'Immediate containment action initiated'
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Containment action successful:', result);
        onActionComplete({
          action: 'immediate-containment',
          reportId: report.id,
          timestamp: new Date().toISOString(),
          success: true,
          data: result
        });
      } else {
        throw new Error(`Failed to submit containment action: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting containment action:', error);
      onActionComplete({
        action: 'immediate-containment',
        reportId: report.id,
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
      onClose();
      if (onNavigate) onNavigate('containment');
    }
  };

  const handleSupplyTreatment = async () => {
    setIsSubmitting(true);
    try {
      const response = await authService.authenticatedFetch(
        createApiUrl(API_CONFIG.ENDPOINTS.TAKE_ACTION),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reportId: report.id,
            action: 'supply-treatment',
            timestamp: new Date().toISOString(),
            officerNotes: 'Treatment supplies requested'
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Supply treatment action successful:', result);
        onActionComplete({
          action: 'supply-treatment',
          reportId: report.id,
          timestamp: new Date().toISOString(),
          success: true,
          data: result
        });
      } else {
        throw new Error(`Failed to submit supply treatment action: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting supply treatment action:', error);
      onActionComplete({
        action: 'supply-treatment',
        reportId: report.id,
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
      onClose();
      if (onNavigate) onNavigate('supply-chain');
    }
  };

  const handleMonitorReview = async () => {
    setIsSubmitting(true);
    try {
      const response = await authService.authenticatedFetch(
        createApiUrl(API_CONFIG.ENDPOINTS.TAKE_ACTION),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reportId: report.id,
            action: 'monitor-review',
            timestamp: new Date().toISOString(),
            officerNotes: 'Follow-up monitoring scheduled'
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Monitor review action successful:', result);
        onActionComplete({
          action: 'monitor-review',
          reportId: report.id,
          timestamp: new Date().toISOString(),
          success: true,
          data: result
        });
      } else {
        throw new Error(`Failed to submit monitor review action: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting monitor review action:', error);
      onActionComplete({
        action: 'monitor-review',
        reportId: report.id,
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSubmitting(false);
      onClose();
      if (onNavigate) onNavigate('visual');
    }
  };

  const handleSubmit = async () => {
    // For now, just handle immediate containment as default action
    await handleImmediateContainment();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[75vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-end">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close modal">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Action Options */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">🚨 Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={handleImmediateContainment}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <SprayCan className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium">Immediate Containment</p>
                    <p className="text-sm text-gray-600">Deploy containment team to affected area</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={handleSupplyTreatment}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Supply Treatment</p>
                    <p className="text-sm text-gray-600">Arrange pesticide/fungicide delivery</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={handleMonitorReview}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Monitor & Review</p>
                    <p className="text-sm text-gray-600">Schedule follow-up inspection</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                Take Action
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
