import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  Upload, 
  Send, 
  BookOpen, 
  Camera, 
  MapPin, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Info,
  ArrowLeft,
  User,
  Calendar,
  Shield,
  Wifi,
  Battery,
  X
} from 'lucide-react';

interface HelpSupportProps {
  onBack: () => void;
}

interface QueryForm {
  category: string;
  message: string;
  screenshot: File | null;
}

interface FAQ {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export default function HelpSupport({ onBack }: HelpSupportProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'help' | 'query' | 'faq' | 'contact'>('guide');
  const [queryForm, setQueryForm] = useState<QueryForm>({
    category: '',
    message: '',
    screenshot: null
  });
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');

  const queryCategories = [
    'Technical Issue',
    'Report Submission Problem',
    'Image Upload Issue',
    'Login/Authentication',
    'Data Sync Problem',
    'Other'
  ];

  const faqs: FAQ[] = [
    {
      question: 'How to submit a crop disease report?',
      answer: 'Go to Dashboard → Submit Report → Fill farmer details → Upload crop image → Add location → Submit. Ensure image is clear and location is accurate.',
      icon: <FileText className="w-5 h-5 text-green-600" />
    },
    {
      question: 'What makes a high-quality report?',
      answer: 'A high-quality report has: Clear crop image (40 pts), Crop type selected (30 pts), Complete location (20 pts), Basic farmer info (10 pts). Aim for 80+ points.',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    },
    {
      question: 'Can I save report as draft?',
      answer: 'Yes! Click "Save as Draft" button. Your report will be saved locally and you can submit later when internet is available.',
      icon: <Shield className="w-5 h-5 text-green-600" />
    },
    {
      question: 'What image format is accepted?',
      answer: 'PNG and JPG formats are accepted. Maximum file size is 10MB. Ensure good lighting and focus on affected areas.',
      icon: <Camera className="w-5 h-5 text-green-600" />
    },
    {
      question: 'How to check report status?',
      answer: 'Go to Dashboard → My Reports. You can see all your submitted reports with their current status: Under Review, Approved, Action Required, or Resolved.',
      icon: <Calendar className="w-5 h-5 text-green-600" />
    },
    {
      question: 'What if internet is not available?',
      answer: 'Use "Save as Draft" feature. The app stores your data locally. When internet returns, you can submit all saved drafts.',
      icon: <Wifi className="w-5 h-5 text-green-600" />
    }
  ];

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQueryForm({ ...queryForm, screenshot: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryForm.category || !queryForm.message) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmittingQuery(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingQuery(false);
      setQuerySubmitted(true);
      setQueryForm({ category: '', message: '', screenshot: null });
      setScreenshotPreview('');
    }, 2000);
  };

