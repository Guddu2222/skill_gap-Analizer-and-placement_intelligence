import React, { useState } from 'react';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const EmailVerificationPage = ({ email: propEmail }) => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = propEmail || location.state?.email;

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          navigate('/login'); // Redirect to login or dashboard
        }, 2000);
      } else {
        setError(data.msg || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResent(true);
        setSuccess('Verification code resent!');
        setTimeout(() => setResent(false), 3000);
      } else {
        setError(data.msg || 'Failed to resend code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <p className="text-red-500">Error: Email not found. Please sign up again.</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mb-2">
                4
              </div>
              <span className="text-xs text-blue-600 font-medium">Verify</span>
            </div>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Email Icon */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Verify Your Email
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a verification code to
          </p>
          
          <p className="text-lg font-semibold text-blue-600 mb-8">
            {email}
          </p>

          {/* Verification Code Input */}
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

           {success && (
            <div className="flex items-center justify-center text-green-500 mb-4">
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          {/* Resend Button */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResend}
              disabled={resending || resent}
              className={`
                w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                ${resent
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : resending
                  ? 'bg-gray-100 text-gray-500 cursor-wait'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }
              `}
            >
              {resent ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Code Sent!
                </>
              ) : resending ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Resend Verification Code
                </>
              )}
            </button>
          </div>

          {/* Help Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a href="/support" className="text-blue-600 hover:text-blue-700 font-semibold">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
