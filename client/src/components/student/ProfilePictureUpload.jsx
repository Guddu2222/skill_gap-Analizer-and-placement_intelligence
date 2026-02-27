import React, { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { uploadProfilePicture } from '../../services/api';

const ProfilePictureUpload = ({ student, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await uploadProfilePicture(formData);
      if (onUploadSuccess) {
        onUploadSuccess(response.profilePicture, response.profileCompletionPercentage);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  const getInitials = () => {
    if (student?.firstName) return student.firstName[0];
    if (student?.user?.name) return student.user.name[0];
    return '?';
  };

  return (
    <div 
      className="relative w-24 h-24 rounded-2xl overflow-hidden group border border-white/20 bg-white/10 shadow-inner cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/jpg, image/webp" 
        className="hidden" 
      />

      {/* Image or Initials */}
      {student?.profilePicture ? (
        <img 
          src={student.profilePicture} 
          alt={`${student.firstName || 'Student'}'s profile`} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white backdrop-blur-md">
          {getInitials()}
        </div>
      )}

      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300 ${hovered || isUploading ? 'opacity-100' : 'opacity-0'}`}
      >
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <>
            <Camera className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs font-medium">Edit</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