  if (querySubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-2">Query Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your query has been forwarded to the helpdesk. You will receive a response within 24 hours.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-900">
              <strong>Query ID:</strong> Q{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm text-green-900 mt-1">
              <strong>Status:</strong> Under Review
            </p>
            <p className="text-sm text-green-900 mt-1">
              <strong>Expected Response:</strong> Within 24 hours
            </p>
          </div>
          <button
            onClick={() => setQuerySubmitted(false)}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Another Query
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-gray-900">Help & Support</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Field Employee Assistance Center
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-xs text-green-700">24/7 Support</div>
              <div className="text-sm text-green-900 mt-0.5">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8">
          <div className="flex space-x-8">
            {[
              { id: 'guide', label: 'How to Use', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'help', label: 'Contextual Help', icon: <Info className="w-4 h-4" /> },
              { id: 'query', label: 'Ask for Help', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
              { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 max-w-4xl mx-auto">
        {/* How to Use Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                How to Use This System
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Login to System',
                    description: 'Use your government credentials to access the portal',
                    icon: <User className="w-6 h-6 text-blue-600" />,
                    tips: ['Keep your credentials secure', 'Logout after each session']
                  },
                  {
                    step: 2,
                    title: 'Navigate to Dashboard',
                    description: 'View your assigned tasks and recent reports',
                    icon: <MapPin className="w-6 h-6 text-green-600" />,
                    tips: ['Check dashboard daily', 'Review assigned areas']
                  },
                  {
                    step: 3,
                    title: 'Submit New Report',
                    description: 'Click "Submit Report" to start data collection',
                    icon: <FileText className="w-6 h-6 text-purple-600" />,
                    tips: ['Fill all required fields', 'Ensure high data quality']
                  },
                  {
                    step: 4,
                    title: 'Upload Crop Image',
                    description: 'Take clear photo of affected crop area',
                    icon: <Camera className="w-6 h-6 text-orange-600" />,
                    tips: ['Good lighting required', 'Focus on symptoms', 'Include healthy parts for comparison']
                  },
                  {
                    step: 5,
                    title: 'Fill Farmer Details',
                    description: 'Enter complete farmer and location information',
                    icon: <User className="w-6 h-6 text-indigo-600" />,
                    tips: ['Verify farmer ID', 'Double-check contact number', 'Accurate location is crucial']
                  },
                  {
                    step: 6,
                    title: 'Submit Report',
                    description: 'Review and submit for AI analysis',
                    icon: <Send className="w-6 h-6 text-green-600" />,
                    tips: ['Check quality indicator', 'Save draft if needed', 'Wait for confirmation']
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                          Step {item.step}
                        </span>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <div className="space-y-1">
                        {item.tips.map((tip, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contextual Help */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-green-600" />
                Contextual Help & Tips
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    field: 'Farmer Name',
                    tip: 'Enter full name as per government records',
                    icon: <User className="w-4 h-4" />
                  },
                  {
                    field: 'Farmer ID',
                    tip: '6-digit government ID number only',
                    icon: <Shield className="w-4 h-4" />
                  },
                  {
                    field: 'Contact Number',
                    tip: '10-digit mobile number with country code +91',
                    icon: <Phone className="w-4 h-4" />
                  },
                  {
                    field: 'Land Area',
                    tip: 'Enter in acres, use decimal for partial areas',
                    icon: <MapPin className="w-4 h-4" />
                  },
                  {
                    field: 'Crop Image',
                    tip: 'Clear photo, good lighting, focus on symptoms',
                    icon: <Camera className="w-4 h-4" />
                  },
                  {
                    field: 'Location',
                    tip: 'Select from dropdown, ensure accuracy',
                    icon: <MapPin className="w-4 h-4" />
                  },
                  {
                    field: 'Quality Score',
                    tip: 'Aim for 80+ points for high-quality reports',
                    icon: <CheckCircle className="w-4 h-4" />
                  },
                  {
                    field: 'Draft Mode',
                    tip: 'Save locally when internet is unavailable',
                    icon: <Battery className="w-4 h-4" />
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.field}</h4>
                        <p className="text-xs text-gray-600">{item.tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ask for Help */}
        {activeTab === 'query' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Ask for Help / Raise Query
              </h2>
              
              <form onSubmit={handleSubmitQuery} className="space-y-6">
                <div>
                  <label htmlFor="query-category" className="block text-sm font-medium text-gray-700 mb-2">
                    Query Category *
                  </label>
                  <select
                    id="query-category"
                    required
                    value={queryForm.category}
                    onChange={(e) => setQueryForm({ ...queryForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {queryCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Issue *
                  </label>
                  <textarea
                    required
                    value={queryForm.message}
                    onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Please describe your issue in detail. Include steps you took and any error messages you saw..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screenshot (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    {screenshotPreview ? (
                      <div className="relative">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="max-w-full h-48 mx-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setQueryForm({ ...queryForm, screenshot: null });
                            setScreenshotPreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          aria-label="Remove screenshot"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 5MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                          id="screenshot-upload"
                        />
                        <label
                          htmlFor="screenshot-upload"
                          className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          Select Screenshot
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setQueryForm({ category: '', message: '', screenshot: null })}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingQuery}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmittingQuery ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Query
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-green-600" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {faq.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Email Support</h3>
                    </div>
                    <p className="text-green-900 font-medium">support@agripulsex.gov.in</p>
                    <p className="text-sm text-gray-600 mt-1">Response within 24 hours</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Helpline</h3>
                    </div>
                    <p className="text-blue-900 font-medium">1800-123-4567</p>
                    <p className="text-sm text-gray-600 mt-1">Toll-free number</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold text-gray-900">Office Hours</h3>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                      <p><strong>Saturday:</strong> 9:00 AM - 2:00 PM</p>
                      <p><strong>Sunday:</strong> Closed</p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Emergency Support</h3>
                    </div>
                    <p className="text-purple-900 font-medium">+91-11-2345-6789</p>
                    <p className="text-sm text-gray-600 mt-1">For urgent field issues only</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Always have your Employee ID ready when contacting support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>For technical issues, include screenshots and error messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Response time may vary during peak agricultural seasons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>All communications are logged for quality assurance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
