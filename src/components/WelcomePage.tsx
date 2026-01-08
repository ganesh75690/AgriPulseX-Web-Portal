import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Users, TrendingUp, FileCheck, ArrowRight } from 'lucide-react';

interface WelcomePageProps {
  onContinue: () => void;
}

export default function WelcomePage({ onContinue }: WelcomePageProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const cards = [
    {
      icon: Shield,
      title: 'What AgriPulseX Does',
      points: [
        'Monitors crop disease risks across national agricultural zones',
        'Analyzes supply-chain vulnerabilities and economic dependencies',
        'Provides AI-assisted containment recommendations with full explanations',
        'Tracks farmer income protection and regional economic impact'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Decisions This System Supports',
      points: [
        'Containment zone designation with evidence-based radius recommendations',
        'Supply-chain route optimization during disease outbreaks',
        'Economic impact assessment before implementing restrictions',
        'Policy justification documentation for ministerial review'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'What This System Does NOT Do',
      points: [
        'Does not automatically enforce containment without officer approval',
        'Does not replace field verification and ground-truth validation',
        'Does not make autonomous decisions affecting farmer livelihoods',
        'Does not override established agricultural policy frameworks'
      ]
    },
    {
      icon: Users,
      title: 'Human-in-the-Loop Responsibility',
      points: [
        'Every recommendation requires officer review and approval',
        'AI provides analysis; officers provide accountability and judgment',
        'System explains reasoning to support informed decision-making',
        'All actions are logged with officer identity for institutional audit'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Farmer & Economic Protection Focus',
      points: [
        'Prioritizes minimizing disruption to farmer income streams',
        'Evaluates economic consequences before recommending restrictions',
        'Suggests targeted interventions instead of blanket bans',
        'Balances disease containment with agricultural market stability'
      ]
    },
    {
      icon: FileCheck,
      title: 'Your Responsibility as an Officer',
      points: [
        'Verify system recommendations against field intelligence',
        'Apply local knowledge and contextual understanding to decisions',
        'Document rationale when overriding or modifying recommendations',
        'Ensure decisions align with both disease control and farmer welfare'
      ]
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="bg-[#2f9d58] text-white py-8 px-8 border-b-4 border-[#237a3f]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-2xl">Officer System Orientation</h1>
              <p className="text-sm text-white/70 mt-1">AgriPulseX - Decision Intelligence System</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white/10 rounded border border-white/20">
            <p className="text-sm leading-relaxed">
              You are about to access a national-level decision support system. This platform assists in making 
              responsible, evidence-based containment decisions that protect both public health and farmer livelihoods. 
              Please review the following guidance before proceeding.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="px-8 py-12 min-h-screen"
        style={{
          backgroundImage: 'url(/agri2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-6 mb-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
                style={{
                  animation: fadeIn ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#2f9d58]/10 rounded flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#2f9d58]" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-1">{card.title}</h3>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {card.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-[#2f9d58] rounded-full flex-shrink-0 mt-1.5"></div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-amber-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Critical Reminder: Accountability & Transparency
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed">
            As a government officer using this system, you are entrusted with decisions that affect farmer livelihoods, 
            regional economies, and agricultural supply chains. All actions taken through AgriPulseX are permanently logged 
            with your officer credentials for institutional audit and review. The system provides recommendations, but 
            final accountability rests with you. Use this platform responsibly and in accordance with established 
            agricultural policy frameworks.
          </p>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <div className="mb-4">
            <label className="flex items-center justify-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-4 h-4 text-[#2f9d58] border-gray-300 rounded focus:ring-[#2f9d58] focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                I have read and understood the system guidelines and my responsibilities as an officer
              </span>
            </label>
          </div>
          <button
            onClick={onContinue}
            disabled={!acknowledged}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded transition-colors ${
              acknowledged 
                ? 'bg-[#2f9d58] text-white hover:bg-[#237a3f]' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>I Understand – Proceed to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-500 mt-3">
            By proceeding, you acknowledge that you have read and understood the system guidelines
          </p>
        </div>
      </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

