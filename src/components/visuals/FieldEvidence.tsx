import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, AlertTriangle, Info, Shield, XCircle } from 'lucide-react';

export default function FieldEvidence() {
  const [uploadedImage, setUploadedImage] = useState(false);

  const handleUploadClick = () => {
    setUploadedImage(true);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#2f9d58]" />
              Field Evidence View - Image Detection Support
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Answering: "Do field conditions actually support this risk assessment?"
            </p>
          </div>
          {uploadedImage && (
            <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Evidence Supports Risk</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {!uploadedImage ? (
          /* Upload Interface */
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#2f9d58] hover:bg-gray-50 transition-all cursor-pointer" onClick={handleUploadClick}>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Upload className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Upload or Capture Field Evidence</h3>
              <p className="text-sm text-gray-600 mb-4 max-w-md">
                Upload crop images from field inspection for AI-assisted analysis. Images provide supporting signals 
                for risk assessment but do not trigger automatic actions.
              </p>
              <button className="px-6 py-3 bg-[#2f9d58] text-white rounded-lg hover:bg-[#237a3f] transition-colors text-sm shadow-sm">
                Select Field Image
              </button>
              <p className="text-xs text-gray-500 mt-3">Supported: JPG, PNG • Max 10MB</p>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-6">
            {/* Image Preview and Analysis Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Image Preview */}
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square bg-gradient-to-br from-green-100 via-yellow-100 to-green-200 flex items-center justify-center relative">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-700">Field Image Preview</p>
                    <p className="text-xs text-gray-600 mt-2">Potato Crop - Leaf Section</p>
                  </div>
                  {/* Simulated detection overlay */}
                  <div className="absolute top-4 left-4 w-24 h-24 border-2 border-red-500 rounded"></div>
                  <div className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white text-xs rounded">
                    Detected
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-300">
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span>2026-01-04, 10:45 AM</span>
                    <span className="text-blue-600">Block 12-A</span>
                  </div>
                </div>
              </div>

              {/* Detection Summary */}
              <div className="col-span-2 space-y-4">
                {/* Primary Detection */}
                <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-amber-900 mb-1">Detected Symptom Category</h4>
                      <p className="text-xs text-amber-800">
                        Leaf discoloration consistent with Late Blight fungal stress
                      </p>
                    </div>
                  </div>
                  
                  {/* Confidence Band */}
                  <div className="mt-4 pt-4 border-t border-amber-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-amber-800">Confidence Band</span>
                      <span className="text-sm text-amber-900">Moderate (68%)</span>
                    </div>
                    <div className="relative h-3 bg-amber-200 rounded-full overflow-hidden">
                      <div className="absolute h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex gap-1">
                          <div className="text-xs text-white">Low</div>
                          <div className="text-xs text-white mx-4">Moderate</div>
                          <div className="text-xs text-white">High</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image-Risk Correlation */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border-2 border-blue-200 rounded-lg shadow-sm">
                    <div className="text-xs text-blue-700 mb-2">Field Evidence Signal</div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-green-900">Supports Assessment</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Image analysis aligns with reported risk pattern
                    </p>
                  </div>

                  <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-700 mb-2">Recommended Action</div>
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-900">Verify in Field</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Physical inspection by agricultural expert required
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image + Risk Correlation Indicator */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
              <h3 className="text-sm text-blue-900 mb-4">Image Evidence & Risk Correlation Matrix</h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-4 bg-white rounded-lg border-2 border-green-300 shadow-sm">
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-700 mb-1">Image Signal</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-green-900">Detected</span>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border-2 border-green-300 shadow-sm">
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-700 mb-1">Field Reports</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-green-900">Supports</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg border-2 border-green-300 shadow-sm">
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-700 mb-1">Weather Data</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-green-900">Aligns</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg border-2 border-green-300 shadow-sm">
                  <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-700 mb-1">Combined Signal</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-green-900">Strong</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900">
                    <strong>Officer Guidance:</strong> Field evidence is evaluated alongside epidemiological and 
                    supply-chain signals. Image analysis <strong>supports</strong> the overall risk assessment. 
                    Final containment decision requires field verification by authorized agricultural officer.
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis History */}
            <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200">
              <h3 className="text-sm text-gray-900 mb-3">Recent Image Analyses (Last 7 days)</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 text-xs hover:shadow-sm transition-shadow">
                  <span className="text-gray-700">2026-01-04 10:45 AM</span>
                  <span className="text-amber-700">Possible Late Blight</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">Moderate</span>
                  <span className="text-gray-600">Block 12-A</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 text-xs hover:shadow-sm transition-shadow">
                  <span className="text-gray-700">2026-01-03 02:30 PM</span>
                  <span className="text-green-700">Healthy Crop</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded">High</span>
                  <span className="text-gray-600">Block 9-C</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 text-xs hover:shadow-sm transition-shadow">
                  <span className="text-gray-700">2026-01-02 11:15 AM</span>
                  <span className="text-yellow-700">Leaf Discoloration</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Low</span>
                  <span className="text-gray-600">Block 15-B</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Critical Disclaimer */}
        <div className="mt-6 p-5 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-red-700" />
            </div>
            <div>
              <h4 className="text-sm text-red-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Critical Disclaimer - Image Detection Limitations
              </h4>
              <p className="text-xs text-red-900 leading-relaxed mb-3">
                <strong>Image analysis is a supporting signal only and does not independently trigger containment actions.</strong> 
                All image-based detections must be verified by agricultural officers through physical field inspection. 
                AI-detected patterns provide preliminary insights but cannot replace expert human judgment and ground-truth validation.
              </p>
              <div className="p-3 bg-white rounded border border-red-300">
                <p className="text-xs text-red-900">
                  <strong>Officer Authority:</strong> Officers retain full authority and accountability for all containment 
                  decisions. Image detection serves as an additional data point to inform field verification priorities, 
                  not as a decision-making substitute.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
