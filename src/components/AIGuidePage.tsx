import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Sparkles, Send, X, TrendingUp, AlertTriangle, CheckCircle, Activity, Zap, Search, Globe, ExternalLink } from 'lucide-react';

interface AIGuidePageProps {
  onBack?: () => void;
}

// Language Context
type Language = 'en' | 'hi';

const translations = {
  en: {
    aiGuideTitle: 'AgriPulseX AI Guide',
    aiGuideSubtitle: 'Your intelligent assistant for officer guidance',
    welcomeToAIGuide: 'Welcome to AI Guide',
    hereToHelp: 'I\'m here to help you with:',
    reportGuidelines: 'Report submission guidelines',
    diseaseProtocols: 'Disease identification protocols',
    containmentProcedures: 'Containment procedures',
    systemNavigation: 'System navigation',
    askPlaceholder: 'Ask me about reports, diseases, containment procedures...',
    send: 'Send',
    poweredByAI: 'Powered by AI • Responses are for guidance purposes only',
    backToDashboard: 'Back to Dashboard'
  },
  hi: {
    aiGuideTitle: 'एग्रीपल्सएक्स एआई गाइड',
    aiGuideSubtitle: 'अधिकारी मार्गदर्शन के लिए आपका बुद्धिमान सहायक',
    welcomeToAIGuide: 'एआई गाइड में आपका स्वागत है',
    hereToHelp: 'मैं आपकी सहायता के लिए यहां हूँ:',
    reportGuidelines: 'रिपोर्ट प्रस्तुति दिशानिर्देश',
    diseaseProtocols: 'रोग पहचान प्रोटोकॉल',
    containmentProcedures: 'नियंत्रण प्रक्रियाएं',
    systemNavigation: 'सिस्टम नेविगेशन',
    askPlaceholder: 'रिपोर्ट, रोग, नियंत्रण प्रक्रियाओं के बारे में पूछें...',
    send: 'भेजें',
    poweredByAI: 'एआई द्वारा संचालित • प्रतिक्रियाएं केवल मार्गदर्शन उद्देश्यों के लिए हैं',
    backToDashboard: 'डैशबोर्ड पर वापस जाएं'
  }
};

