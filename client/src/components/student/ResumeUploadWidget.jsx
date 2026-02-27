import React, { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, FileText, X, Loader2 } from 'lucide-react';
import axios from 'axios';

const ResumeUploadWidget = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('Please upload a PDF or Word document (.doc, .docx)');
      return false;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMessage('File size must be under 5MB');
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setErrorMessage('');
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setErrorMessage('');
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadState('idle');
    setErrorMessage('');
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadState('uploading');
    setErrorMessage('');
    
    // Simulate upload progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/student-features/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadState('success');
      
      // Notify parent component
      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess(response.data.resumeUrl, response.data.profileCompletionPercentage);
        }
      }, 1000);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Upload Error:', error);
      setUploadState('error');
      setErrorMessage(error.response?.data?.error || 'Failed to upload resume. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden transition-all duration-300">
      
      {/* Premium background gradient effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Upload Resume
            {uploadState === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
          </h3>
          <p className="text-slate-500 text-sm mt-1">Required to apply for placements and boost your profile visibility.</p>
        </div>
      </div>

      {uploadState === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-sm animate-pulse-once">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h4 className="text-emerald-800 font-bold mb-1">Upload Successful!</h4>
          <p className="text-emerald-600 text-sm">Your resume has been added to your profile.</p>
        </div>
      ) : (
        <div className="relative z-10">
          {!file ? (
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                isDragActive 
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' 
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <label 
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm transition-colors ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 border border-slate-100'}`}>
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-slate-700 font-bold text-base mb-1">
                  Drag & drop your resume here
                </h4>
                <p className="text-slate-500 text-sm mb-4">
                  or <span className="text-indigo-600 font-semibold hover:underline">browse files</span>
                </p>
                <div className="text-xs text-slate-400 font-medium bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                  PDF, DOC, DOCX up to 5MB
                </div>
              </label>
            </div>
          ) : (
            <div className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-5 shadow-inner">
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-4">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-slate-800 text-sm truncate w-48 md:w-64">{file.name}</h4>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {uploadState !== 'uploading' && (
                  <button 
                    onClick={removeFile}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {uploadState === 'error' && (
                <div className="text-sm text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 mb-4 font-medium flex items-center gap-2">
                  <X className="w-4 h-4" /> {errorMessage}
                </div>
              )}

              {uploadState === 'uploading' && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold text-indigo-700 mb-1.5">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300 relative overflow-hidden" 
                      style={{ width: `${uploadProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploadState === 'uploading'}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md
                  ${uploadState === 'uploading' 
                    ? 'bg-indigo-400 text-white cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 text-white'}`}
              >
                {uploadState === 'uploading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" /> Upload File
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploadWidget;
