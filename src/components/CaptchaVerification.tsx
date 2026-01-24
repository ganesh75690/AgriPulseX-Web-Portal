import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Shield, AlertCircle, Check, X, Image, Calculator, Type } from 'lucide-react';

interface CaptchaVerificationProps {
  onVerify: (success: boolean) => void;
  onCaptchaChange?: (value: string) => void;
  className?: string;
}

type CaptchaType = 'math' | 'image' | 'text';

interface CaptchaChallenge {
  type: CaptchaType;
  question: string;
  answer: string;
  options?: string[];
  imageData?: string[];
}

export default function CaptchaVerification({ onVerify, onCaptchaChange, className = '' }: CaptchaVerificationProps) {
  const [captchaType, setCaptchaType] = useState<CaptchaType>('math');
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [showError, setShowError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateMathChallenge = (): CaptchaChallenge => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1: number, num2: number, answer: number;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 10;
        num2 = 5;
        answer = 15;
    }

    return {
      type: 'math',
      question: `${num1} ${operation} ${num2} = ?`,
      answer: answer.toString()
    };
  };

  const generateTextChallenge = (): CaptchaChallenge => {
    const words = ['SECURITY', 'VERIFY', 'HUMAN', 'ACCESS', 'AGRI', 'PULSE', 'CROP', 'FIELD'];
    const word = words[Math.floor(Math.random() * words.length)];
    const distortedWord = word.split('').map(char => {
      if (Math.random() > 0.7) {
        return char.toLowerCase();
      }
      return char;
    }).join('');

    return {
      type: 'text',
      question: distortedWord,
      answer: word.toUpperCase()
    };
  };

  const generateImageChallenge = (): CaptchaChallenge => {
    const imageOptions = [
      '🚗', '🏠', '🌳', '🌻', '🚜', '🌾', '🍎', '🥕', '🌽', '🍅',
      '🚙', '🏢', '🌲', '🌺', '🚕', '🌿', '🍊', '🥔', '🌶️', '🍄'
    ];
    
    const targetImages = ['🚜', '🌾', '🌻', '🌽', '🥕']; // Agriculture-related
    const selectedTarget = targetImages[Math.floor(Math.random() * targetImages.length)];
    
    const allImages: string[] = [];
    const correctIndices: number[] = [];
    
    // Add 3-4 correct images
    const correctCount = Math.floor(Math.random() * 2) + 3;
    for (let i = 0; i < correctCount; i++) {
      allImages.push(selectedTarget);
      correctIndices.push(allImages.length - 1);
    }
    
    // Add 6-7 incorrect images
    while (allImages.length < 10) {
      const randomImage = imageOptions[Math.floor(Math.random() * imageOptions.length)];
      if (randomImage !== selectedTarget) {
        allImages.push(randomImage);
      }
    }
    
    // Shuffle the array
    for (let i = allImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
    }
    
    // Update correct indices after shuffle
    const finalCorrectIndices = allImages
      .map((img, idx) => img === selectedTarget ? idx : -1)
      .filter(idx => idx !== -1);

    return {
      type: 'image',
      question: `Select all images with: ${selectedTarget}`,
      answer: finalCorrectIndices.sort().join(','),
      options: allImages,
      imageData: allImages
    };
  };

  const generateNewChallenge = () => {
    setIsRefreshing(true);
    setShowError(false);
    setUserAnswer('');
    setSelectedImages([]);
    setIsVerified(false);
    
    setTimeout(() => {
      let newChallenge: CaptchaChallenge;
      
      switch (captchaType) {
        case 'math':
          newChallenge = generateMathChallenge();
          break;
        case 'text':
          newChallenge = generateTextChallenge();
          break;
        case 'image':
          newChallenge = generateImageChallenge();
          break;
        default:
          newChallenge = generateMathChallenge();
      }
      
      setChallenge(newChallenge);
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    generateNewChallenge();
  }, [captchaType]);

  useEffect(() => {
    if (challenge && captchaType === 'text' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add noise lines
        for (let i = 0; i < 5; i++) {
          ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.stroke();
        }
        
        // Text
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#2f9d58';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add slight rotation and position variation
        const letters = challenge.question.split('');
        const letterSpacing = canvas.width / (letters.length + 1);
        
        letters.forEach((letter, index) => {
          ctx.save();
          const x = letterSpacing * (index + 1);
          const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
          const rotation = (Math.random() - 0.5) * 0.3;
          
          ctx.translate(x, y);
          ctx.rotate(rotation);
          ctx.fillText(letter, 0, 0);
          ctx.restore();
        });
        
        // Add noise dots
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2, 2
          );
        }
      }
    }
  }, [challenge, captchaType]);

  const handleImageSelect = (index: number) => {
    if (isVerified) return;
    
    const newSelected = selectedImages.includes(index)
      ? selectedImages.filter(i => i !== index)
      : [...selectedImages, index];
    
    setSelectedImages(newSelected.sort());
  };

  const verifyAnswer = () => {
    if (!challenge || isVerified) return;
    
    let isCorrect = false;
    
    switch (challenge.type) {
      case 'math':
      case 'text':
        isCorrect = userAnswer.trim().toLowerCase() === challenge.answer.toLowerCase();
        break;
      case 'image':
        isCorrect = selectedImages.join(',') === challenge.answer;
        break;
    }
    
    if (isCorrect) {
      setIsVerified(true);
      setShowError(false);
      onVerify(true);
      if (onCaptchaChange) {
        onCaptchaChange(challenge.answer);
      }
    } else {
      setShowError(true);
      setAttempts(attempts + 1);
      onVerify(false);
      
      if (attempts >= 2) {
        setTimeout(() => {
          generateNewChallenge();
          setAttempts(0);
        }, 1000);
      }
    }
  };

  const switchCaptchaType = (type: CaptchaType) => {
    setCaptchaType(type);
    setAttempts(0);
  };

  if (!challenge) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2f9d58]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#2f9d58]" />
          <span className="text-sm font-medium text-gray-700">Security Verification</span>
          {isVerified && (
            <Check className="w-4 h-4 text-green-600" />
          )}
        </div>
        <button
          onClick={generateNewChallenge}
          disabled={isRefreshing}
          className="text-gray-500 hover:text-[#2f9d58] transition-colors disabled:opacity-50"
          title="Refresh CAPTCHA"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* CAPTCHA Type Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchCaptchaType('math')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            captchaType === 'math'
              ? 'bg-[#2f9d58] text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Calculator className="w-3 h-3" />
          Math
        </button>
        <button
          onClick={() => switchCaptchaType('text')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            captchaType === 'text'
              ? 'bg-[#2f9d58] text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Type className="w-3 h-3" />
          Text
        </button>
        <button
          onClick={() => switchCaptchaType('image')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            captchaType === 'image'
              ? 'bg-[#2f9d58] text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Image className="w-3 h-3" />
          Images
        </button>
      </div>

      {/* CAPTCHA Challenge */}
      <div className="bg-white rounded border border-gray-300 p-4 mb-3">
        {captchaType === 'math' && (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {challenge.question}
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="w-full max-w-xs mx-auto px-3 py-2 border border-gray-300 rounded text-center focus:border-[#2f9d58] focus:outline-none"
              disabled={isVerified}
            />
          </div>
        )}

        {captchaType === 'text' && (
          <div className="text-center">
            <canvas
              ref={canvasRef}
              width={200}
              height={60}
              className="border border-gray-300 rounded mx-auto mb-3"
            />
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter the text shown above"
              className="w-full max-w-xs mx-auto px-3 py-2 border border-gray-300 rounded text-center focus:border-[#2f9d58] focus:outline-none"
              disabled={isVerified}
            />
          </div>
        )}

        {captchaType === 'image' && challenge.imageData && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3 text-center">
              {challenge.question}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {challenge.imageData.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  disabled={isVerified}
                  className={`aspect-square border-2 rounded-lg flex items-center justify-center text-2xl transition-all ${
                    selectedImages.includes(index)
                      ? 'border-[#2f9d58] bg-green-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  } ${isVerified ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {image}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {showError && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-red-50 border border-red-200 rounded">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-700">
            Incorrect verification. Please try again.
            {attempts >= 2 && ' Generating new challenge...'}
          </span>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={verifyAnswer}
        disabled={isVerified || (!userAnswer && selectedImages.length === 0)}
        className={`w-full py-2 rounded font-medium transition-all ${
          isVerified
            ? 'bg-green-600 text-white cursor-not-allowed'
            : 'bg-[#2f9d58] text-white hover:bg-[#237a3f] disabled:bg-gray-300 disabled:cursor-not-allowed'
        }`}
      >
        {isVerified ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            Verified Successfully
          </span>
        ) : (
          'Verify'
        )}
      </button>

      <div className="mt-2 text-xs text-gray-500 text-center">
        This helps us protect against automated abuse
      </div>
    </div>
  );
}