export default function AIGuidePage({ onBack }: AIGuidePageProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [guideMessages, setGuideMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [guideInput, setGuideInput] = useState('');
  const [isGuideLoading, setIsGuideLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'ai' | 'google'>('ai');
  const [googleResults, setGoogleResults] = useState<Array<{title: string, url: string, snippet: string}>>([]);
  const [isSearchingGoogle, setIsSearchingGoogle] = useState(false);

  const handleGuideMessage = async (preFilledQuestion?: string) => {
    const questionToProcess = preFilledQuestion || guideInput;
    
    if (!questionToProcess.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: questionToProcess,
      timestamp: new Date()
    };

    setGuideMessages(prev => [...prev, userMessage]);
    setGuideInput('');
    setIsGuideLoading(true);

    try {
      // Faster response time - reduced from 1500ms to 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let aiResponse = '';
      const lowerInput = questionToProcess.toLowerCase();
      
      // Optimized keyword matching with early returns
      if (lowerInput.includes('report') || lowerInput.includes('submit')) {
        aiResponse = `📋 **Report Submission Guidelines**

**Quick Steps:**
1. 📸 Take clear photos of affected areas
2. 📍 Add location details (GPS preferred)
3. 🌾 Specify crop type and affected area
4. 📝 Describe symptoms clearly
5. ✅ Submit and get confirmation ID

**Best Practices:**
• Multiple angles for photos
• Include scale reference (coin/ruler)
• Submit during daylight
• Check status in "My Reports"

**Timeline:** Review within 24 hours

Need specific help with any step?`;
      } else if (lowerInput.includes('disease') || lowerInput.includes('identify') || lowerInput.includes('symptom')) {
        aiResponse = `🦠 **Common Crop Diseases - Quick ID**

**Leaf Blight:** Brown spots → Remove leaves → Apply fungicide

**Wheat Rust:** Orange pustules → Rust-resistant varieties → Fungicide spray

**Bacterial Blight:** Water-soaked spots → Copper spray → Improve drainage

**Quick ID Steps:**
1. Check leaf patterns/colors
2. Note affected plant parts
3. Consider weather conditions
4. Use Image Detection tool for confirmation

**Action:** Submit photos to AI analysis immediately

What symptoms are you seeing?`;
      } else if (lowerInput.includes('containment') || lowerInput.includes('control') || lowerInput.includes('quarantine')) {
        aiResponse = `🛡️ **Containment - Fast Action**

**Immediate Steps (First 2 Hours):**
1. 🚫 Isolate area with flags/tape
2. 🧤 Put on protective gear
3. 🗑️ Remove affected plants
4. 📸 Document with photos

**Severity Response:**
• **Low:** Monitor + treat affected plants
• **Medium:** Treat surrounding area + daily checks
• **High:** Full quarantine + immediate treatment

**Safety:** Gloves, mask, sanitize tools

**Timeline:** Monitor 7-14 days, then weekly for 1 month

What's the severity level?`;
      } else if (lowerInput.includes('dashboard') || lowerInput.includes('navigate') || lowerInput.includes('system')) {
        aiResponse = `📊 **Dashboard Navigation - Quick Guide**

**Sidebar Menu:**
🏠 Dashboard - Main overview
⚠️ Containment - Active cases
📈 Fatigue Monitor - Regional stress
👁️ Visual Intelligence - Satellite data
📋 Reports - All submitted reports
✨ **AI Guide** - This assistant!
👤 Profile - Your settings

**Quick Actions:**
• Click any sidebar item to navigate
• Use "Back" button to return
• 🔔 Notifications for alerts
• Real-time data updates

**Need help with a specific feature?**`;
      } else if (lowerInput.includes('help') || lowerInput.includes('assist') || lowerInput.includes('support')) {
        aiResponse = `🤝 **AI Assistant - Ready to Help!**

**I can help with:**
📋 Report submission & tracking
🦠 Disease ID & treatment
🛡️ Containment procedures
📊 System navigation
💡 Best practices

**Tips for best results:**
• Be specific about crop type
• Describe symptoms clearly
• Mention severity level
• Include your role/task

**Examples:**
• "Help with wheat rust report"
• "Leaf blight containment steps"
• "How to check report status"

**What do you need help with?**`;
      } else {
        aiResponse = `🤖 **AgriPulseX AI Assistant**

I help with agricultural disease management!

**Quick Options:**
📋 "How to submit report?"
🦠 "Disease symptoms guide"
🛡️ "Containment procedures"
📊 "Dashboard navigation"

**For specific help, tell me:**
• Crop type (wheat, rice, etc.)
• Symptoms you see
• Severity level
• Your task/role

**Ready to assist! What do you need?**`;
      }

      const response = {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date()
      };

      setGuideMessages(prev => [...prev, response]);
    } catch (error) {
      const errorResponse = {
        role: 'assistant' as const,
        content: '❌ Error: Please try again or contact admin.',
        timestamp: new Date()
      };
      setGuideMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsGuideLoading(false);
    }
  };

  const handleGoogleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearchingGoogle(true);
    setGoogleResults([]);

    try {
      // Simulate Google search results (in real implementation, you'd use Google Custom Search API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock search results based on agricultural context
      const mockResults = generateMockSearchResults(query);
      setGoogleResults(mockResults);
    } catch (error) {
      console.error('Google search error:', error);
      setGoogleResults([]);
    } finally {
      setIsSearchingGoogle(false);
    }
  };

  const generateMockSearchResults = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Agricultural-specific search results
    if (lowerQuery.includes('wheat') || lowerQuery.includes('crop')) {
      return [
        {
          title: "Wheat Disease Management - ICAR",
          url: "https://icar.org.in/wheat-disease-management",
          snippet: "Comprehensive guide for identifying and managing wheat diseases including rust, blight, and powdery mildew."
        },
        {
          title: "Agricultural Department - Crop Protection",
          url: "https://agriculture.gov.in/crop-protection",
          snippet: "Official guidelines for crop protection, pesticide usage, and integrated pest management practices."
        },
        {
          title: "Kisan Portal - Wheat Cultivation",
          url: "https://kisan.gov.in/wheat-cultivation",
          snippet: "Complete resource for wheat farmers including sowing time, irrigation, fertilizer, and disease control."
        }
      ];
    } else if (lowerQuery.includes('disease') || lowerQuery.includes('pest')) {
      return [
        {
          title: "Plant Disease Diagnosis - IARI",
          url: "https://iari.res.in/plant-disease-diagnosis",
          snippet: "Indian Agricultural Research Institute's comprehensive database of plant diseases and diagnostic methods."
        },
        {
          title: "Pest Management - Pesticide Board",
          url: "https://ppcb.gov.in/pest-management",
          snippet: "Central Insecticide Board's guidelines for safe and effective pest management in agriculture."
        }
      ];
    } else {
      return [
        {
          title: "Agriculture Ministry - Farmer Resources",
          url: "https://agriculture.gov.in/farmer-resources",
          snippet: "Ministry of Agriculture's comprehensive resource center for Indian farmers with schemes and guidelines."
        },
        {
          title: "Kisan Call Center - 1800-180-1551",
          url: "https://kisan.gov.in/call-center",
          snippet: "24x7 farmer helpline providing agricultural information and grievance redressal services."
        },
        {
          title: "e-NAM - National Agriculture Market",
          url: "https://enam.gov.in",
          snippet: "Electronic National Agriculture Market for online trading of agricultural commodities."
        }
      ];
    }
  };

  const handleSearchSubmit = () => {
    if (searchMode === 'google') {
      handleGoogleSearch(guideInput);
    } else {
      handleGuideMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <X className="w-4 h-4" />
                {translations[language].backToDashboard}
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{translations[language].aiGuideTitle}</h1>
                <p className="text-purple-100">{translations[language].aiGuideSubtitle}</p>
              </div>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-purple-100">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white text-white"
              aria-label="Select language"
            >
              <option value="en" className="text-gray-900">English</option>
              <option value="hi" className="text-gray-900">हिंदी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {guideMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{translations[language].welcomeToAIGuide}</h2>
                <p className="text-gray-600 mb-8 text-lg">{translations[language].hereToHelp}</p>
                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div 
                    onClick={() => {
                      const reportQuestion = "How do I submit a report?";
                      handleGuideMessage(reportQuestion);
                    }}
                    className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer border border-purple-200 hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-medium">{translations[language].reportGuidelines}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const diseaseQuestion = "What are common crop diseases and their symptoms?";
                      handleGuideMessage(diseaseQuestion);
                    }}
                    className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer border border-purple-200 hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="text-2xl mb-2">🦠</div>
                    <div className="font-medium">{translations[language].diseaseProtocols}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const containmentQuestion = "What are the containment procedures for disease outbreaks?";
                      handleGuideMessage(containmentQuestion);
                    }}
                    className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer border border-purple-200 hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="text-2xl mb-2">🛡️</div>
                    <div className="font-medium">{translations[language].containmentProcedures}</div>
                  </div>
                  <div 
                    onClick={() => {
                      const navigationQuestion = "How do I navigate the AgriPulseX dashboard?";
                      handleGuideMessage(navigationQuestion);
                    }}
                    className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer border border-purple-200 hover:border-purple-300 hover:shadow-md"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-medium">{translations[language].systemNavigation}</div>
                  </div>
                </div>
              </div>
            )}

            {guideMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-sm leading-relaxed">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isGuideLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {/* Search Mode Toggle */}
            <div className="flex items-center justify-center mb-3 gap-2">
              <button
                onClick={() => setSearchMode('ai')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  searchMode === 'ai' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                AI Assistant
              </button>
              <button
                onClick={() => setSearchMode('google')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  searchMode === 'google' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Google Search
              </button>
            </div>

            {/* Google Search Results */}
            {searchMode === 'google' && googleResults.length > 0 && (
              <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4 max-h-60 overflow-y-auto">
                <div className="text-sm font-medium text-gray-700 mb-3">Search Results:</div>
                {googleResults.map((result, index) => (
                  <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                        >
                          {result.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{result.snippet}</p>
                        <p className="text-xs text-blue-500 mt-1">{result.url}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Google Search Loading */}
            {searchMode === 'google' && isSearchingGoogle && (
              <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm text-gray-600">Searching Google...</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                value={guideInput}
                onChange={(e) => setGuideInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                placeholder={searchMode === 'google' ? 'Search Google for agricultural information...' : translations[language].askPlaceholder}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGuideLoading || isSearchingGoogle}
              />
              <button
                onClick={handleSearchSubmit}
                disabled={isGuideLoading || isSearchingGoogle || !guideInput.trim()}
                className={`px-6 py-3 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 ${
                  searchMode === 'google' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {searchMode === 'google' ? (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {translations[language].send}
                  </>
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              {searchMode === 'google' 
                ? 'Google Search results powered by agricultural databases • Links open in new tab'
                : translations[language].poweredByAI
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
